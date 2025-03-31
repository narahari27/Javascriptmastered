// Apply all filters including header filters
    useEffect(() => {
        // Get alerts after priority and time filters are applied
        let newAlertsFiltered = notificationsFilter.priorities.length 
            ? filteredNotifications.alerts 
            : alerts;
            
        let allAlertsFiltered = notificationsFilter.priorities.length 
            ? filteredNotifications.allAlerts 
            : allAlerts;
            
        // Apply header filters
        if (headerFilters.currentState !== 'All') {
            newAlertsFiltered = newAlertsFiltered.filter(alert => 
                alert.priority === headerFilters.currentState
            );
            
            allAlertsFiltered = allAlertsFiltered.filter(alert => 
                alert.priority === headerFilters.currentState
            );
        }
        
        // Sort by timestamp (newest first)
        newAlertsFiltered = [...newAlertsFiltered].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        allAlertsFiltered = [...allAlertsFiltered].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setDisplayedAlerts({
            newAlerts: newAlertsFiltered,
            allAlerts: allAlertsFiltered
        });
    }, [
        filteredNotifications, 
        headerFilters,
        allAlerts, 
        alerts, 
        notificationsFilter
    ]);

    const handleHeaderFilterChange = (event, filterName) => {
        setHeaderFilters({
            ...headerFilters,
            [filterName]: event.target.value
        });
    };

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
  } else if(notificationsFilter.timeRange && notificationsFilter.timeRange == "24hrs"){
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
  } else {
    filteredAlerts = alerts;
    filteredAllAlerts = allAlerts;
  }

  // Priorities filter
  if(notificationsFilter.priorities.length){
    filteredAllAlerts = filteredAllAlerts.filter((alert) => notificationsFilter.priorities.includes(alert.priority));
    filteredAlerts = filteredAlerts.filter((newAlert) => notificationsFilter.priorities.includes(newAlert.priority));
  }

  // Apply header filters
  if (headerFilters.currentState !== 'All') {
    filteredAllAlerts = filteredAllAlerts.filter(alert => alert.priority === headerFilters.currentState);
    filteredAlerts = filteredAlerts.filter(alert => alert.priority === headerFilters.currentState);
  }
  
  // Add more header filters here as needed

  setFilteredNotifications({allAlerts: filteredAllAlerts, alerts: filteredAlerts});
}

// 3. Include headerFilters in the useEffect trigger:
useEffect(() => {
  processNotificationFilters()
}, [notificationsFilter, headerFilters, alerts, allAlerts])
