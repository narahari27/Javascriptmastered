import React, { createContext, useState, useEffect } from 'react';

// Create context with complete default values
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
  priorityFilter: ['normal', 'oor', 'major', 'critical'],
  degradedNodes: false,
  setNotificationsFilter: () => {},
  notificationsFilter: {priorities: ['critical'], timeRange: '1hr'},
  setFilteredNotifications: () => {},
  filteredNotifications: { allAlerts: [], alerts: [] }
});

// Create mock data
const mockNodes = {
  'WEST': [
    {
      host_name: 'TAS-WEST-1',
      priority: 'normal',
      nodetype: 'tas',
      pool: 'WEST',
      nestStatus: 'inservice'
    },
    {
      host_name: 'CSCF-WEST-1',
      priority: 'critical',
      nodetype: 'cscf',
      pool: 'WEST',
      nestStatus: 'inservice'
    }
  ],
  'EAST': [
    {
      host_name: 'TAS-EAST-1',
      priority: 'major',
      nodetype: 'tas',
      pool: 'EAST',
      nestStatus: 'inservice'
    },
    {
      host_name: 'CSCF-EAST-1',
      priority: 'normal',
      nodetype: 'cscf',
      pool: 'EAST',
      nestStatus: 'inservice'
    }
  ],
  'CENTRAL': [
    {
      host_name: 'TAS-CENTRAL-1',
      priority: 'oor',
      nodetype: 'tas',
      pool: 'CENTRAL',
      nestStatus: 'inservice'
    }
  ],
  'SOUTH': [
    {
      host_name: 'BGCF-SOUTH-1',
      priority: 'normal',
      nodetype: 'bgcf',
      pool: 'SOUTH',
      nestStatus: 'inservice'
    }
  ]
};

const mockFilteredNodes = {
  'WEST': {
    'WEST': [
      {
        host_name: 'TAS-WEST-1',
        priority: 'normal',
        nodetype: 'tas',
        pool: 'WEST',
        nestStatus: 'inservice'
      },
      {
        host_name: 'CSCF-WEST-1',
        priority: 'critical',
        nodetype: 'cscf',
        pool: 'WEST',
        nestStatus: 'inservice'
      }
    ]
  },
  'EAST': {
    'EAST': [
      {
        host_name: 'TAS-EAST-1',
        priority: 'major',
        nodetype: 'tas',
        pool: 'EAST',
        nestStatus: 'inservice'
      },
      {
        host_name: 'CSCF-EAST-1',
        priority: 'normal',
        nodetype: 'cscf',
        pool: 'EAST',
        nestStatus: 'inservice'
      }
    ]
  },
  'CENTRAL': {
    'CENTRAL': [
      {
        host_name: 'TAS-CENTRAL-1',
        priority: 'oor',
        nodetype: 'tas',
        pool: 'CENTRAL',
        nestStatus: 'inservice'
      }
    ]
  },
  'SOUTH': {
    'SOUTH': [
      {
        host_name: 'BGCF-SOUTH-1',
        priority: 'normal',
        nodetype: 'bgcf',
        pool: 'SOUTH',
        nestStatus: 'inservice'
      }
    ]
  }
};

const mockBaseFilters = {
  nodetype: ['All', 'tas', 'cscf', 'bgcf'],
  regions: ['All', 'WEST', 'EAST', 'CENTRAL', 'SOUTH'],
  pools: ['All', 'WEST', 'EAST', 'CENTRAL', 'SOUTH']
};

export const NodeProvider = ({ children }) => {
  // Initialize with static mock data instead of generating dynamically
  const [nodes, setNodes] = useState(mockNodes);
  const [filteredNodes, setFilteredNodes] = useState(mockFilteredNodes);
  const [basefilters, setBasefilters] = useState(mockBaseFilters);
  const [filters, setFilters] = useState({
    nodetype: 'All',
    regions: 'All',
    pools: 'All',
  });
  const [hasFilters, setHasFilters] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [oor, toggleOOR] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [allAlerts, setAllAlerts] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [error, setError] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(['normal', 'oor', 'major', 'critical']);
  const [degradedNodes, setDegradedNodes] = useState(false);
  const [notificationsFilter, setNotificationsFilter] = useState({priorities: ['critical'], timeRange: '1hr'});
  const [filteredNotifications, setFilteredNotifications] = useState({
    allAlerts: [],
    alerts: [],
  });

  // Simple static mock implementations of functions
  const resetFilters = () => {
    setFilters({ nodetype: 'All', regions: 'All', pools: 'All' });
    setHasFilters(false);
  };

  const setSearch = (search) => {
    if (search) {
      setHasFilters(true);
      
      // Very simple search that just checks if any node contains the search term
      let filteredRegions = {...mockFilteredNodes};
      
      for (const region in filteredRegions) {
        for (const pool in filteredRegions[region]) {
          filteredRegions[region][pool] = filteredRegions[region][pool].filter(
            node => node.host_name.toLowerCase().includes(search.toLowerCase())
          );
          
          // If pool is now empty, remove it
          if (filteredRegions[region][pool].length === 0) {
            delete filteredRegions[region][pool];
          }
        }
        
        // If region is now empty, remove it
        if (Object.keys(filteredRegions[region]).length === 0) {
          delete filteredRegions[region];
        }
      }
      
      setFilteredNodes(filteredRegions);
    } else {
      setHasFilters(false);
      setFilteredNodes(mockFilteredNodes);
    }
  };

  const syncNotes = () => {
    // Do nothing in mock version
    console.log("syncNotes called");
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
        filteredNotifications
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
