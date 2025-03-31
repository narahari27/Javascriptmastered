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
