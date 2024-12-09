import React, { useContext, useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Typography, Grid } from '@mui/material';
import moment from 'moment-timezone';
import { NodeContext } from '../NodeContext';

const timeZone = 'UTC';

const styles = {
    tableTop: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 750,
    },
    table: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 430,
    },
    tableRight: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 320,
    },
    tableHead: {
        backgroundColor: '#d6006e',
        color: '#fff'
    },
    tableCell: {
        border: '1px solid black',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
    },
    tableCellCentered: {
        border: '1px solid black',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
        textAlign: 'center'
    },
    tableCellTransparent: {
        border: '1px solid black',
        padding: '2px',
        color: 'black',
        fontSize: '12px',
        backgroundColor: '#bfab5b',
        width: 430,
    },
    tableCellColored: {
        border: '1px solid black',
        padding: '2px',
        backgroundColor: '#d6006e',
        color: 'white',
        fontSize: '12px',
    },
    tableCellFixed: {
        border: '1px solid black',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
        width: 200,
    },
};

const KPIModalContent = React.memo(({ node, data }) => {
    const hardcodedData = {
        "amf": {
            "kpi": [
                "UE Registration",
                "UE Registration Inital",
                "UE Registration Mobility",
                "AMF Registration(AMF->UDM)",
                "AMF Authentication(AMF->AUSF)",
                "AMF Authentication(5G AKA)",
                "AMF Authentication(SMC)",
                "Create SM Context (AMF->SMF)",
                "Update SM Context",
                "Retrieve SM Context",
                "UE PDU Establish Initial",
                "UE PDU Establish IMS",
                "UE PDU Establish Existing",
                "UE PDU Session Modify",
                "SMF PDU Session Modify",
                "UE Service Request",
                "UE Service Request Data",
                "Service Request MT",
                "5GS->EPS Handover",
                "Idle Mobility (5GS->EPS)",
                "Idle Mobility (EPS->5GS)",
                "UE Paging",
                "NF Discovery SMF",
                "UE Policy Create (N15)",
                "Activate SMS(AMF<->SMSF)",
                "EIR (AMF->5GEIR)"
            ],
            "kci": [
                "Registered UE(5G)",
                "Registered UE(IMS)",
                "PDU Session(5G)",
                "Connected UE(5G)",
                "MPH Msgs /Second"
            ],
            "kei": [
                "RegInitFail 5GMMCC#7",
                "RegInitFail 5GMMCC#11",
                "RegInitFail 5GMMCC#12",
                "RegInitFail 5GMMCC#13",
                "RegInitFail 5GMMCC#15",
                "RegInitFail 5GMMCC#22",
                "RegInitFail 5GMMCC#27",
                "RegInitFail 5GMMCC#73",
                "RegInitFail 5GMMCC#100",
                "RegInitFail 5GMMCC#111",
                "PduSessFail 5GMMCC#22",
                "PduSessFail 5GMMCC#65",
                "PduSessFail 5GMMCC#67",
                "PduSessFail 5GMMCC#69",
                "PduSessFail 5GMMCC#90",
                "PduSessFail 5GMMCC#91",
                "Create SM Context TimeOut",
                "N2disabled",
                "N2enabled"
            ],
            "kii": [
                "RC"
            ]
        },
        "mme": {
            "kpi": [
                "UE Authentication",
                "PDN Connectivity",
                "Default Bearer Activation",
                "Update Location (ULR/ULA)",
                "Connectivity (IMS)",
                "UE RF Drop Rate",
                "Created Ded Bearer (VoLTE)",
                "DNS (MME<->DNS-G)",
                "All MME Procedure Processed",
                "GTPC S11 Response/Request",
                "Tracking Area Update (TAU)",
                "Paging",
                "Update Dedicated Bearer(VoLTE)",
                "PDN Connectivity (IMS)",
                "HSS Authentication (MME<->HSS)",
                "Service Request",
                "Attach",
                "5G->EPS HO"
            ],
            "kci": [
                "Registered UEs",
                "QCI1 Ded Bearer",
                "Dedicated Bearer",
                "Total MPH Messages/sec"
            ],
            "kei": [
                "S1mmeDisabled",
                "S1mmeEnabled",
                "Network Failure/Attach",
                "Attach Protocol Error CC#111",
                "TAU Protocol Error CC#111",
                "Network Failure/HSS",
                "Default Bearer PGW No Response",
                "Attach Reject Capacity",
                "Default Bearer No IP",
                "Default Bearer No Resources",
                "Default Bearer Rejected",
                "PDN Connect Network Failure",
                "Attach Throttled Dropped"
            ]
        },
        "smsf": {
            "kpi": [
                "SMS Service Activate",
                "UE Service Activation",
                "UDM UECM Registration",
                "UDM SDM GET",
                "UDM SDM Subscribe",
                "UDM SDM Modify Sub",
                "SMS Delivery (MO)",
                "SMS Delivery (MT)",
                "UE Enable Reachability (MT)",
                "SMService UpLink SMS",
                "N1N2 Message Transfer",
                "OFR SGd MO",
                "TFR SGd  (MT)",
                "NRF Discovery",
                "NRF Subscribe",
                "NRF Heartbeat",
                "NRF Cache",
                "UDM UECM DeRegister",
                "SMS Service Deactivate",
                "Total Requests (SBI/SGd)"
            ],
            "kei": [],
            "kci": [
                "Active Context Subs",
            ]
        },
        "vepdg":{
            "kpi":[
                "IKEv2_SA (UE<->vEPDG",
                "IKEv2_Child_SA (UE<->vEPDG)",
                "Diameter_DEA/DER (vEPDG<->AAA)",
                "Diameter AAA/AAR (AAA<->vEPDG)",
                "IKEv2 IPSEC Tunnel",
                "Create Session",
                "Create Bearer",
                "WiFi TO LTE HO",
                "LTE TO WiFi HO",
                "NAPTR Query",
                "NAPTR A-Query",
                "VPEDG-KPI-Test"    
            ],
            "kci":[
                "Total PDN Connection",
                "Total PDN Connection (v4)",
                "Total PDN Connection (v6)",
                "VPEDG-KCI-Test"
            ],
            "kei":[
                "DNS A-Query Retry",
                "DNS A-Query TimeOut",
                "DNS NAPTR-Query Retry",
                "DNS NAPTR-Query TimeOut",
                "SWm DEA Response CC#3004",
                "SWm DEA Response CC#4001",
                "SWm DEA Response CC#5003",
                "SWm DEA Response CC#5004",
                "SWm DEA Response CC#5012",
                "SWm DEA Response CC#5004",
                "SWm DER Request TimedOut",
                "Create Session GTP CC#64",
                "Create Session GTP CC#72",
                "Create Session GTP CC#73",
                "Create Session GTP CC#83",
                "Create Session GTP CC#84",
                "Create Session Retry",
                "Create Bearer CC#64",
                "Create Bearer CC#82",
                "Create Bearer CC#87",
                "Create Bearer CC#88",
                "Create Bearer CC#72",
                "VPEDG-KEI-TEst"
            ]
        }
    };
    const keys = Object.keys(data ?? {});
    const tableHeaders = ['15 min KPI', 'SR%', 'Avg%', 'Attempts', 'Avg Att'];
    const { tech, filters } = useContext(NodeContext);
    const getColorPriority = (priority) => {
        switch (priority) {
            case 'critical':
                return '#dc3545';
            case 'major':
                return '#ff5722';
            case 'minor':
                return '#ffff00';
            case 'oor':
                return '#0a58ca';
            case 'normal':
                return '#07664d';

            default:
                return '#000';
        }
    }

    const getCellStyle = (data) => {
        return {
            border: '1px solid black',
            padding: '2px',
            color: data?.is_active ? getColorPriority(data?.priority) : 'black',
            fontSize: '12px',
        };
    };
    const getRCStyle = (value) => {
        return {
            border: '1px solid black',
            padding: '2px',
            color: value != 50 ? '#ff0040' : 'inherit',
            fontSize: '12px',
            textAlign: 'center'
        }
    }

    const getNestStatusStyle = (status) => {
        return {
            border: '1px solid black',
            padding: '2px',
            color: status !== 'InService' ? '#ff0040' : 'inherit',
            fontSize: '12px',
            textAlign: 'center'
        }
    }

    const sort_by_id = (key) => {
        return function (elem1, elem2) {
            if (elem1[key] < elem2[key]) {
                return -1;
            } else if (elem1[key] > elem2[key]) {
                return 1;
            } else {
                return 0;
            }
        };
    }

    const showTime = (date) => {
        if (date) {
            return moment(date).format('DD MMM YYYY HH:mm:ss [GMT]');
        } else {
            return '';
        }
    }

    const removeDecimal = (text) => {
        return ~~text
    }

    const processKPIData = (techType, kpiData) => {
        const kpiList = hardcodedData[techType]?.kpi || [];
        const apiKpiData = Array.isArray(kpiData) ? kpiData : [];
        const mergedData = kpiList.map((kpiName) => {
            const apikpi = apiKpiData.find(kpi => kpi?.kpi === kpiName);
            return apikpi || {
                kpi: kpiName,
                succ: null,
                avg: null,
                att: null,
                last_7_att: null
            };
        });
        const remainingApiData = apiKpiData.filter(kpi => {
            return kpi?.kpi && !kpiList.includes(kpi.kpi);
        });

        data.kpi = [...mergedData, ...remainingApiData];
    };

    const processKEIData = (techType, keiData) => {
        if(node.nodetype === "smsf"){
            return;
        }
        const keiList = hardcodedData[techType]?.kei || [];

        const apiKeiData = Array.isArray(keiData) ? keiData : [];

        const mergedData = keiList.map((keiName) => {
            const apikei = apiKeiData.find(kei => kei?.kpi === keiName);
            return apikei || {
                kpi: keiName,
                att: null,
                last_7_att: null
            };
        });


        const remainingApiData = apiKeiData.filter(kei => {
            return kei?.kpi && !keiList.includes(kei.kpi);
        });


        data.kei = [...mergedData, ...remainingApiData];

    };
    const processKCIData = (techType, kciData) => {
        const kciList = hardcodedData[techType]?.kci || [];

        const apiKciData = Array.isArray(kciData) ? kciData : [];

        const mergedData = kciList.map((kciName) => {
            const apikci = apiKciData.find(kci => kci?.kpi === kciName);

            return apikci || {
                kpi: kciName,
                att: null,
                last_7_att: null
            };
        });


        const remainingApiData = apiKciData.filter(kci => {
            return kci?.kpi && !kciList.includes(kci.kpi);
        });


        data.kci = [...mergedData, ...remainingApiData];

    };

    processKPIData(node.nodetype, data.kpi);
    processKEIData(node.nodetype, data.kei);
    processKCIData(node.nodetype, data.kci);

    const getKpiTableData = (kpis) => {
        return Object.values(kpis)?.map((kpi, index) => {
            return (
                <>
                    <TableRow key={'kpi-data-' + index}>
                        <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                        <TableCell style={kpi?.succ ? getCellStyle(kpi) : styles.tableCell}>{kpi?.succ || 'null'}</TableCell>
                        <TableCell style={styles.tableCell}>{kpi?.avg || 'null'}</TableCell>
                        <TableCell style={styles.tableCell}>{kpi?.att || 'null'}</TableCell>
                        <TableCell style={styles.tableCell}>{removeDecimal(kpi?.last_7_att)}</TableCell>
                    </TableRow>
                </>
            )
        })
    }

    const getTableData = (kcis) => {
        return Object.values(kcis)?.map((kci, index) => {
            return (
                (kci?.kpi !== 'RC_Value') && (kci?.kpi !== 'RC') && (kci?.kpi !== "ModelD") &&
                <>
                    <TableRow key={'kci-data-' + index}>
                        <TableCell style={getCellStyle(kci)}>{kci?.kpi}</TableCell>
                        <TableCell style={getCellStyle(kci)}>{removeDecimal(kci?.att) + ' / ' + removeDecimal(kci?.last_7_att)}</TableCell>
                    </TableRow>
                </>
            )
        })
    }

    function noteInfo(note) {
        let formattedName = note?.updated_by;
        const time = moment(note?.updated_at).tz(timeZone).format('MM/DD/YYYY HH:mm');
        if (!formattedName) {
            formattedName = 'Default, User';
        } else if (formattedName === 'Default User') {
            formattedName = 'Default, User';
        }
        let [firstName, lastName] = formattedName.split(', ');
        let firstLetterFirstName = firstName.charAt(0).toUpperCase();
        let firstLetterLastName = lastName.charAt(0).toUpperCase();

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="name-icons">
                    <div title={formattedName} className="icon-small">{firstLetterFirstName}{firstLetterLastName}</div>
                </div>
                <div style={{ fontSize: '10px' }}>{time}</div>
            </div>
        );
    }

    return (
        <>
            <Table style={styles.tableTop}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCellTransparent}>{`Location: ${node?.host_name}`}</TableCell>
                        <TableCell style={styles.tableCellCentered}>{node.nodetype === "smsf" ? "Nrf Support" : "RC"}</TableCell>
                        <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>
                        <TableCell style={styles.tableCellCentered}>SW Version</TableCell>
                        {node.nodetype !== "smsf" && <TableCell style={styles.tableCellCentered}>Build</TableCell>}

                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.tableCell}>{`KPI Interval: ${showTime(Object.values(node?.stats)[0]?.time_value)}`}</TableCell>
                        <TableCell style={getRCStyle(node?.stats?.RC_Value?.att || node?.stats?.RC?.att)}>{node?.stats?.ModelD ? (node?.stats?.ModelD.att === "true"? "InService" : "ORR") : node?.stats?.RC_Value?.att || node?.stats?.RC?.att || 0}</TableCell>
                        <TableCell style={getNestStatusStyle(node?.nestStatus)}>{node?.nestStatus || 'NA'}</TableCell>
                        <TableCell style={styles.tableCellCentered}>{node?.stats?.releasenum?.sw_version}</TableCell>
                        {node.nodetype !== "smsf" && <TableCell style={styles.tableCellCentered}>{removeDecimal(node?.stats?.Build?.att)}</TableCell>}

                    </TableRow>
                    {
                        node?.notes?.length > 0 && (
                            <TableRow>
                                <TableCell style={styles.tableCellColored}>Latest Note</TableCell>
                                <TableCell style={styles.tableCell}>{node?.notes?.length > 0 ? node?.notes?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]?.notes : ''}</TableCell>
                                <TableCell style={styles.tableCell}>{node?.notes?.length > 0 ? noteInfo(node?.notes?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0]) : ''}</TableCell>
                                {/* <TableCell style={styles.tableCell}>{node?.notes?.length > 0 ? node?.notes[0]?.updated_by : ''}</TableCell> */}
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>

            <Grid container>
                <Grid item xs>
                    {
                        data?.kpi && (
                            <Table style={styles.table}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell key={'kpi-header' + index} style={styles.tableCell}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getKpiTableData(data?.kpi)}
                                </TableBody>
                            </Table>
                        )
                    }
                </Grid>
                <Grid item xs>
                    {
                        data?.kci && (
                            <Table style={styles.tableRight}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        <TableCell style={styles.tableCellFixed}> 15 min KCI </TableCell>
                                        <TableCell style={styles.tableCell}>Current/Average </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getTableData(data?.kci)}
                                </TableBody>
                            </Table>
                        )
                    }
                    {
                        data?.kei && (
                            <Table style={styles.tableRight}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        <TableCell style={styles.tableCellFixed}> 15 min KEI </TableCell>
                                        <TableCell style={styles.tableCell}> <span style={{ color: '#d6006e' }}>Current/Average </span>  </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getTableData(data?.kei)}
                                </TableBody>
                            </Table>
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
});

export default KPIModalContent;
