const isNrfNRDKpi = stat?.nodetype === "nrf" &&
                        (stat?.display_type === "kpi" || stat?.displaytype === "kpi") &&
                        stat?.type === "NRD";

    if (isNrfNRDKpi) {
        if (Number(stat.att) >= Number(stat.att_val)) {
            // Use succ value to determine priority
            const valueToCompare = Number(stat.succ);
            const greenCondition = parseCondition(stat.green);
            const orangeCondition = parseCondition(stat.orange);
            const redCondition = parseCondition(stat.red);
            const yellowCondition = parseCondition(stat.yellow);

            const conditions = {
                normal: greenCondition,
                major: orangeCondition,
                critical: redCondition,
                minor: yellowCondition
            };

            for (let priority in conditions) {
                const parts = conditions[priority]?.split('&&') || [];
                let logic = '';

                if (parts.length === 2) {
                    logic = `value ${parts[0]} && value ${parts[1]}`;
                } else if (parts.length === 1) {
                    logic = `value ${parts[0]}`;
                }

                const conditionMet = new Function('value', `return ${logic};`);
                if (conditionMet(valueToCompare)) {
                    return priority;
                }
            }

            return 'normal'; // fallback if none matched
        } else {
            return; // skip evaluation if att < att_val
        }
    }
