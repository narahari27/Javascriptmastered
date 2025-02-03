import React, { useContext } from 'react';
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
        width: 750,
    },
    tableRight: {
        borderCollapse: 'collapse',
        border: '1px solid black',
        width: 750,
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

const CombiKPIModalContent = React.memo(({ node, data }) => {
    const keys = Object.keys(data ?? {});
    const {locationMapping} = useContext(NodeContext);
    const locationDetails = locationMapping[node?.host_name] || {};
    const {city,omw,state} = locationDetails;

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

    const getNtwkStatusStyle = (status) => {
        return {
            border: '1px solid black',
            padding: '2px',
            color: status !== 'ON' ? '#ff0040' : 'inherit',
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

    const getKpiTableData = (kpis) => {
        return Object.values(kpis)?.map((kpi, index) => {
            return (
                <>
                    <TableRow key={'kpi-data-'+index}>
                        <TableCell style={getCellStyle(Object.values(kpis)[index]['NRD'])}>{kpi?.kpi}</TableCell>
                        {
                            node?.kpiHeaders?.map((type, index) => {
                                return (
                                    <TableCell key={`${kpi?.kpi}-type-${index}`} style={styles.tableCell}>{`${kpi[type]?.succ || 0} / ${kpi[type]?.att || 0}`}</TableCell>
                                )
                            })
                        }
                    </TableRow>
                </>
            )
        })
    }

    const getTableData = (kcis) => {
        return Object.values(kcis)?.map((kci, index) => {
            return (
                <>
                    <TableRow key={'kci-data-'+index}>
                        <TableCell style={getCellStyle(Object.values(kcis)[index]['NRD'])}>{kci?.kpi}</TableCell>
                        {
                            node?.kpiHeaders?.map((type, index) => {
                                return (
                                    <TableCell key={`${kci?.kpi}-type-${index}`} style={styles.tableCell}>{removeDecimal(kci[type]?.att)}</TableCell>
                                )
                            })
                        }
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
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className="name-icons">
                <div title={formattedName} className="icon-small">{firstLetterFirstName}{firstLetterLastName}</div>
            </div>
            <div style={{fontSize: '10px'}}>{time}</div>
          </div>
        );
      }

    return (
        <>
            <Table style={styles.tableTop}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCellTransparent}>{`Location: ${node?.host_name}/${node?.pool} /${omw || 'N/A'}/${city || 'N/A'},${state || 'N/A'}`}</TableCell>
                        <TableCell style={styles.tableCellCentered}>Network Check</TableCell>
                        <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>
                        <TableCell style={styles.tableCellCentered}>SW Version</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.tableCell}>{`KPI Interval: ${ showTime(Object.values(node?.stats)[0]['NRD']?.time_value)}`}</TableCell>
                        <TableCell style={getNtwkStatusStyle(node?.ntwCheck)}>{ node?.ntwCheck}</TableCell>
                        <TableCell style={getNestStatusStyle(node?.nestStatus)}>{node?.nestStatus || 'NA'}</TableCell>
                        <TableCell style={styles.tableCellCentered}>{node?.swVersion}</TableCell>
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
                <Grid item>
                    <Table style={styles.table}>
                        <TableHead style={styles.tableHead}>
                            <TableRow>
                                <TableCell style={styles.tableCellFixed}> KPI/NFType SR%/Att </TableCell>
                                {node?.kpiHeaders.map((header, index) => (
                                    <TableCell key={'kpi-header' + index} style={styles.tableCell}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.kpi && (
                                    <>{getKpiTableData(data?.kpi)}</>
                                )}
                            <TableRow>
                                <TableHead style={styles.tableHead}>
                                    <TableCell style={styles.tableCellFixed}> KCI/NFType </TableCell>

                                </TableHead>
                                {node?.kpiHeaders.map((header, index) => (
                                    <TableCell key={'kci-header' + index} style={styles.tableCell}></TableCell>
                                ))}
                            </TableRow>
                            
                            {
                                data?.kci && (
                                    <>{getTableData(data?.kci)}</>
                                )
                            }
                            <TableRow>
                                <TableHead style={styles.tableHead}>
                                    <TableCell style={styles.tableCellFixed}> KEI/Http Resp </TableCell>
                                </TableHead>
                                {node?.kpiHeaders.map((header, index) => (
                                    <TableCell key={'kei-header' + index} style={styles.tableCell}></TableCell>
                                ))}
                            </TableRow>
                            {
                                data?.kei && (
                                    <>{getTableData(data?.kei)}</>
                                )
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </>
    );
});

export default CombiKPIModalContent;
