function compareObjects(obj1, obj2) {
    let result = [];
    Object.keys(obj2).forEach(key => {
    
      if (!obj1.hasOwnProperty(key)) {
        result.push({
            host_name: key,
            priority: obj2[key],
            isNew: true,
            timestamp: new Date().toISOString()
        });
      } else if (obj1[key] !== obj2[key]) {
        result.push({
            host_name: key,
            prevPriority: obj1[key],
            priority: obj2[key],
            isNew: false,
            timestamp: new Date().toISOString()
        });
      }
    });
  
    return result;
  }

const processAlerts = (data) => {
    const { nodes, previousData } = data;

    const newData = nodes?.reduce((acc, curr) => {
        acc[curr.host_name] = curr?.priority;

        return acc;
    }, {});

    if (Object.keys(newData).length > 0) {
        let nullOrUndefinedCount = 0;

        Object.values(newData).forEach(value => {
            if (value === null || value === undefined) {
            nullOrUndefinedCount += 1;
            }
        });

        if (nullOrUndefinedCount > Object.keys(newData).length / 2) {
            return {};
        }
    }

    let alerts = [];

    if (Object.keys(previousData).length > 0 && Object.keys(newData).length > 0) {
        alerts = compareObjects(previousData, newData);
    }

    alerts.forEach((alert) => {
        if(['critical', 'major'].includes(alert.priority)){
            let node = nodes.find((node) => node.host_name == alert.host_name);
            let kpi = Object.values(node.stats).find((kpi) => kpi?.priority == alert?.priority);
            alert['kpi'] = kpi?.kpi
        }
    });
    
    return {alerts, newData, previousData};
}

onmessage = function (e) {
    const result = processAlerts(e.data);
    postMessage(result);
};
