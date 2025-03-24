import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/client';

const groupData = (data) => {
  const grouped = {};

  data.forEach(entry => {
    const pool = entry.pool;
    const market = entry.market_name;
    const rack = entry.rack_name;
    const host = {
      host_name: entry.host_name,
      nodetype: entry.nodetype,
      kpis: entry.kpis,
      kpiHeaders: entry.kpiHeaders
    };

    if (!grouped[pool]) {
      grouped[pool] = {};
    }

    if (rack) {
      if (!grouped[pool][market]) {
        grouped[pool][market] = {};
      }

      if (!grouped[pool][market][rack]) {
        grouped[pool][market][rack] = [];
      }

      grouped[pool][market][rack].push(host);
    } else {
      if (!grouped[pool][market]) {
        grouped[pool][market] = {};
      }

      if (!grouped[pool][market]['SMFRACK']) {
        grouped[pool][market]['SMFRACK'] = [];
      }

      grouped[pool][market]['SMFRACK'].push(host);
    }
  });

  return grouped;
}

const getFilters = (data) => {
  return data.reduce((acc, curr) => {
    if (acc.pools.indexOf(curr.pool) === -1) {
      acc.pools.push(curr.pool)
    }

    if (acc.markets.indexOf(curr.market_name) === -1) {
      acc.markets.push(curr.market_name)
    }

    if (acc.racks.indexOf(curr.rack_name) === -1) {
      acc.racks.push(curr.rack_name)
    }

    if (acc.nodetype.indexOf(curr.nodetype) === -1) {
      acc.nodetype.push(curr.nodetype)
    }

    if (acc.regions.indexOf(curr.timezone) === -1) {
      acc.regions.push(curr.timezone)
    }

    return acc
  }, {
    nodetype: ['All'],
    regions: ['All'],
    pools: ['All'],
    markets: ['All'],
    racks: ['All']
  })
}

const buildQuery = (url, params) => {
  return `${url}?${new URLSearchParams(params).toString()}`;
}

const processFilters = (filters, data) => {
  if (Object.keys(filters).length) {
    let filtered = data.filter((node) => {
      if (filters.nodetype && filters.nodetype !== 'All' && filters.nodetype !== node.nodetype) {
        return false
      } else if (filters.regions && filters.regions !== 'All' && filters.regions !== node.pool) {
        return false
      } else if (filters.pools && filters.pools !== 'All' && filters.pools !== node.pool) {
        return false
      }
      if (filters.markets && filters.markets !== 'All' && filters.markets !== node.market_name) {
        return false
      }
      if (filters.racks && filters.racks !== 'All' && filters.racks !== node.rack_name) {
        return false
      }
      return true;
    });

    return filtered
  } else {
    return data;
  }
}

const processPriority = (filters, state) => {
  let filtered = state.data.filter((node) => {
    if (node.host_name && node.host_name != 'null') {
      return (filters.includes(state.priorityData[node.host_name]))
    } else if (node.rack_name && node.rack_name != 'null') {
      return filters.includes(state.priorityData[node.rack_name])
    } else if (node.market_name && node.market_name != 'null') {
      return filters.includes(state.priorityData[node.market_name])
    } else {
      return false
    }
  })

  // if (!filters.includes('oor')) {
  //   filtered = filtered.filter((_) => {
  //     return (state.nest[_.host_name] == 'InService' || state.nest[_.host_name] == 'NOT_FOUND')
  //   })
  // } else {
  //   filtered = filtered.filter((_) => {
  //     return (state.nest[_.host_name] != 'InService' && state.nest[_.host_name] != 'NOT_FOUND')
  //   })
  // }

  return processFilters(state.filters, filtered);
}

const setPriorityDataFunc = (stats, nest) => {
  const priorityData = {};
  Object.keys(stats).forEach((key) => {
    if(!(stats[key].length)){
      return;
    }
    const pr = stats[key].map(_ => _.priority)
    const priority = [...new Set(pr)];
    if (nest && (nest[key] != 'InService' && nest[key] != 'NOT_FOUND')) {
      priorityData[key] = 'oor'
    } else {
      if (priority.length > 0) {
        if (priority.indexOf('critical') !== -1) {
            priorityData[key] = 'critical'
        } else if (priority.indexOf('major') !== -1) {
            priorityData[key] = 'major'
        } else if (priority.indexOf('minor') !== -1) {
            priorityData[key] = 'minor'
        } else if (priority.indexOf('normal') !== -1) {
            priorityData[key] = 'normal'
        } else {
            priorityData[key] = 'oor'
        }
    }
    }
  })

  return priorityData;
}

const processNotes = (data) => {
  if (data && data.length) {
    return data.reduce((acc, curr) => {
      if (!acc[curr.host_name]) {
        acc[curr.host_name] = [];
      }
      acc[curr.host_name].push(curr);
      return acc
    }, {});
  } else {
    return {}
  }
}

export const fetchApi = createAsyncThunk(
  'api/fetchApi',
  async ({ url, query, type }, { rejectWithValue }) => {
    try {
      const uri = query ? buildQuery(url, query) : url;
      const resp = await axiosClient.get(uri);
      return { type, data: resp.data };
    } catch (err) {
      return rejectWithValue({ type, data: [] });
    }
  }
);

// Initial state
const initialState = {
  data: [],
  nodes: [],
  nest: [],
  notes: [],
  stats: [],
  loading: false,
  error: null,
  baseFilters: [],
  filters: {
    nodetype: 'All',
    regions: 'All',
    pools: 'All',
    markets: 'All',
    racks: 'All'
  },
  filteredNodes: [],
  locationMapping: {},
  priorityFilters: ['normal', 'major', 'minor', 'critical'],
  priorityData: {},
  notes: {},
  nest: {}
};
//added this below function to filter markets for selected pool
const getFilteredMarkets = (data,filters)=>{
  if(filters.pools === 'All' && filters.nodetype === 'All'){
    return['All',...new Set(data.map(node=>node.market_name).filter(market=>market != null))];
  }
  const filteredData = data.filter(node=>
  (filters.pools === 'All' || node.pool === filters.pools) &&
  (filters.nodetype === 'All' || node.nodetype === filters.nodetype)
  );
  return[
    'All',
    ...new Set(
      filteredData
      .map(node=>node.market_name)
      .filter(market=>market != null)
    )
  ];
};
//added this function to filter Racks for selected pool and markets
const getFilteredRacks = (data,filters)=>{
  if(filters.pools === 'All' && filters.nodetype === 'All'){
    return['All',...new Set(data.map(node=>node.rack_name).filter(rack=>rack != null))];
  }
  const filteredData = data.filter(node=>
  (filters.pools === 'All' || node.pool === filters.pools) &&
  (filters.nodetype === 'All' || node.nodetype === filters.nodetype) &&
  (filters.markets === 'All' || node.market_name === filters.markets)
  );
  return[
    'All',
    ...new Set(
      filteredData
      .map(node=>node.rack_name)
      .filter(rack=>rack != null)
    )
  ];
};
const nodeSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const {selected, data} = action.payload;
      if(selected.nodetype === 'smf'){
        selected.racks = 'All'
      }
      const filtered = processFilters(selected, data);
      state.filters = selected;
      const allNodeTypes = ['All',...new Set(data.map(node=> node.nodetype).filter(Boolean))];//to get both UPF and SMF in filter
      state.baseFilters = {
        ...getFilters(filtered),
        nodetype:allNodeTypes,
        markets:getFilteredMarkets(data,selected),
        racks:getFilteredRacks(data,selected)
      };
      state.nodes = groupData(filtered);
      if(!state.baseFilters.markets.includes(selected.markets)){
        state.filters.markets = 'All';
      }
      if(!state.baseFilters.racks.includes(selected.racks)){
        state.filters.racks = 'All'
      }
    },
    resetFilters: (state, action) => {
      state.filters = {
        nodetype: 'All',
        regions: 'All',
        pools: 'All',
        markets: 'All',
        racks: 'All'
      };
      state.priorityFilters = ['normal', 'major', 'minor', 'critical']
      state.baseFilters = getFilters(action.payload);
      state.nodes = groupData(action.payload);
      state.search = "";
    },
    setPriorityFilter: (state, action) => {
      const {current, filters} = action.payload;
      if(filters.length){
        state.priorityFilters = filters;
        const processed = processPriority(filters, current);
        // if (processed.length) {
          state.nodes = groupData(processed)
        // }
      }else {
        state.nodes = []
      }
    },
    setSearch: (state, action) => {
      const {search, selected, data} = action.payload;
      const notefiltered = data.filter(_ => _.host_name?.toLowerCase()?.includes(search?.toLowerCase()));
      const poolfiltered = data.filter(_ => _.pool?.toLowerCase()?.includes(search?.toLowerCase()));
      const marketfiltered = data.filter(_ => _.market_name?.toLowerCase()?.includes(search?.toLowerCase()));
      const rackfiltered = data.filter(_ => _.rack_name?.toLowerCase()?.includes(search?.toLowerCase()));
      const seen = {};
      const filtered = [...notefiltered, ...poolfiltered, ...marketfiltered, ...rackfiltered].filter(item => !(item.host_name in seen) && (seen[item.host_name] = true));
      const appliedFiltered = processFilters(selected, filtered);
      state.baseFilters = getFilters(appliedFiltered);
      state.nodes = groupData(appliedFiltered);
      state.filters = selected;
      state.search =search;
    },
    setNotesData: (state, action) => {
      state.notes = processNotes(action.payload)
    },
    setNestData: (state, action) => {
      const {current, nest} = action.payload;
      state.nest = nest;
      state.priorityData = setPriorityDataFunc(current.stats, nest);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApi.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.type) {
          if (action.payload.data) {
            if (action.payload.type === 'nodes') {
              state.data = action.payload.data.config;
              state.baseFilters = getFilters(action.payload.data.config);
              state.nodes = groupData(action.payload.data.config);
            } if(action.payload.type === 'notes') {
              state.notes = processNotes(action.payload.data.data);
            } else {
              const stat = {...state[action.payload.type], ...action.payload.data.data}
              state[action.payload.type] = stat;
              state.priorityData = setPriorityDataFunc(stat);
            }
          }
        } else {
          console.warn('Missing type in fetchApi fulfilled payload', action.payload);
        }
      })
      .addCase(fetchApi.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.type) {
          state[action.payload.type] = action.payload.data;
        } else {
          console.error('Missing type in fetchApi rejected payload', action.payload);
        }
      });
  }
});

export const { setFilters, resetFilters, setSearch, setPriorityFilter, setNotesData, setNestData } = nodeSlice.actions;
export default nodeSlice.reducer;
