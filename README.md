import React, { createContext, useState, useEffect } from 'react';

// Updated mapping for data centers
const REGIONS_MAPPING = {
  'HYDERABAD': 'HYDERABAD',
  'BANGALORE': 'BANGALORE',
  'INDORE': 'INDORE',
  'MUMBAI': 'MUMBAI',
};

// Create context with default values
export const NodeContext = createContext({
  nodes: {},
  setNodes: () => {},
  basefilters: { nodetype: ['All'], regions: ['All'], pools: ['All'] },
  filters: { nodetype: 'All', regions: 'All', pools: 'All' },
  setFilters: () => {},
  filteredNodes: {},
  hasFilters: false,
  resetFilters: () => {},
  setSearch: () => {},
  dataLoading: false,
  syncNotes: () => {},
  oor: true,
  toggleOOR: () => {},
  alerts: [],
  allAlerts: [],
  notifications: false,
  setNotifications: () => {},
  error: false,
  setPriorityFilter: () => {},
  setDegradedNodes: () => {},
  priorityFilter: ['normal', 'oor', 'critical'],
  degradedNodes: false,
  setNotificationsFilter: () => {},
  notificationsFilter: {priorities: ['critical'], timeRange: '1hr'},
  setFilteredNotifications: () => {},
  filteredNotifications: { allAlerts: [], alerts: [] }
});

// Generate mock data with new platforms and data centers - only critical and normal priorities
const generateMockData = () => {
  const platforms = ['SONY', 'ZEE', 'STAR', 'KNITE'];
  const priorities = ['normal', 'oor', 'critical']; // Removed 'major'
  const dataCenters = ['HYDERABAD', 'BANGALORE', 'INDORE', 'MUMBAI'];
  
  let nodes = [];
  
  dataCenters.forEach(dataCenter => {
    platforms.forEach(platform => {
      // Generate 2-5 nodes per platform per data center
      const nodeCount = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < nodeCount; i++) {
        // Only use normal or critical (with higher chance of normal)
        const priority = Math.random() > 0.2 ? 
          'normal' : (Math.random() > 0.3 ? 'critical' : 'oor');
        
        nodes.push({
          host_name: `${platform}-${dataCenter.substring(0, 3)}-${i + 1}`,
          priority: priority,
          nodetype: platform.toLowerCase(),
          pool: dataCenter,
          timezone: dataCenter,
          nestStatus: 'inservice',
          notes: Math.random() > 0.7 ? [{
            notes: `Test note for ${platform}-${dataCenter.substring(0, 3)}-${i + 1}`,
            updated_by: 'Test, User',
            updated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }] : [],
          stats: Math.random() > 0.5 ? generateMockStats(platform) : null
        });
      }
    });
  });
  
  return nodes;
};

// Generate mock stats
const generateMockStats = (platform) => {
  const kpis = ['STREAM_ATTEMPT', 'LOGIN_SUCCESS', 'ACTIVE_USERS', 'CONTENT_VIEW'];
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
      priority: Math.random() > 0.7 ? 'critical' : 'normal',
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
  const [oor, toggleOOR] = useState(localStorage.getItem('oor') === 'true' ? true : false);
  const [allAlerts, setAllAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [error, setError] = useState(false);
  // Changed default priority filter to only include normal, oor, critical
  const [priorityFilter, setPriorityFilter] = useState(['normal', 'oor', 'critical']);
  const [notificationsFilter, setNotificationsFilter] = useState({priorities: ['critical'], timeRange: '1hr'});

  // Initialize with empty objects to prevent null issues
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

  // Load mock data on initial render
  useEffect(() => {
    loadMockData();
  }, []);

  // Function to load mock data
  const loadMockData = () => {
    setDataLoading(true);
    
    // Generate mock data immediately
    const mockData = generateMockData();
    
    // Set initial data for pool grouping
    const poolData = groupByPool(mockData);
    setNodes(poolData);
    
    // Set the rest of the data with a short delay
    setTimeout(() => {
      setData(mockData);
      setBasefilters(getFilters(mockData));
      setFilteredNodes(groupByRegions(mockData));
      setDataLoading(false);
      
      // Generate some mock alerts
      const mockAlerts = mockData
        .filter(node => node.priority === 'critical')
        .slice(0, 5)
        .map(node => ({
          host_name: node.host_name,
          priority: node.priority,
          prevPriority: 'normal',
          isNew: Math.random() > 0.5,
          timestamp: new Date().toISOString(),
          kpi: 'STREAM_ATTEMPT'
        }));
      
      setAlerts(mockAlerts);
      setAllAlerts(mockAlerts);
    }, 500);
  };

  // Update nodes when data or OOR filter changes
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

  // Process filters based on user selections
  const processFilters = (filters) => {
    if (Object.keys(filters).length && data.length) {
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

  // Apply filters when they change
  useEffect(() => {
    if (data.length) {
      processFilters(filters);
    }
  }, [filters, oor, priorityFilter, data]);

  // Reset filters function
  const resetFilters = () => {
    setFilters({ nodetype: 'All', regions: 'All', pools: 'All' });
  }

  // Search functionality
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

  // Mock function for syncing notes
  const syncNotes = () => {
    console.log("Sync notes called");
    // Reload mock data to simulate sync
    loadMockData();
  }

  const [degradedNodes, setDegradedNodes] = useState(false);

  // Update priority filter based on degraded nodes toggle
  useEffect(() => {
    if (degradedNodes) {
      setPriorityFilter(['critical']);
    } else {
      setPriorityFilter(['normal', 'oor', 'critical']);
    }
  }, [degradedNodes]);

  // Process notifications filters
  const [filteredNotifications, setFilteredNotifications] = useState({
    allAlerts: [],
    alerts: [],
  });

  useEffect(() => {
    setFilteredNotifications({allAlerts: allAlerts, alerts: alerts});
  }, [notificationsFilter, alerts, allAlerts]);

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
        filteredNotifications
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
