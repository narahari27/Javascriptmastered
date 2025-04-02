import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Typography } from '@mui/material';
import moment from 'moment-timezone';

const ptTimeZone = 'America/Los_Angeles';

const styles = {
    table: {
        borderCollapse: 'collapse',
        border: '1px solid #e0e0e0',
        minWidth: 400,
    },
    tableHead: {
        backgroundColor: '#d6006e',
        color: '#fff'
    },
    tableCell: {
        border: '1px solid #e0e0e0',
        padding: '2px',
        color: 'inherit',
        fontSize: '12px',
    },
    tableCellColored: {
        border: '1px solid #e0e0e0',
        padding: '2px',
        backgroundColor: '#d6006e',
        color: 'white',
        fontSize: '12px',
    },
};

const KPIModalContent = React.memo(({ node, data }) => {
    const keys = Object.keys(data ?? {});
    // const tableHeaders = ['KPI', 'SR%', 'Avg%', 'Attempts', 'Avg Att', '15 Min KCI', 'Current/Average'];
    const tableHeaders = ['KPI', 'SR%', 'Avg%', 'Attempts'];

    const getColorPriority = (priority) => {
        switch (priority) {
            case 'critical':
                return '#ff0040';
            case 'major':
                return '#f2630a';
            case 'minor':
                return '#ffbf00';
            case 'oor':
                return '#0a58ca';
            case 'normal':
                return '#198754';

            default:
                return '#000';
        }
    }

    const getCellStyle = (data) => {
        return {
            border: '1px solid #e0e0e0',
            padding: '2px',
            color: getColorPriority(data?.priority),
            fontSize: '12px',
        };
    };

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
            return moment(new Date(date)).tz(ptTimeZone).subtract(5, 'hours').format('MM/DD/YYYY HH:mm');
        } else {
            return '';
        }
    }

    const getTableData = (kpis) => {
        return kpis?.sort(sort_by_id('thresholdId')).map((kpi, index) => {
            return (
                <>
                    <TableRow key={index}>
                        <TableCell style={getCellStyle(kpi)}>{kpi?.kpi}</TableCell>
                        <TableCell style={getCellStyle(kpi)}>{kpi?.kpi !== 'TAS_ACTIVE_REGISTRATIONS' && kpi?.rate && kpi?.rate != 'undefined' && kpi?.rate != 'null' ? kpi?.rate >= 100 ? 100 : kpi?.rate : ''}</TableCell>
                        <TableCell style={styles.tableCell}>{kpi?.kpi !== 'TAS_ACTIVE_REGISTRATIONS' &&  kpi?.avg && kpi?.avg != 'undefined' && kpi?.avg != 'null' ? kpi?.avg >= 100 ? 100 : kpi?.avg : ''}</TableCell>
                        <TableCell style={styles.tableCell}>{kpi?.att}</TableCell>
                    </TableRow>
                </>
            )
        })
    }

    function noteInfo(note) {
        let formattedName = note?.updated_by;
        const time = moment(note?.updated_at).tz(ptTimeZone).format('MM/DD/YYYY HH:mm');
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
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCell}>Node Name</TableCell>
                        <TableCell style={styles.tableCell}>Sync Time</TableCell>
                        <TableCell style={styles.tableCell}>Nest Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.tableCell}>{node?.host_name}</TableCell>
                        <TableCell style={styles.tableCell}>{showTime(Object.values(node?.stats)[0]?.time_value)}</TableCell>
                        <TableCell style={styles.tableCell}>{node?.nestStatus || 'NA'}</TableCell>
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
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                // flexWrap: 'wrap',
                // alignItems: 'center',
                // justifyContent: 'center',
            }}>
                {
                    data && (
                        Object.values(data).map((kpis, index) => {
                            return (
                                <Table key={index} style={styles.table}>
                                    <TableHead style={styles.tableHead}>
                                        <TableRow>
                                            {tableHeaders.map((header, index) => (
                                                <TableCell key={index} style={styles.tableCell}>{header}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getTableData(kpis)}
                                    </TableBody>
                                </Table>
                            )
                        })
                    )
                }
            </Box>
        </>
    );
});

export default KPIModalContent;
