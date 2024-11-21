const processStats = () => {
  const processedData = stats.reduce((acc, stat) => {
    const techType = stat.nodetype; // Determine the tech type (e.g., AMF, MME)
    const hostName = stat.host_name; // Node's unique identifier

    // Initialize host data structure if not present
    if (!acc[hostName]) {
      acc[hostName] = {
        kpi: {},
        kci: {},
        kei: {},
      };
    }

    // Ensure all metrics (KPI, KCI, KEI) for the tech type are included
    ["kpi", "kci", "kei"].forEach((metricType) => {
      ALL_METRICS[techType]?.[metricType]?.forEach((metric) => {
        if (!acc[hostName][metricType][metric]) {
          // Add missing metrics with default null values
          acc[hostName][metricType][metric] = {
            metric, // Metric name
            att: null,
            succ: null,
            avg: null,
            last_7_att: null,
            priority: "normal", // Default priority
          };
        }
      });
    });

    // Update the actual metric data from the response
    const metricType = stat.display_type || "kpi"; // Determine metric type from `display_type`
    if (metricType in acc[hostName]) {
      acc[hostName][metricType][stat.kpi] = {
        ...stat,
        name: KPI_NAME[stat.kpi] || stat.kpi, // Friendly name
        priority: determinePriority(stat), // Use the helper function
      };
    }

    return acc; // Return the accumulated data
  }, {});

  setProcessedStats(processedData); // Update the state with the processed stats
};
