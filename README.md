  const apiKpiData = Array.isArray(kpiData) ? kpiData : [];

    const mergedData = kpiList.map((kpiName) => {
        const apikpi = apiKpiData.find(kpi => kpi?.kpi === kpiName);
        // If the KPI from API is not found, create a dummy object
        return apikpi || {
            kpi: kpiName,
            succ: null,
            avg: null,
            att: null,
            last_7_att: null
        };
    });

    // Include any API data not in the hardcoded KPI list
    const remainingApiData = apiKpiData.filter(kpi => {
        return kpi?.kpi && !kpiList.includes(kpi.kpi);
    });
