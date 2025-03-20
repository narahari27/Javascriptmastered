function determinePriority(stat) {
    // Check for inactive status first
    if (stat.is_active === 0) {
        return 'default'; // Return 'default' to display in black
    }
    
    // For NRF nodes with type NRD
    if (stat?.nodetype === "nrf" && stat?.type === "NRD") {
        // Add complete debug logging to understand the values
        console.log(`NRF ${stat.type} - KPI: ${stat.kpi}, succ: ${stat.succ}, att: ${stat.att}, att_val: ${stat.att_val}`);
        console.log(`Thresholds - green: ${stat.green}, yellow: ${stat.yellow}, orange: ${stat.orange}, red: ${stat.red}`);
        
        // Check if att is greater than or equal to att_val
        if (stat?.att >= stat?.att_val) {
            // Parse the thresholds and check their direction
            const greenThreshold = stat.green;
            const yellowThreshold = stat.yellow;
            const orangeThreshold = stat.orange;
            const redThreshold = stat.red;
            
            // Parse the numeric value from succ
            const succValue = parseFloat(stat?.succ);
            
            // Check if value is numeric
            if (isNaN(succValue)) {
                console.log("Invalid succ value, defaulting to critical");
                return 'critical';
            }
            
            // Log the parsed values
            console.log(`Parsed succ value: ${succValue}`);
            
            // Directly implement threshold logic based on the patterns in your data
            // For red threshold like "<85"
            if (redThreshold && redThreshold.includes("<")) {
                const threshold = parseFloat(redThreshold.replace(/[<>\s]/g, ''));
                if (!isNaN(threshold) && succValue < threshold) {
                    console.log(`Red condition met: ${succValue} < ${threshold}`);
                    return 'critical';
                }
            }
            
            // For orange threshold like ">85 AND <90"
            if (orangeThreshold && orangeThreshold.includes(">") && orangeThreshold.includes("<")) {
                const parts = orangeThreshold.split(/AND/i);
                if (parts.length === 2) {
                    const lowerBound = parseFloat(parts[0].replace(/[<>\s]/g, ''));
                    const upperBound = parseFloat(parts[1].replace(/[<>\s]/g, ''));
                    if (!isNaN(lowerBound) && !isNaN(upperBound) && 
                        succValue > lowerBound && succValue < upperBound) {
                        console.log(`Orange condition met: ${lowerBound} < ${succValue} < ${upperBound}`);
                        return 'major';
                    }
                }
            }
            
            // For yellow threshold like ">90 AND <95"
            if (yellowThreshold && yellowThreshold.includes(">") && yellowThreshold.includes("<")) {
                const parts = yellowThreshold.split(/AND/i);
                if (parts.length === 2) {
                    const lowerBound = parseFloat(parts[0].replace(/[<>\s]/g, ''));
                    const upperBound = parseFloat(parts[1].replace(/[<>\s]/g, ''));
                    if (!isNaN(lowerBound) && !isNaN(upperBound) && 
                        succValue > lowerBound && succValue < upperBound) {
                        console.log(`Yellow condition met: ${lowerBound} < ${succValue} < ${upperBound}`);
                        return 'minor';
                    }
                }
            }
            
            // For green threshold like ">95"
            if (greenThreshold && greenThreshold.includes(">")) {
                const threshold = parseFloat(greenThreshold.replace(/[<>\s]/g, ''));
                if (!isNaN(threshold) && succValue > threshold) {
                    console.log(`Green condition met: ${succValue} > ${threshold}`);
                    return 'normal';
                }
            }
            
            // If none of the above conditions were met, check which threshold the value is closest to
            console.log("No direct threshold match, defaulting to critical");
            return 'critical';
        } else {
            console.log(`att (${stat.att}) < att_val (${stat.att_val}), setting critical`);
            return 'critical'; // If att is less than att_val
        }
    }
    
    // Original existing logic for other cases...
