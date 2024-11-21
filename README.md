Object.entries(STATS).forEach(([hostName, kpis]) => {
        const nodeType = stats.find(stat => stat.host_name === hostName)?.nodetype;

        if (nodeType && ALL_METRICS[nodeType]?.kpi) {
            ALL_METRICS[nodeType].kpi.forEach(kpi => {
                if (!kpis[kpi]) {
                    kpis[kpi] = {
                        kpi, // Metric name
                        host_name: hostName,
                        nodetype: nodeType,
                        att: null,
                        succ: null,
                        avg: null,
                        last_7_att: null,
                        priority: "normal", // Default priority
                        name: KPI_NAME[kpi] || kpi // Friendly name
                    };
                }
            });
        }
    });

    // Flatten the data back to a list
    const flattenedStats = [];
    Object.entries(STATS).forEach(([hostName, kpis]) => {
        Object.values(kpis).forEach(kpiData => {
            flattenedStats.push(kpiData);
        });
    });

    return flattenedStats;
}
