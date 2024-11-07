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
    const keys = Object.keys(data ?? {});
    const tableHeaders = ['15 min KPI', 'SR%', 'Avg%', 'Attempts', 'Avg Att'];
    const {filters} = useContext(NodeContext);
    
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
    //abc
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
            return moment(new Date(date)).tz(timeZone).subtract(6, 'hours').format('DD MMM YYYY HH:mm:ss [GMT]');
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
                        <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                        <TableCell style={kpi?.succ ? getCellStyle(kpi) : styles.tableCell}>{kpi?.succ || 'null'}</TableCell>
                        <TableCell style={styles.tableCell}>{ kpi?.avg || 'null' }</TableCell>
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
                kci?.kpi != 'RC_Value' && 
                <>
                    <TableRow key={'kci-data-'+index}>
                        <TableCell style={getCellStyle(kci)}>{kci?.kpi}</TableCell>
                        <TableCell style={getCellStyle(kci)}>{ removeDecimal(kci?.att) + ' / ' + removeDecimal(kci?.last_7_att)}</TableCell>
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
                        <TableCell style={styles.tableCellTransparent}>{`Location: ${node?.host_name}`}</TableCell>
                        <TableCell style={styles.tableCellCentered}>{filters.nodetype === "smsf" ? "Nrf Support" : "RC"}</TableCell>
                        <TableCell style={styles.tableCellCentered}>Nest Status</TableCell>
                        <TableCell style={styles.tableCellCentered}>SW Version</TableCell>
                        {filters.nodetype !== "smsf" && <TableCell style={styles.tableCellCentered}>Build</TableCell>}
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.tableCell}>{`KPI Interval: ${ showTime(Object.values(node?.stats)[0]?.time_value)}`}</TableCell>
                        <TableCell style={getRCStyle(node?.stats?.RC_Value?.att)}>{ node?.stats?.RC_Value?.att || 0}</TableCell>
                        <TableCell style={getNestStatusStyle(node?.nestStatus)}>{node?.nestStatus || 'NA'}</TableCell>
                        <TableCell style={styles.tableCellCentered}>{node?.stats?.releasenum?.sw_version}</TableCell>
                        {filters.nodetype !== "smsf" && <TableCell style={styles.tableCellCentered}>{ removeDecimal(node?.stats?.Build?.att)}</TableCell>}   
                        
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
                            <Table  style={styles.table}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell key={'kpi-header'+index} style={styles.tableCell}>{header}</TableCell>
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
                            <Table  style={styles.tableRight}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        <TableCell  style={styles.tableCellFixed}> 15 min KCI </TableCell>
                                        <TableCell  style={styles.tableCell}>Current/Average </TableCell>
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
                            <Table  style={styles.tableRight}>
                                <TableHead style={styles.tableHead}>
                                    <TableRow>
                                        <TableCell style={styles.tableCellFixed}> 15 min KEI </TableCell>
                                        <TableCell style={styles.tableCell}> <span style={{color: '#d6006e'}}>Current/Average </span>  </TableCell>
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
