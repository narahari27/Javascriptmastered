import React, { createContext, useState, useEffect } from 'react';

// Sample region mapping to match your original
const REGIONS_MAPPING = {
  'WEST': 'WEST',
  'EAST': 'EAST',
  'CENTRAL': 'CENTRAL',
  'SOUTH': 'SOUTH',
  // Add more as needed
};

export const NodeContext = createContext(null);

// Mock data generator
const generateMockData = () => {
  const techTypes = ['tas', 'cscf', 'bgcf', 'catf', 'vss', 'sbi', 'csbg'];
  const priorities = ['normal', 'oor', 'major', 'critical'];
  const pools = ['WEST', 'EAST', 'CENTRAL', 'SOUTH'];
  
  let nodes = [];
  
  pools.forEach(pool => {
    // Generate 5-15 nodes per pool
    const nodeCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < nodeCount; i++) {
      const techType = techTypes[Math.floor(Math.random() * techTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      nodes.push({
        host_name: `${techType.toUpperCase()}-${pool}-${i + 1}`,
        priority: priority,
        nodetype: techType,
        pool: pool,
        timezone: pool,
        nestStatus: 'inservice',
        notes: Math.random() > 0.7 ? [{
          notes: `Test note for ${techType.toUpperCase()}-${pool}-${i + 1}`,
          updated_by: 'Test, User',
          updated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }] : [],
        stats: Math.random() > 0.5 ? generateMockStats(techType) : null
      });
    }
  });
  
  return nodes;
};

// Generate mock stats for a node
const generateMockStats = (techType) => {
  const kpis = ['CALL_ATTEMPT', 'REGISTER_SUCCESS', 'TAS_ACTIVE_REGISTRATIONS', 'INVITE_SUCCESS'];
  const panels = [1, 2];
  
  let stats = {};
  
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    const kpi = kpis[Math.floor(Math.random() * kpis.length)];
    const panel = panels[Math.floor(Math.random() * panels.length)];
    const id = `stats-${kpi}-${i}`;
    
    stats[id] = {
      kpi: kpi,
      rate: Math.floor(Math.random() * 100),
      avg: Math.floor(Math.random() * 100),
      att: Math.floor(Math.random() * 1000),
      panel: panel,
      priority: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'major' : 'normal',
      time_value: new Date().toISOString()
    };
  }
  
  return stats;
};

const groupByPool = (data) => {
  return data.reduce((acc, curr) => {
    if (!acc[curr.pool]) {
      acc[curr.pool] = [];
      acc[curr.pool].push(curr);
    } else {
      acc[curr.pool].push(curr);
    }

    return acc
  }, {})
};

const getFilters = (data) => {
  return data.reduce((acc, curr) => {
    if (acc.pools.indexOf(curr.pool) === -1) {
      acc.pools.push(curr.pool)
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
  })
};

const groupByRegions = (data) => {
  return data.reduce((acc, curr) => {
    const largerRegion = REGIONS_MAPPING[curr.pool];

    if (!acc[largerRegion]) {
      acc[largerRegion] = {};
    }

    if (!acc[largerRegion][curr.pool]) {
      acc[largerRegion][curr.pool] = [];
    }

    acc[largerRegion][curr.pool].push(curr);

    return acc;
  }, {});
};

export const NodeProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [oor, toggleOOR] = useState(localStorage.getItem('oor') ? localStorage.getItem('oor') === 'true' ? true : false : true);
  const [allAlerts, setAllAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [error, setError] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(['normal', 'oor', 'major', 'critical']);
  const [notificationsFilter, setNotificationsFilter] = useState({priorities: ['critical'], timeRange: '1hr'});

  // Load mock data on initial render
  useEffect(() => {
    setDataLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setDataLoading(false);
      
      // Generate some mock alerts
      const mockAlerts = mockData
        .filter(node => node.priority === 'critical' || node.priority === 'major')
        .slice(0, 5)
        .map(node => ({
          host_name: node.host_name,
          priority: node.priority,
          prevPriority: 'normal',
          isNew: Math.random() > 0.5,
          timestamp: new Date().toISOString(),
          kpi: 'CALL_ATTEMPT'
        }));
      
      setAlerts(mockAlerts);
      setAllAlerts(mockAlerts);
    }, 1000);
  }, []);

  const [nodes, setNodes] = useState({});
  const [basefilters, setBasefilters] = useState({
    nodetype: ['All'],
    regions: ['All'],
    pools: ['All'],
  });
  const [filteredNodes, setFilteredNodes] = useState({});
  const [hasFilters, setHasFilters] = useState(false);
  const [filters, setFilters] = useState({
    nodetype: 'All',
    regions: 'All',
    pools: 'All',
  });

  // Update nodes, filters and filtered nodes when data changes
  useEffect(() => {
    if (data.length) {
      if (oor) {
        const temp = data.filter(_ => _.nestStatus?.toLowerCase() === 'inservice');
        setNodes(groupByPool(temp));
        setBasefilters(getFilters(temp));
        setFilteredNodes(groupByRegions(temp));
      } else {
        setNodes(groupByPool(data));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(data));
      }
    }
  }, [data, oor]);

  const processFilters = (filters) => {
    if (Object.keys(filters).length) {
      let filtered = data.filter((node) => {
        if (filters.nodetype && filters.nodetype !== 'All' && filters.nodetype !== node.nodetype) {
          return false
        } else if (filters.regions && filters.regions !== 'All' && filters.regions !== node.pool) {
          return false
        } else if (filters.pools && filters.pools !== 'All' && filters.pools !== node.pool) {
          return false
        }

        return true;
      });

      if (filters.nodetype !== 'All' || filters.regions !== 'All' || filters.pools !== 'All' || filtered.length !== data.length) {
        setHasFilters(true);
      } else {
        setHasFilters(false);
      }

      if (oor) {
        filtered = filtered?.filter(_ => _.nestStatus?.toLowerCase() === 'inservice');
      }

      if (priorityFilter.length > 0) {
        filtered = filtered?.filter(_ => priorityFilter.includes(_.priority));
      }

      setFilteredNodes(groupByRegions(filtered));
      setNodes(groupByPool(filtered));
    } else {
      setFilteredNodes(groupByRegions(data));
      setHasFilters(false);
      setNodes(groupByPool(data));
    }
  }

  useEffect(() => {
    if (data.length) {
      processFilters(filters);
    }
  }, [filters, oor, priorityFilter, data]);

  const resetFilters = () => {
    setFilters({ nodetype: 'All', regions: 'All', pools: 'All' });
  }

  const setSearch = (search) => {
    if (search) {
      const nodeFiltered = data.filter(_ => _.host_name?.toLowerCase()?.includes(search?.toLowerCase()));
      const poolFiltered = data.filter(_ => _.pool?.toLowerCase()?.includes(search?.toLowerCase()));
      const seen = {};
      const filtered = [...nodeFiltered, ...poolFiltered].filter(item => !(item.host_name in seen) && (seen[item.host_name] = true));
      setHasFilters(true);
      setFilteredNodes(groupByRegions(filtered));
      setNodes(groupByPool(filtered));
    } else {
      processFilters(filters);
    }
  }

  const syncNotes = () => {
    // In real app this would fetch notes, here we'll just refresh mock data
    setDataLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setDataLoading(false);
    }, 300);
  }

  const [degradedNodes, setDegradedNodes] = useState(false);

  useEffect(() => {
    if (degradedNodes) {
      setPriorityFilter(['critical', 'major']);
    } else {
      setPriorityFilter(['critical', 'major', 'oor', 'normal']);
    }
  }, [degradedNodes]);

  // Process Notification filters (simplified)
  const [filteredNotifications, setFilteredNotifications] = useState({
    allAlerts: [],
    alerts: [],
  });

  useEffect(() => {
    setFilteredNotifications({allAlerts: allAlerts, alerts: alerts});
  }, [notificationsFilter, alerts, allAlerts]);

  // Function to refresh data (simulating API calls)
  const refreshData = () => {
    setDataLoading(true);
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setDataLoading(false);
    }, 500);
  };

  return (
    <NodeContext.Provider 
      value={{ 
        nodes, 
        setNodes, 
        basefilters, 
        filters, 
        setFilters, 
        filteredNodes, 
        hasFilters, 
        resetFilters, 
        setSearch, 
        dataLoading, 
        syncNotes, 
        oor, 
        toggleOOR, 
        alerts, 
        allAlerts, 
        notifications, 
        setNotifications, 
        error, 
        setPriorityFilter, 
        setDegradedNodes, 
        priorityFilter, 
        degradedNodes, 
        setNotificationsFilter, 
        notificationsFilter, 
        setFilteredNotifications, 
        filteredNotifications,
        refreshData
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
