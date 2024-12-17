const KPI_NAME = {
    'UE_Attach_SR': 'Attach',
    'UE_ServiceReq_SR': 'Service Request',
    'UE_Authen_SR': 'UE Authentication',
    'HSS_Authen_SR': 'HSS Authentication (AIA/AIR)',
    'Update_Location_SR': 'Update Location (ULA/ULR)',
    'Def_Bearer_SR': 'Default Bearer Activation',
    'PDNConnReq_SR': 'PDN Connectivity',
    'PdnConnIms_SR': 'PDN Connectivity (IMS)',
    'Create_Ded_Bearer_QCI1': 'Create Ded Bearer (VoLTE)',
    'UpdateDedicatedBearer_QCI_1_SR': 'Update Ded Bearer (VoLTE)',
    'Create_Ded_Bearer_QCI2': 'Create Ded Bearer (PoLTE/QCI2)',
    'EmergencyAttach_Res': 'Attach (Emergency)',
    'MobileTermLocRequests_SR': 'MT Location Request',
    'Paging_Resp_SR': 'Paging',
    'Total_TAU_SR': 'Tracking Area Update (TAU)',
    'UE_RF_Drp_Rate': 'UE RF Drop Rate',
    'CreateDedBea_QCI1_DrpRate_Res': 'Ded Bearer RF Drop Rate(QCI1)',
    'GTP_S11_SR': 'GTP-C S11 Resp/Request',
    'NbrProceduresProcessed_sum_SR': 'All MME Procedure Processed',
    'DNS_SR': 'DNS (MME<->DNS-G)'
}

let isString = value => typeof value === 'string' || value instanceof String;

function determinePriority(stat) {
    if(stat.is_active === 0){
        return;
    }
    if (!stat.red && !stat.orange && !stat.green && !stat.yellow) {
        return;
    }

    if(!isString(stat.red) && !isString(stat.orange) && !isString(stat.green) && !isString(stat.yellow)) {
        return 'normal';
    }
    
    const greenCondition = parseCondition(stat.green);
    const orangeCondition = parseCondition(stat.orange);
    const redCondition = parseCondition(stat.red);
    const yellowCondition = parseCondition(stat.yellow);
    let calcAttempt = false;

    if (stat?.attempt == 1) {
        calcAttempt = true;
    }

    const valueToCompare = stat?.display_type == 'kpi' ? stat?.succ : stat?.att;

    const conditions = {'normal': greenCondition, 'major': orangeCondition, 'critical': redCondition, 'minor': yellowCondition}
    for(let priority in conditions){
        const parts = conditions[priority].split('&&');
        let logic = ''
        if(parts.length == 2 ){
            logic = 'value' + ' ' + parts[0] + ' && ' + 'value' + parts[1];
        }else {
            logic = 'value' + ' ' + parts[0]
        }
       
        const conditionMet = new Function('value', `return ${logic};`);
        if(conditionMet(valueToCompare)){
            if (calcAttempt) {
                if (stat.att > stat?.att_val) {
                    return priority
                } else {
                    return 'critical'
                }
            }
            return priority
        }
    }
    
}

function parseCondition(condition) {
    if (!condition) {
        return null;
    }

    return condition.replace(/\s{2,}/g, ' ').replace(/and/g, '&&').replace(/AND/g, '&&').replace(/or/g, '||').replace(/OR/g, '||')
}

function checkCondition(conditions, value, stat) {
   
    return conditions.every(condition => {
        switch (condition.operator) {
            case '>':
                return value > condition.value;
            case '<':
                return value < condition.value;
            case '>=':
                return value >= condition.value;
            case '<=':
                return value <= condition.value;
            default:
                return false;
        }
    });
}

function calculatePriority(stats) {
    const last_value = stats.rate;
    if (last_value < stats?.orange) {
        return 'critical';
    } else if (last_value < stats?.yellow && last_value >= stats?.orange) {
        return 'major';
    } else if (last_value < stats?.green && last_value >= stats?.yellow) {
        return 'minor';
    } else if (last_value >= stats?.green) {
        return 'normal';
    }

    return;
}

function processData(data) {
    const { stats, avg } = data;

    const AVG = avg?.reduce((acc, curr) => {
        if (!acc[curr.host_name]) {
            acc[curr.host_name] = {}
            acc[curr.host_name][curr.kpi] = curr.last_7_avg_succ
        } else {
            acc[curr.host_name][curr.kpi] = curr.last_7_avg_succ
        }
        return acc;
    }, {});

    const ATT = avg?.reduce((acc, curr) => {
        if (!acc[curr.host_name]) {
            acc[curr.host_name] = {}
            acc[curr.host_name][curr.kpi] = curr.last_7_avg_att
        } else {
            acc[curr.host_name][curr.kpi] = curr.last_7_avg_att
        }
        return acc;
    }, {});

    const STATS = stats?.reduce((acc, curr) => {
        if (curr.nodetype == 'nrf') {
            if (!acc[curr.host_name]) {
                acc[curr.host_name] = {}
            }

            if (!acc[curr.host_name][curr.kpi]) {
                acc[curr.host_name][curr.kpi] = {}
            }
            
            if (curr.type) {
                acc[curr.host_name][curr.kpi][curr.type] = {
                    ...curr,
                    name: KPI_NAME[curr.kpi],
                    priority: determinePriority(curr)
                }

            } else if (curr.nftype) {
                acc[curr.host_name][curr.kpi][curr.nftype] = {
                    ...curr,
                    name: KPI_NAME[curr.kpi]
                }
            }
        } else {
            if (!acc[curr.host_name]) {
                acc[curr.host_name] = {}
                acc[curr.host_name][curr.kpi] = {
                    ...curr,
                    name: KPI_NAME[curr.kpi],
                    priority: determinePriority(curr),
                    avg: AVG && AVG[curr.host_name] ? AVG[curr.host_name][curr.kpi] : 0,
                    last_7_att: ATT && ATT[curr.host_name] ? ATT[curr.host_name][curr.kpi] : 0
                }
            } else {
                acc[curr.host_name][curr.kpi] = {
                    ...curr,
                    name: KPI_NAME[curr.kpi],
                    priority: determinePriority(curr),
                    avg: AVG && AVG[curr.host_name] ? AVG[curr.host_name][curr.kpi] : 0,
                    last_7_att: ATT && ATT[curr.host_name] ? ATT[curr.host_name][curr.kpi] : 0
                }
            }
        }
        return acc;
    }, {});

    return STATS;
}

onmessage = function (e) {
    const result = processData(e.data);
    postMessage(result);
};
