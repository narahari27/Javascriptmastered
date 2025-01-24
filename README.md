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
    table: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 500,
    },
    tableRight: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 500,
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
        width: 150,
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
            return moment(new Date(date)).tz(timeZone).subtract(5, 'hours').format('DD MMM YYYY HH:mm:ss [GMT]');
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

    const getData = (kpiData) => {
        return (
            <>
                {
                    kpiData.map((kpi, index) => (
                        <TableRow key={`KPI_DATA${index}`}>
                            <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.suc ? Number(kpi.suc) : ''}</TableCell>
                            <TableCell style={styles.tableCell}>{kpi.att && Number(kpi.att) > 0 ? ~~ Number(kpi.att) : ''}</TableCell>
                        </TableRow>
                    ))
                }
            </>
        )
    }

    const getKciData = (kpiData) => {
        return (
            <>
                {
                    kpiData.map((kpi, index) => (
                        <TableRow key={`KCI_DATA${index}`}>
                            <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
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
                        <Table style={styles.tableTop}>
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
                                <Table style={styles.table}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> KPI </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Failure Rate </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Failure Rate 7 Day Avg </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Failure Rate Variation % </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getFrateData(data?.filter(_ => _.kpi.indexOf('Throughput') === -1).length ? data?.filter(_ => _.kpi.indexOf('Throughput') === -1)[0] : {})}
                                    </TableBody>
                                </Table>
                                <Table style={styles.table}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> KPI </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Sum </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Sum 7 Day Avg </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Sum Variation % </TableCell>
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
                        <Table style={styles.tableTop}>
                            <TableHead style={styles.tableHead}>
                                <TableRow>
                                    <TableCell style={styles.tableCellTransparent}>{`Location: ${getLocation()}`}</TableCell>
                                    <TableCell style={styles.tableCellCentered}>Type</TableCell>
                                    {!hideNest && <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>}
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
                            <Grid item>
                                <Table style={styles.table}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> KPI </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Succ </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Att </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getData(data?.filter(_ => _.displaytype == 'kpi'))}
                                    </TableBody>
                                </Table>
                                <Table style={styles.table}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            <TableCell style={styles.tableCellFixed}> KCI </TableCell>
                                            <TableCell style={styles.tableCellFixed}> Att </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getKciData(data?.filter(_ => _.displaytype == 'kci'))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </>
                )
            }
        </>
    );
});

export default KPIModalContent;
