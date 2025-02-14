import React, { useContext } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Typography, Grid } from '@mui/material';
import moment from 'moment-timezone';
import { NodeContext } from '../NodeContext';

const timeZone = 'UTC';

const styles = {
    tableTop: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 500,
    },
    tableTopSmf: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 680,
    },
    table: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 430,
    },
    tableMkt: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 600,
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
        height: '20px'
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
    tableCellMkt: {
        border: '1px solid black',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
        width: 250,
    },
    tableCellSmall: {
        border: '1px solid black',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
        width: 100,
    },
};

const KPIModalContent = React.memo(({ node, data, isSmf, nest, hideNest = false }) => {

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
            minHeight: '20px'
        };
    };

    const getNestStatusStyle = (status) => {
        return {
            border: '1px solid black',
            padding: '2px',
            color: status !== 'InService' ? '#ff0040' : 'inherit',
            fontSize: '12px',
            textAlign: 'center'
        }
    }

    const showTime = (date) => {
        if (date) {
            return  moment(date).format('DD MMM YYYY HH:mm:ss [GMT]');
        } else {
            return '';
        }
    }

    const getFrateData = (kpi) => {
        return (
            <>
                {
                    kpi.kpi && (
                        <TableRow>
                            <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.frate ? Number(kpi.frate)?.toFixed(2) : ''}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.avg_frate ? Number(kpi.avg_frate)?.toFixed(2) : ''}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.var_frate ? Number(kpi.var_frate)?.toFixed(2) : ''}</TableCell>
                        </TableRow>
                    )
                }
            </>
        )
    }

    const getSumData = (kpi) => {
        return (
            <>
                {
                    kpi.kpi && (
                        <TableRow>
                            <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.sum ? Number(kpi.sum)?.toFixed(2) : ''}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.avg_sum ? Number(kpi.avg_sum)?.toFixed(2) : ''}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.var_sum ? Number(kpi.var_sum)?.toFixed(2) : ''}</TableCell>
                        </TableRow>
                    )
                }
            </>
        )
    }

    // const getData = (kpiData, splitData, showFirst) => {
    //     let data = kpiData;
    //     if(splitData && isSmf){
    //         if(data.length % 2 !== 0){
    //             data.push({kpi: '', succ: '', att: ''})
    //         }
    //         const mid = Math.ceil(data.length / 2);
    //         const first = data.slice(0, mid);
    //         const second =  data.slice(mid);
    //         if(showFirst){
    //             data = first;
    //         }else {
    //             data = second;
    //         }
    //     }
    //     console.log(data)
    //     return (
    //         <>
    //             {
    //                 data.map((kpi, index) => (
    //                     <TableRow key={`KPI_DATA${index}`} style={{minHeight: '20px'}}>
    //                         <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
    //                         <TableCell style={styles.tableCell}>{kpi.suc ? Number(kpi.suc) : ''}</TableCell>
    //                         <TableCell style={styles.tableCell}>{kpi.att && Number(kpi.att) > 0 ? ~~ Number(kpi.att) : ''}</TableCell>
    //                     </TableRow>
    //                 ))
    //             }
    //         </>
    //     )
    // }
    const getData = (kpiData, splitData, showFirst, isSmf) => {
        let data = [...kpiData];
       const obj = {
       kpi: [
       "4G Attach SGW",
       "4G Create Session",
       "4G Modify Bearer",
       "4G PDN Session Create",
       "4G Update Bearer",
       "4G_to_5G_HO_SR",
       "5G PDN Session Create",
       "5G to 4G HO",
       "CEPS",
       "N10 Subscribe Notify",
       "N10 Subscription Fetch",
       "N10 UE Register",
       "N11 Create Context",
       "N11 Update Context",
       "N1N2 Message Transfer",
       "N4 Session Establishment",
       "N4 Session Modification",
       "N4 Session Report",
       "N40 Charging Data Initial",
       "N40 Charging Data Notify",
       "N40 Charging Data Update",
       "N7 Policy Create",
       "N7 Policy Update",
       "Nnrf Heartbeat",
       "Nnrf Subscription",
       "Secondary PDN Creation",
       "Sxa Session Establishment",
       "Sxa Session Modification",
       "Sxa Session Report",
       "4G Create Bearer",
       "EPSFB Dedicated Bearer",
       "VoLTE Ded Bearer Create",
       "VoLTE Ded Bearer Modify",
       "VoNR Ded Bearer Create",
       "VoNR Ded Bearer Modify"
        ],
       kci: [
       "5QI-1",
       "5QI-1 WLAN",
       "QCI-1 EUTRAN",
       "QCI-1 WLAN",
       "Session EUTRAN",
       "Session NR",
       "Sessions Total",
       "SMF Status"
        ]
        };
        data = data.map(item => {
            const updatedItem = { ...item };
           if (updatedItem.display_type === "kpi" && obj.kpi.includes(updatedItem.kpi)) {
           updatedItem.kpi = updatedItem.kpi;
            } else if (updatedItem.display_type === "kci" && obj.kci.includes(updatedItem.kpi)) {
           updatedItem.kpi = updatedItem.kpi;
            } else {
           updatedItem.kpi = updatedItem.display_type === "kpi" ? obj.kpi[0] : obj.kci[0];
            }
           return updatedItem;
            });
            console.log(splitData)
            if(splitData && isSmf){
                        if(data.length % 2 !== 0){
                            data.push({kpi: '', succ: '', att: ''})
                        }
                        const mid = Math.ceil(data.length / 2);
                        const first = data.slice(0, mid);
                        const second =  data.slice(mid);
                        if(showFirst){
                            data = first;
                        }else {
                            data = second;
                        }
                    }
        
        console.log(data)
                return (
                    <>
                      {data.map((kpi, index) => (
                        <TableRow key={`KPI_DATA${index}`} style={{ minHeight: "20px" }}>
                          <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                          <TableCell style={styles.tableCell}> {kpi.suc ? Number(kpi.suc) : ""} </TableCell>
                          <TableCell style={styles.tableCell}>{kpi.att && Number(kpi.att) > 0 ? ~~Number(kpi.att) : ""}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
    }
    const getKciData = (kpiData, splitData, showFirst) => {
        let data = kpiData;
        if(splitData && isSmf){
            if(data.length % 2 !== 0){
                data.push({kpi: '', succ: '', att: ''})
            }
            const mid = Math.ceil(data.length / 2);
            const first = data.slice(0, mid);
            const second =  data.slice(mid);
            if(showFirst){
                data = first;
            }else {
                data = second;
            }
        }
        return (
            <>
                {
                    data.map((kpi, index) => (
                        <TableRow key={`KCI_DATA${index}`} style={{minHeight:'20px'}}>
                            <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                            {isSmf && <TableCell style={styles.tableCell}></TableCell>}
                            <TableCell style={styles.tableCell}>{kpi.att && Number(kpi.att) > 0 ? ~~ Number(kpi.att) : ''}</TableCell>
                        </TableRow>
                    ))
                }
            </>
        )
    }

    const getLocation = () => {
        const _node = data[0]
        let name = _node?.pool;

        if (_node.market_name && _node.market_name != "null") {
            name += `/${_node.market_name}`
        }

        if (_node.rack_name && _node.rack_name != "null") {
            name += `/${_node.rack_name}`
        }

        if (_node.node_name && _node.node_name != "null") {
            name += `/${_node.node_name}`
        }

        return name;
    }

    const getNest = () => {
        if (nest) {
            return nest[node.host_name]
        } else {
            return 'NA'
        }
    }

    return (
        <>
            {
                !isSmf && (
                    <>
                        <Table style={styles.tableMkt}>
                            <TableHead style={styles.tableHead}>
                                <TableRow>
                                    <TableCell style={styles.tableCellTransparent}>{`Location: ${getLocation()}`}</TableCell>
                                    {!hideNest && <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={styles.tableCell}>{`KPI Interval: ${showTime(data[0]?.time_value)}`}</TableCell>
                                    {!hideNest && <TableCell style={getNestStatusStyle(getNest())}>{getNest()}</TableCell>}
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Grid container>
                            <Grid item>
                                <Table style={styles.tableMkt}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellMkt}> 15 min KPI </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Failure Rate </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Failure Rate 7 Day Avg </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Failure Rate Variation % </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getFrateData(data?.filter(_ => _.kpi.indexOf('Throughput') === -1).length ? data?.filter(_ => _.kpi.indexOf('Throughput') === -1)[0] : {})}
                                    </TableBody>
                                </Table>
                                <Table style={styles.tableMkt}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellMkt}> 15 min KPI </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Sum </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Sum 7 Day Avg </TableCell>
                                            <TableCell style={styles.tableCellMkt}> Sum Variation % </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getSumData(data?.filter(_ => _.kpi.indexOf('Throughput') > -1).length ? data?.filter(_ => _.kpi.indexOf('Throughput') > -1)[0] : {})}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </>
                )
            }

            {
                isSmf && (
                    <>
                        <Table style={styles.tableTopSmf}>
                            <TableHead style={styles.tableHead}>
                                <TableRow>
                                    <TableCell style={styles.tableCellTransparent}>{`Location: ${getLocation()}`}</TableCell>
                                    <TableCell style={styles.tableCellCentered}>Type</TableCell>
                                    {!hideNest && <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>}
                                    <TableCell style={styles.tableCellCentered}>SW Version</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={styles.tableCell}>{`KPI Interval: ${showTime(data[0]?.time_value)}`}</TableCell>
                                    <TableCell style={styles.tableCell}>{data[0]?.type}</TableCell>
                                    {!hideNest && <TableCell style={getNestStatusStyle(getNest())}>{getNest()}</TableCell>}
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Grid container>
                            <Grid item xs>
                                <Table style={styles.tableLeft}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> 5 min KPI </TableCell>
                                            <TableCell style={styles.tableCellSmall}> Succ </TableCell>
                                            <TableCell style={styles.tableCellSmall}> Att </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getData(data?.filter((_) => _.displaytype === 'kpi'), true, true)}
                                        {isSmf && (
                                            <TableRow key={`KCI`}>
                                                <TableCell style={styles.tableCell}>KCI</TableCell>
                                                <TableCell style={styles.tableCell}></TableCell>
                                                <TableCell style={styles.tableCell}></TableCell>
                                            </TableRow>
                                        )}
                                        {isSmf && (
                                            getKciData(data?.filter(_ => _.displaytype == 'kci'), true, true)
                                        )}
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item xs>
                                <Table style={styles.tableLeft}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> 5 min KPI </TableCell>
                                            <TableCell style={styles.tableCellSmall}> Succ </TableCell>
                                            <TableCell style={styles.tableCellSmall}> Att </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getData(data?.filter((_) => _.displaytype === 'kpi'), true, false)}
                                        {isSmf && (
                                            <TableRow key={`KCI2`} style={{height: '23px'}}>
                                                <TableCell style={styles.tableCell}>{' '}</TableCell>
                                                <TableCell style={styles.tableCell}></TableCell>
                                                <TableCell style={styles.tableCell}></TableCell>
                                            </TableRow>
                                        )}
                                        {isSmf && (
                                            getKciData(data?.filter(_ => _.displaytype == 'kci'), true, false)
                                        )}
                                    </TableBody>
                                </Table>
                            </Grid>

                            {!isSmf && (
                                <Grid item xs >
                                    <Table style={styles.tableRight}>
                                        <TableHead style={styles.tableHead}>
                                            <TableRow>
                                                <TableCell style={styles.tableCellFixed}> KCI </TableCell>
                                                <TableCell style={styles.tableCellSmall}> Att </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {getKciData(data?.filter(_ => _.displaytype == 'kci'))}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            )}
                        </Grid>
                    </>
                )
            }
        </>
    );
});

export default KPIModalContent;
