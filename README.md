const priorityValues = { "critical": 1, "major": 2, "minor": 3, "normal": 4 };

function getNodePriority(stats, status) {
  let highestPriority = "normal";
  if (status && (status?.toLowerCase() == 'inservice' || status?.toLowerCase() == 'not_found' || status?.toLowerCase() == 'new' || status?.toLowerCase() == 'maintenance si')) {
    if (stats) {
      Object.values(stats).forEach(item => {
        if (item.priority && priorityValues[item.priority] < priorityValues[highestPriority]) {
          highestPriority = item.priority;
        }
      });
    } else {
      highestPriority = ''
    }
  } else {
    highestPriority = 'oor'    
  }

  return highestPriority;
}

function getNRFNodePriority(stats, status, ntwCheck) {
  let highestPriority = "normal";
  if (ntwCheck && ntwCheck == 'ON' && status && (status?.toLowerCase() == 'inservice' || status?.toLowerCase() == 'not_found' || status?.toLowerCase() == 'new')) {
    if (stats) {
      Object.values(stats).forEach(item => {
        // Apply special condition for NRF nodes
        if (item['NRD'] && item['NRD']?.display_type == 'kpi') {
          // Case 1: att is greater than or equal to attempt
          if (item['NRD']?.att >= item['NRD']?.attempt) {
            // Keep the existing priority determined by ProcessStats.js
          }
          // Case 2: attempt is null/undefined and att is 0 or more
          else if ((item['NRD']?.attempt === null || item['NRD']?.attempt === undefined) && item['NRD']?.att >= 0) {
            // Keep the existing priority determined by ProcessStats.js
          }
          // Special case: att == 0 and succ == 0 or null
          else if (item['NRD']?.att == 0 && (item['NRD']?.succ == 0 || item['NRD']?.succ == null || item['NRD']?.succ == undefined || item['NRD']?.succ == 'null')) {
            item['NRD'].priority = 'normal';
          }
        }
        
        if (item['NRD']?.priority && priorityValues[item['NRD']?.priority] < priorityValues[highestPriority]) {
          highestPriority = item['NRD']?.priority;
        }
      });
    } else {
      highestPriority = '';
    }
  } else {
    highestPriority = 'oor';
  }

  return highestPriority;
}

function processData(data) {
  const { nodes, notes, nest, nodeStatsProcessedCount } = data;
  const NFTYPE_ORDER = ['NRD','NRF','AMF','SMF','SMFC','PCF','CHF','UDM','AUSF','SCP','GMLC','LMF','NEF','EIR','BSF','SMSF'];

  const NOTES = notes?.reduce((acc, curr) => {
    if (!acc[curr.host_name]) {
      acc[curr.host_name] = [];
    }
    acc[curr.host_name].push(curr);
    return acc
  }, {});

  const NEST = nest?.reduce((acc, curr) => {
    acc[curr.nodeName] = curr;
    return acc
  }, {});

  const NODES = nodes?.reduce((acc, curr) => {
    const obj = {
      ...curr,
      notes: NOTES ? NOTES[curr.host_name] : '',
      nestStatus: NEST && NEST[curr.host_name] ? NEST[curr.host_name].nodeStatus : '',
    }
    let currentNodeStats = data.stats[curr.host_name];
    
    if (data.stats && data.stats[curr.host_name]) {
      if (curr.nodetype == 'nrf') {
        const KPIHeaders = Object.keys(Object.values(data.stats[curr.host_name])?.[0])
        obj.stats = data.stats[curr.host_name];
        obj.priority = getNRFNodePriority(currentNodeStats, NEST[curr.host_name]?.nodeStatus, curr.ntwCheck);
        obj.kpiHeaders = KPIHeaders?.sort((a, b) => NFTYPE_ORDER.indexOf(a) - NFTYPE_ORDER.indexOf(b));
      } else if(curr.nodetype === "smsf") {
        if(currentNodeStats && currentNodeStats?.ModelD?.att === 'false'){
          obj.stats = data.stats[curr.host_name];
          obj.priority = 'oor';
        }else {
          obj.stats = data.stats[curr.host_name];
          obj.priority = getNodePriority(currentNodeStats, NEST[curr.host_name]?.nodeStatus);
        }
      } else {
        if(currentNodeStats && ((currentNodeStats?.RC_Value?.att === 0 || currentNodeStats?.RC_Value?.att === '0') || (currentNodeStats?.RC?.att === 0 || currentNodeStats?.RC?.att === '0'))){
          obj.stats = data.stats[curr.host_name];
          obj.priority = 'oor';
        } else {
          obj.stats = data.stats[curr.host_name];
          obj.priority = getNodePriority(currentNodeStats, NEST[curr.host_name]?.nodeStatus);
        }
      }
    } else {
      if(data.stats[curr.host_name]  === undefined && nodeStatsProcessedCount[curr.host_name] >= 2){
        obj.stats = data.stats[curr.host_name];
      }
      obj.priority = ""
    }

    acc.push(obj)

    return acc;
  }, []);

  return NODES;
}

onmessage = function (e) {
  const result = processData(e.data);
  postMessage(result);
};
