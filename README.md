import React, { createContext, useState, useEffect } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import REGIONS_MAPPING from './constants/REGION_MAPPING.json';
import axiosClient from './api/client';
import {store} from './store';
import {setNotesData} from './reducers/nodeSlice';

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
  const [nestInfo, setNestInfo] = useState({});
  const [avg, setAvg] = useState([]);
  const [oor, toggleOOR] = useState(localStorage.getItem('oor') ? localStorage.getItem('oor') === 'true' ? true : false : false);
  const [allAlerts, setAllAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [fetchAlerts, setFetchAlerts] = useState(false);
  const [error, setError] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(['normal', 'major', 'minor', 'critical', 'oor']);
  const [notificationsFilter, setNotificationsFilter] = useState({priorities: ['critical'], timeRange: '1hr'});
  const [nodeStatsProcessedCount, setNodeStatsProcessedCount] = useState({});
  const [locationMapping ,setLocationMapping] = useState({});
  const [upfView, toggleUPFView] = useState(localStorage.getItem('upf_view') ? localStorage.getItem('upf_view') === 'true' ? true : false : false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllNodes = async () => {
    // setDataLoading(true);
    try {
      let data = await axiosClient.get(`/api/getAllConfig`);
      setError(false);
      // setDataLoading(false);
      const config = data?.data?.config || {};
      const nodes = Object.values(config);
      setNodeData(nodes);
    } catch(err) {
      setError(true);
      // setDataLoading(false);
      setNodeData([]);
    }
  }

  const fetchNest = async () => {
    try {
      const { data } = await axiosClient.get(`/api/getNestInfo/?_=${new Date().getTime()}`);
      setError(false);
      setNest(data?.data);
      const nestData = data?.data?.reduce((acc, curr) => {
        acc[curr.nodeName] = curr.nodeStatus;
        return acc
      }, {});
      setNestInfo(nestData)
    } catch(err) {
      setError(true);
      setNest([]);
      setNestInfo({});
    }
  }

  const fetchNotes = async () => {
    const { data } = await axiosClient.get(`/api/getNotes?_=${new Date().getTime()}`);
    setNotes(data?.data);
    store.dispatch(setNotesData(data?.data))
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

  // const fetchStatsV2 = async () => {
  //   tech.forEach(async(t) => {
  //     setLoadingState((prev)=>({...prev,[t]:true}));
  //     try{
  //       const res = await  axiosClient.get(`/api/getNodeStats/?nodeType=${t}`);
  //       const data = res?.data?.data || [];
  //       setError(false);
  //       setStatsV2((prev) => ({...prev, [t]: data}));
  //     }catch(err) {
  //       setError(true);
  //       setStatsV2((prev) => ({...prev, [t]: []}));
  //     }finally{
  //       setLoadingState((prev)=>({...prev,[t]:false}));
  //     }
  //   });
  // };
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
    
    let alertsData = await data.map((_) => ({
        'alert_time' : _.timestamp,
        'node' : _.host_name,
        'current_state' : _.priority,
        'previous_state' : _.prevPriority,
        'kpi_name' : _.kpi,
        'pool' : _.pool || 'null',
        'status' : _.isNew ? 'New' : 'Updated',
        'value' : _.value,
        'green':_.green || 'null',
        'yellow': _.yellow || 'null',
        'orange':_.orange || 'null',
        'red':_.red || 'null'
    }));
  
    try {
      const batches = [];
      const batchSize = 50;
      const parallelLimit = 5;

      for (let i = 0; i < alertsData.length; i += batchSize) {
        const batch = alertsData.slice(i, i + batchSize);
        batches.push(batch);
      }

      for (let i = 0; i < batches.length; i += parallelLimit) {
        const group = batches.slice(i, i + parallelLimit);
        const promises = group.map((batch) => {
          return axiosClient.post(`/api/saveAlerts`, batch);
        })
        
        await Promise.all(promises);

        if (i + parallelLimit < batches.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
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
    if (data && data.length && fetchAlerts) {
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
    if(!upfView){
      fetchAllNodes();
      fetchNest();
      fetchAverageV2();
      fetchStatsV2();
      fetchStats15V2();
      getAll().then(res => {
        if (res && res.length) {
          setAllAlerts(res);
        }
      })
    }

    const interval = setInterval(() => {
      if(!upfView){
        resetFilters();
        fetchNest();
        fetchAverageV2();
        fetchStatsV2();
      }
    }, 300000);

    setInterval(() => {
      if(!upfView){
        resetFilters();
        fetchAllNodes();
      }
    }, 900000)

    // return () => clearInterval(interval);
  }, [upfView])
  
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
        let n = processVEPDGNodes([...e.data]);
        setData(n);
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

    alertsWorker.onmessage = function (e) {
      const { alerts, newData, previousData } = e.data;
      window.localStorage.setItem('alerts', JSON.stringify({ ...previousData, ...newData }));
      if (alerts) {
        setAllAlerts([...allAlerts, ...alerts]);
        setAlerts(alerts);
        if(alerts.length && process.env.NODE_ENV !== 'development'){
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
  const processVEPDGNodes = (nodes)=>{
    return nodes.map((node)=>{
      if(node.nodetype === 'vepdg'){
        const kpiStats = node.stats?.OOR;
        if(kpiStats){
          if(kpiStats.att === 'InService'){
            node.priority = 'normal';
          }else if (kpiStats.att === 'OOR'){
            node.priority = 'oor';
          }else if (kpiStats.att === 'Error'){
            node.priority = 'major';
          }else {
            node.priority = 'normal';
          }
        }else{
          node.priority = 'normal';
        }
      }
      return node;
    });
  };
  useEffect(() => {
    if (data.length) {
      // let temp = processVEPDGNodes([...data]);
      if (!oor) {
        let temp = data.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found' || _.nestStatus?.toLowerCase() == 'new' || _.nestStatus?.toLowerCase() == 'maintenance si'));
        temp = temp.filter((_) => (_?.priority !== 'oor'));

        //   if (_.nodetype === "mme"){
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === "amf") {
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === 'nrf') {
        //     return _.ntwCheck === 'ON';
        //   } else if (_.nodetype === "vepdg") {
        //     return _.stats?.OOR?.att !== "OOR"
        //   } else if (_.nodetype === "smsf") {
        //     return _.stats?.ModelD?.att === 'true'
        //   } else {
        //     return _
        //   }
        // });
        setNodes(groupByPool(temp));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(temp));
      } else {
        setNodes(groupByPool(data));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(data));
      }
    }
  }, [data, oor, priorityFilter]);

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

      if (!oor) {
        filtered = filtered?.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found' || _.nestStatus?.toLowerCase() == 'new' || _.nestStatus?.toLowerCase() == 'maintenance si'));
        filtered = filtered.filter((_) => (_?.priority !== 'oor'));
        //   if (_.nodetype === "mme"){
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === "amf") {
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === 'nrf') {
        //     return _.ntwCheck === 'ON';
        //   } else if (_.nodetype === "vepdg") {
        //     return _.stats?.OOR?.att !== "OOR"
        //   } else if (_.nodetype === "smsf") {
        //     return _.stats?.ModelD?.att === 'true'
        //   } else {
        //     return _
        //   }
        // });
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
    if (!dataLoading && data.length && filters) {
      processFilters(filters);
    }
  }, [data,filters, oor, priorityFilter]);

  const resetFilters = () => {
    setSearchTerm("");
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
      setPriorityFilter(['critical', 'major', 'minor', 'normal', 'oor']);
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
    if(!upfView){
      fetchLocationMapping();
    }
  },[upfView]);

  useEffect(() => {
    const fetchAllData = async () => {
        setDataLoading(true);

        try {
            await Promise.all([
                fetchAllNodes(),
                fetchNest(),
                fetchStatsV2(),
                fetchNotes(),
                fetchStats15V2(),
                fetchAverageV2()
            ]);
            setDataLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(true);
            setDataLoading(false);
        }
    };
    if(!upfView){
      fetchAllData();
    }
    const interval = setInterval(()=>{
      setDataLoading(true);
      fetchAllData();
    },5*60*1000);
    return()=> clearInterval(interval);
}, [upfView]);
//Adding Below Code to filter dropdowns as per pools
const getPoolsByTechType = (nodes, techType) => {
  if (techType === 'All') {
    return [];
  }
  const poolsWithTechType = [];
  nodes.forEach(node => {
    if (node.nodetype === techType && !poolsWithTechType.includes(node.pool)) {
      poolsWithTechType.push(node.pool);
    }
  });
  return poolsWithTechType;
};
const [techTypePools,setTechTypePools]= useState([]);
useEffect(()=>{
  if(filters.nodetype !== 'All'){
    const poolsWithSelectedTech = getPoolsByTechType(data,filters.nodetype);
    setTechTypePools(poolsWithSelectedTech);
  }else{
    setTechTypePools([]);
  }
},[filters.nodetype,data]);

  return <NodeContext.Provider value={{ nodes, setNodes, basefilters, filters, setFilters, filteredNodes, hasFilters, resetFilters, setSearch, dataLoading, syncNotes, oor, toggleOOR, alerts, allAlerts, notifications, setNotifications, error, setPriorityFilter, setDegradedNodes, priorityFilter, degradedNodes, setNotificationsFilter, notificationsFilter, setFilteredNotifications, filteredNotifications, tech: [...tech, ...techGrp] ,locationMapping, upfView, toggleUPFView, nestInfo,setSearchTerm, searchTerm ,techTypePools }}>{children}</NodeContext.Provider>
}
