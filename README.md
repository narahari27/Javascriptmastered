import React, { createContext, useState, useEffect } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import REGIONS_MAPPING from './constants/REGION_MAPPING.json';
import axiosClient from './api/client';

export const NodeContext = createContext(null);

const groupByRegions = (data) => {
  return data.reduce((acc, curr) => {
    const largerRegion = REGIONS_MAPPING[curr.pool];

    if (!acc[largerRegion]) {
      acc[largerRegion] = {};
    }

    if(curr.pool.includes('IOTP')){
      if (!acc[largerRegion]['IOTP']) {
        acc[largerRegion]['IOTP'] = [];
      }
  
      acc[largerRegion]['IOTP'].push(curr);
    }else{
      if (!acc[largerRegion][curr.pool]) {
        acc[largerRegion][curr.pool] = [];
      }
  
      acc[largerRegion][curr.pool].push(curr);
    }
    

    return acc;
  }, {});
}


const groupByPool = (data) => {
  return data.reduce((acc, curr) => {
    if(curr.pool.includes('IOTP')){
      if(!acc['IOTP']){
        acc['IOTP'] = [];
        acc['IOTP'].push(curr);
      }else{
        acc['IOTP'].push(curr);
      }
    }else{
      if (!acc[curr.pool]) {
        acc[curr.pool] = [];
        acc[curr.pool].push(curr);
      } else {
        acc[curr.pool].push(curr);
      }
    }
    return acc
  }, {})
}

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
}

export const NodeProvider = ({ children }) => {
  const { add, getAll } = useIndexedDB("alerts");
  const tech = ['mme','amf','smsf','vepdg'];
  const techGrp = ['nrf'];
  const  [statsV2, setStatsV2] = useState({
    mme: [],
    amf: [],
    smsf: [],
    vepdg: [],
    nrf: []
  });
  const  [avgV2, setAvgV2] = useState({
    mme: [],
    amf: [],
    smsf: [],
    vepdg: [],
    nrf: []
  });
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);
  const [stats15, setStats15] = useState([]);
  const [processedStats, setProcessedStats] = useState({});
  const [nodeData, setNodeData] = useState([]);
  const [notes, setNotes] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [nest, setNest] = useState([]);
  const [avg, setAvg] = useState([]);
  const [oor, toggleOOR] = useState(localStorage.getItem('oor') ? localStorage.getItem('oor') === 'true' ? true : false : true);
  const [allAlerts, setAllAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [fetchAlerts, setFetchAlerts] = useState(false);
  const [error, setError] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(['normal', 'oor', 'major', 'minor', 'critical']);
  const [notificationsFilter, setNotificationsFilter] = useState({priorities: ['critical'], timeRange: '1hr'});
  const [nodeStatsProcessedCount, setNodeStatsProcessedCount] = useState({});
  const [locationMapping ,setLocationMapping] = useState({});

  const fetchAllNodes = async () => {
    setDataLoading(true);
    try {
      let data = await axiosClient.get(`/api/getAllConfig`);
      setError(false);
      setDataLoading(false);
      const config = data?.data?.config || {};
      const nodes = Object.values(config);
      setNodeData(nodes);
    } catch(err) {
      setError(true);
      setDataLoading(false);
      setNodeData([]);
    }
  }

  const fetchNest = async () => {
    try {
      const { data } = await axiosClient.get(`/api/getNestInfo/?_=${new Date().getTime()}`);
      setError(false);
      setNest(data?.data);
    } catch(err) {
      setError(true);
      setNest([]);
    }
  }

  const fetchNotes = async () => {
    const { data } = await axiosClient.get(`/api/getNotes?_=${new Date().getTime()}`);
    setNotes(data?.data);
  }

  const fetchStats = async () => {
    const promiseArray = tech.map(t => axiosClient.get(`/api/getNodeStats/?nodeType=${t}`));

    Promise.all(promiseArray).then(res  => {
      const result = res.reduce((acc, curr, index) => {
        acc = [...acc, ...curr?.data?.data]
        return acc
      }, []);
      setError(false);
      if(result && result.length){
        setStats(result);
      }
    }).catch(err => {
      setError(true);
      setStats([]);
    });
  }

  const fetchStatsV2 = async () => {
    tech.forEach(t => {
      axiosClient.get(`/api/getNodeStats/?nodeType=${t}`).then(res => {
        const data = res?.data?.data || [];
        setError(false);
        setStatsV2((prev) => ({...prev, [t]: data}));
      }).catch(err => {
        setError(true);
        setStatsV2((prev) => ({...prev, [t]: []}));
      });
    })
  }

  const fetchStats15 = async () => {
    const promiseArray = techGrp.map(t => axiosClient.get(`/api/getNodeStats/${t}`));

    Promise.all(promiseArray).then(res  => {
      const result = res.reduce((acc, curr, index) => {
        acc = [...acc, ...curr?.data?.data]
        return acc
      }, []);
      setError(false);
      if(result && result.length){
        setStats15(result);
      }
    }).catch(err => {
      console.log('Error in fetching NRF Data')
      setStats15([]);
    });
  }

  const fetchStats15V2 = async () => {
    techGrp.forEach(t => {
      axiosClient.get(`/api/getNodeStats/${t}`).then(res => {
        const data = res?.data?.data || [];
        setError(false);
        setStatsV2((prev) => ({...prev, [t]: data}));
      }).catch(err => {
        setError(true);
        setStatsV2((prev) => ({...prev, [t]: []}));
      });
    })
  }

  const fetchAverage = async () => {
    const promiseArray = tech.map(t => axiosClient.get(`/api/getNodeTrends/?techType=${t}`));

    Promise.all(promiseArray).then(res  => {
      const result = res.reduce((acc, curr, index) => {
        acc = [...acc, ...curr?.data?.data]
        return acc
      }, []);
      setError(false);
      setAvg(result);
    }).catch(err => {
      setError(true);
      setAvg([]);
    });
  }

  const fetchAverageV2 = async () => {
    tech.forEach(t => {
      axiosClient.get(`/api/getNodeTrends/?techType=${t}`).then(res => {
        setError(false);
        const data = res?.data?.data || [];
        setAvgV2((prev) => ({...prev, [t]: data}));
      }).catch(err => {
        setError(true);
        setAvgV2((prev) => ({...prev, [t]: []}));
      });
    })
  }

  const postAlerts = async (data) => {
    console.log('data before:',data);
    let alertsData = await data.map((_) => ({
        'alert_time' : _.timestamp,
        'node' : _.host_name,
        'current_state' : _.priority,
        'previous_state' : _.prevPriority,
        'kpi_name' : _.kpi,
        'status' : _.isNew ? 'New' : 'Updated',
        'value' : _.value
    }));
  
    try {
      console.log('api data',alertsData);
      let response = await axiosClient.post(`/api/saveAlerts`, alertsData);
    } catch(err) {
      console.log("error in storing alerts", err);
    }
  }


  useEffect(() => {
    if ((stats && stats.length) || (stats15 && stats15.length)) {
      processStats();
    }
  }, [stats, avg, stats15]);

  useEffect(() => {
    if (data && data.length && data[0].stats && fetchAlerts) {
      console.log("Node data being processed:",data);
      processAlerts();
    }
  }, [data]);

  useEffect(() => {
    for (const [key, value] of Object.entries(statsV2)) {
      if (value && value.length) {
        setStats((prev) => ([...prev, ...value]));
      }
    }
  }, [statsV2]);

  useEffect(() => {
    for (const [key, value] of Object.entries(avgV2)) {
      if (value && value.length) {
        setAvg((prev) => ([...prev, ...value]));
      }
    }
  }, [avgV2]);

  useEffect(() => {
    fetchAllNodes();
    fetchNest();
    // fetchAverage();
    // fetchStats();
    // fetchStats15();
    fetchAverageV2();
    fetchStatsV2();
    fetchStats15V2();

    getAll().then(res => {
      if (res && res.length) {
        setAllAlerts(res);
      }
    })

    const interval = setInterval(() => {
      fetchNest();
      // fetchAverage();
      // fetchStats();
      fetchAverageV2();
      fetchStatsV2();
    }, 300000);

    setInterval(() => {
      fetchAllNodes();
      // fetchStats15();
      fetchStats15V2();
    }, 900000)

    // return () => clearInterval(interval);
  }, [])
  
  useEffect(() => {
    const nodeWorker = new Worker('/workers/processNodes.js');
    if (nodeData && nodeData.length > 0) {
      if (processedStats && Object.keys(processedStats).length) {
        // localStorage.setItem("processedStats", JSON.stringify(processedStats));
        nodeData?.reduce((acc, curr) => {
          if(nodeStatsProcessedCount[curr.host_name]){
            setNodeStatsProcessedCount(prevState => ({ ...prevState, [curr.host_name]: nodeStatsProcessedCount[curr.host_name] + 1 }));
          }else{
            setNodeStatsProcessedCount(prevState => ({ ...prevState, [curr.host_name]: 1 })); 
            
          }
        });

        nodeWorker.postMessage({
          nodes: nodeData,
          notes: notes,
          stats: processedStats,
          nest: nest,
          nodeStatsProcessedCount: nodeStatsProcessedCount
        });
      }

      nodeWorker.onmessage = function (e) {
        setData(e.data);
        nodeWorker.terminate();
      };
    }

    return () => nodeWorker.terminate();
  }, [nodeData, processedStats, notes, nest]);

  const processStats = () => {
    const statsWorker = new Worker('/workers/processStats.js');
    statsWorker.postMessage({
      stats: [
        ...stats,
        ...stats15
      ],
      avg
    });

    statsWorker.onmessage = function (e) {
      setFetchAlerts(true);
      setProcessedStats(e.data);
      statsWorker.terminate();
    };

    statsWorker.onerror = function (event) {
      setProcessedStats({});
      statsWorker.terminate();
    };
  }

  const processAlerts = () => {
    const alertsWorker = new Worker('/workers/processAlerts.js');
    let previousData = window.localStorage.getItem('alerts');
    previousData = previousData ? JSON.parse(previousData) : {};
    alertsWorker.postMessage({
      nodes: data,
      previousData: previousData
    });
    console.log("Data sent to processAlerts worker:",{nodes:data,previousData});

    alertsWorker.onmessage = function (e) {
      const { alerts, newData, previousData } = e.data;
      window.localStorage.setItem('alerts', JSON.stringify({ ...previousData, ...newData }));
      if (alerts) {
        setAllAlerts([...allAlerts, ...alerts]);
        setAlerts(alerts);
        if(alerts.length){
          postAlerts(alerts);
        }
        setFetchAlerts(false);
        alerts?.forEach(_ => add(_));
        alertsWorker.terminate();
      }
    };

    alertsWorker.onerror = function (event) {
      setFetchAlerts(false);
      setAlerts([]);
      alertsWorker.terminate();
    };
  }

  const [nodes, setNodes] = useState(groupByPool(data));
  const [basefilters, setBasefilters] = useState(getFilters(data));
  const [filteredNodes, setFilteredNodes] = useState(data);
  const [hasFilters, setHasFilters] = useState(false);
  const [filters, setFilters] = useState({
    nodetype: 'All',
    regions: 'All',
    pools: 'All',
  });

  useEffect(() => {
    if (data.length) {
      if (oor) {
        let temp = data.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found') && !(_.isCombiNode == 1 && _.stats?.RC_Value?.att !== 50 && _.stats?.RC?.att !== 50));
        temp = temp.filter(_ => {
          if (_.nodetype === 'nrf') {
            return _.ntwCheck === 'ON';
          } else {
            return true
          }
        });
        setNodes(groupByPool(temp));
        setBasefilters(getFilters(temp));
        setFilteredNodes(groupByRegions(temp));
      } else {
        // console.log(data[0])
        setNodes(groupByPool(data));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(data));
      }
    }
  }, [data]);

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
      filtered = filtered?.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found') && !(_.isCombiNode == 1 && _.stats?.RC_Value?.att !== 50 && _.stats?.RC?.att !== 50));
      filtered = filtered.filter(_ => {
        if (_.nodetype === 'nrf') {
          return _.ntwCheck === 'ON';
        } else {
          return true
        }
      });
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
  }, [filters, oor, priorityFilter]);

  const resetFilters = () => {
    setFilters({ nodetype: 'All', regions: 'All', pools: 'All' });
  }

  const setSearch = (search) => {
    if (search) {
      const notefiltered = data.filter(_ => _.host_name?.toLowerCase()?.includes(search?.toLowerCase()));
      const poolfiltered = data.filter(_ => _.pool?.toLowerCase()?.includes(search?.toLowerCase()));
      const seen = {};
      const filtered = [...notefiltered, ...poolfiltered].filter(item => !(item.host_name in seen) && (seen[item.host_name] = true));
      setHasFilters(true);
      setFilteredNodes(groupByRegions(filtered));
      setNodes(groupByPool(filtered));
    } else {
      processFilters(filters);
    }
  }

  const syncNotes = () => {
    fetchNotes();
  }

  const [degradedNodes, setDegradedNodes] = useState(false);

  useEffect(() => {
    if (degradedNodes) {
      setPriorityFilter(['critical', 'major', 'minor']);
    } else {
      setPriorityFilter(['critical', 'major', 'minor', 'oor', 'normal']);
    }
  }, [degradedNodes]);

  // Set filtered notifications data
  const [filteredNotifications, setFilteredNotifications] = useState({
    allAlerts: [],
    alerts: [],
  });

  // Process Notificaiton filters
  const processNotificationFilters = () => {
    let filteredAllAlerts;
    let filteredAlerts;
    const currentTime = new Date(); // Current time

    // Time range filter
    if(notificationsFilter.timeRange && notificationsFilter.timeRange == "1hr"){
      const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // Time one hour ago

      // Filter objects based on timestamp
      filteredAlerts = alerts.filter(obj => {
          const objTime = new Date(obj.timestamp); 
          return objTime >= oneHourAgo && objTime <= currentTime; 
      });

      // Filter objects based on timestamp
      filteredAllAlerts = allAlerts.filter(obj => {
        const objTime = new Date(obj.timestamp); 
        return objTime >= oneHourAgo && objTime <= currentTime;
      });
    }else if(notificationsFilter.timeRange && notificationsFilter.timeRange == "24hrs"){
      const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000); // Time 24 hours ago
  
      // Filter objects based on timestamp
      filteredAlerts = alerts.filter(obj => {
          const objTime = new Date(obj.timestamp); 
          return objTime >= oneDayAgo && objTime <= currentTime;
      });  

      // Filter objects based on timestamp
      filteredAllAlerts = allAlerts.filter(obj => {
        const objTime = new Date(obj.timestamp);
        return objTime >= oneDayAgo && objTime <= currentTime;
      });
    }else {
      filteredAlerts = alerts;
      filteredAllAlerts = allAlerts;
    }

    // Priorities filter
    if(notificationsFilter.priorities.length){
      filteredAllAlerts = filteredAllAlerts.filter((alert) => notificationsFilter.priorities.includes(alert.priority));
      filteredAlerts = filteredAlerts.filter((newAlert) => notificationsFilter.priorities.includes(newAlert.priority));
    }

    setFilteredNotifications({allAlerts: filteredAllAlerts, alerts: filteredAlerts});
  }

  // Trigger when notifications filter changes
  useEffect(() => {
    processNotificationFilters()
  }, [notificationsFilter, alerts, allAlerts])

  useEffect(() =>{
    const fetchLocationMapping = async () => {
      try{
        const response = await axiosClient.get('/api/getLocation');
        const data = response.data.data || {};
        const mapping = {};
        Object.entries(data).forEach(([techtype,nodes]) =>{
          nodes.forEach(item => {
            mapping[item.Node] = {
              city:item.City,
              omw:item.OMW,
              state:item.State,
            };
          });
        });
        setLocationMapping(mapping);
      }catch(error){
        console.error('Error fetching location mapping:',error);
      }
    };
    fetchLocationMapping();
  },[]);

  return <NodeContext.Provider value={{ nodes, setNodes, basefilters, filters, setFilters, filteredNodes, hasFilters, resetFilters, setSearch, dataLoading, syncNotes, oor, toggleOOR, alerts, allAlerts, notifications, setNotifications, error, setPriorityFilter, setDegradedNodes, priorityFilter, degradedNodes, setNotificationsFilter, notificationsFilter, setFilteredNotifications, filteredNotifications, tech: [...tech, ...techGrp] ,locationMapping }}>{children}</NodeContext.Provider>
}
