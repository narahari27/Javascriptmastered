for (const hostName in STATS) {
        const nodeType = stats.find((stat) => stat.host_name === hostName)?.nodetype; // Get the nodetype for the host
        const metrics = ALL_METRICS[nodeType]; // Get metrics for the nodetype

        if (metrics) {
            ["kpi", "kci", "kei"].forEach((metricType) => {
                metrics[metricType]?.forEach((metric) => {
                    if (!STATS[hostName][metric]) {
                        STATS[hostName][metric] = {
                            kpi: metric,
                            att: null,
                            succ: null,
                            avg: null,
                            last_7_att: null,
                            priority: "normal", // Default priority
                            name: KPI_NAME[metric] || metric, // Friendly name
                        };
                    }
                });
            });
        }
    }
