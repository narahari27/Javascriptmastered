console.log(`Index: ${index}, kpi:`, kpi); // Log each kpi object
        console.log(`kpi.succ (raw):`, kpi.succ); // Log the raw kpi.succ value
        console.log(`kpi.succ isNaN:`, isNaN(parseFloat(kpi.succ?.trim())));
