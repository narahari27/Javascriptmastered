if(stat.is_active === 0){
        return;
    }
    
    // Special handling for NRF nodes
    if(stat?.nodetype === "nrf" && (stat?.display_type === "kpi" || stat?.displaytype === "kpi")) {
        // Skip if type is not NRD
        if (stat?.type !== "NRD") {
            return;
        }
        
        // Check if we have attempt data and if the attempt is sufficient
        if (stat?.att && stat?.att_val && parseFloat(stat.att) >= parseFloat(stat.att_val)) {
            // If attempts are sufficient, proceed to check thresholds for succ value
            return calculateNrfPriority(stat);
        } else {
            // If attempts are insufficient, return 'default'
            return 'default';
        }
    }

function calculateNrfPriority(stat) {
    // Get the success value to compare against thresholds
    const succValue = parseFloat(stat.succ);
    
    // Parse conditions
    const greenCondition = parseCondition(stat.green);
    const yellowCondition = parseCondition(stat.yellow);
    const orangeCondition = parseCondition(stat.orange);
    const redCondition = parseCondition(stat.red);
    
    // Return priority based on threshold conditions
    const conditions = {'normal': greenCondition, 'minor': yellowCondition, 'major': orangeCondition, 'critical': redCondition};
    
    for(let priority in conditions){
        const condition = conditions[priority];
        if (!condition) continue;
        
        const parts = condition.split('&&');
        let logic = '';
        if(parts.length == 2){
            logic = 'value' + ' ' + parts[0] + ' && ' + 'value' + parts[1];
        } else {
            logic = 'value' + ' ' + parts[0];
        }

        const conditionMet = new Function('value', `return ${logic};`);
        if(conditionMet(succValue)){
            return priority;
        }
    }
    
        
