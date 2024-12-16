import React, { useContext, useEffect, useState } from "react";
import { NodeContext } from "../NodeContext";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Grid, Box, Checkbox, Radio } from '@mui/material';

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
};

const Notifications = () => {
    const { allAlerts, alerts, setNotificationsFilter, notificationsFilter, filteredNotifications } = useContext(NodeContext);

    const getColorPriority = (priority) => {
        switch (priority) {
            case 'critical':
                return '#ff0040';
            case 'major':
                return '#f2630a';
            case 'minor':
                return '#ffc33f';
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
            color: getColorPriority(data),
            fontSize: '12px',
        };
    };

    const [selectedFilters, setSelectedFilters] = useState(notificationsFilter);

    useEffect(() => {
        // Check if selectedFilters have changed
        if (JSON.stringify(selectedFilters) !== JSON.stringify(notificationsFilter)) {
            setNotificationsFilter(selectedFilters);
        }
    }, [selectedFilters, notificationsFilter, setNotificationsFilter])

    const handleFilterToggle = (value, inputType) => {
        if(inputType === "priorities"){
            // Check if the priority is already selected
            const index = selectedFilters.priorities.indexOf(value);
            if (index !== -1) {
                // If selected, remove it
                const updatedPriorities = [...selectedFilters.priorities];
                updatedPriorities.splice(index, 1);
                setSelectedFilters({ ...selectedFilters, priorities: updatedPriorities });
            } else {
                // If not selected, add it
                setSelectedFilters({ ...selectedFilters, priorities: [...selectedFilters.priorities, value] });
            }
        }else if(inputType === "timeRange"){
            let timeRange = null;
            if(value.target.checked){
                timeRange = "1hr"
            }
            setSelectedFilters({
                ...selectedFilters,
                timeRange: timeRange
            });
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h2" sx={{ py: 2 }}>Notifications</Typography>

            <Grid container gap={2} sx={{ marginBottom: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.priorities.includes('critical')}
                        onChange={(e) => handleFilterToggle('critical', 'priorities')}
                        sx={{
                            '& .MuiSvgIcon-root': {
                                color: '#ff0040',
                            },
                            '&.Mui-checked .MuiIconButton-root': {
                                backgroundColor: '#ff0040',
                            },
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        Critical
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.priorities.includes('major')}
                        onChange={(e) => handleFilterToggle('major', 'priorities')}
                        sx={{
                            color: '#f2630a',
                            '&.Mui-checked': {
                                color: '#f2630a',
                            }
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        Major
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.priorities.includes('minor')}
                        onChange={(e) => handleFilterToggle('minor', 'priorities')}
                        sx={{
                            color: '#ffc33f',
                            '&.Mui-checked': {
                                color: '#ffc33f',
                            }
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        Minor
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.priorities.includes('oor')}
                        onChange={(e) => handleFilterToggle('oor', 'priorities')}
                        sx={{
                            color: '#0a58ca',
                            '&.Mui-checked': {
                                color: '#0a58ca',
                            }
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        OOR
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.priorities.includes('normal')}
                        onChange={(e) => handleFilterToggle('normal', 'priorities')}
                        sx={{
                            color: '#198754',
                            '&.Mui-checked': {
                                color: '#198754',
                            }
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        Normal
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedFilters.timeRange != null}
                        onChange={(e) => handleFilterToggle(e, 'timeRange')}
                        sx={{
                            color: ' #7A687F',
                            '&.Mui-checked': {
                                color: '#7A687F',
                            }
                        }}
                    />
                    <Typography sx={{ marginLeft: '4px' }} variant="body">
                        Last Hour from Login
                    </Typography>
                </Box> 
            </Grid>
            <Typography variant="h4" sx={{ py: 2 }}>New Alerts</Typography>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCell}>Time</TableCell>
                        <TableCell style={styles.tableCell}>Node</TableCell>
                        <TableCell style={styles.tableCell}>Previous State</TableCell>
                        <TableCell style={styles.tableCell}>Current State</TableCell>
                        <TableCell style={styles.tableCell}>KPI/KCI/KEI Name</TableCell>
                        <TableCell style={styles.tableCell}>Att/Succ %</TableCell>
                        <TableCell style={styles.tableCell}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(notificationsFilter.priorities.length ? filteredNotifications.alerts : alerts)
                    .sort(function (a, b) {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    }).map((alert, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell style={styles.tableCell}>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                                <TableCell style={styles.tableCell}>{alert?.host_name}</TableCell>
                                <TableCell style={getCellStyle(alert?.prevPriority)}>{alert?.prevPriority}</TableCell>
                                <TableCell style={getCellStyle(alert?.priority)}>{alert?.priority}</TableCell>
                                <TableCell style={styles.tableCell}>{alert?.kpi}</TableCell>
                                <TableCell style={styles.tableCell}>{alert?.value}</TableCell>
                                <TableCell style={styles.tableCell}>{alert?.isNew ? 'New' : 'Updated'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <Typography variant="h4" sx={{ py: 2 }}>All Alerts</Typography>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCell}>Time</TableCell>
                        <TableCell style={styles.tableCell}>Node</TableCell>
                        <TableCell style={styles.tableCell}>Previous State</TableCell>
                        <TableCell style={styles.tableCell}>Current State</TableCell>
                        <TableCell style={styles.tableCell}>KPI/KCI/KEI Name</TableCell>
                        <TableCell style={styles.tableCell}>Att/Succ %</TableCell>
                        <TableCell style={styles.tableCell}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(notificationsFilter.priorities.length ? filteredNotifications.allAlerts : allAlerts).sort(function (a, b) {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    }).map((alert, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell style={styles.tableCell}>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                                <TableCell style={styles.tableCell}>{alert.host_name}</TableCell>
                                <TableCell style={getCellStyle(alert.prevPriority)}>{alert.prevPriority}</TableCell>
                                <TableCell style={getCellStyle(alert.priority)}>{alert.priority}</TableCell>
                                <TableCell style={styles.tableCell}>{alert.kpi ?? ''}</TableCell>
                                <TableCell style={styles.tableCell}>{alert.value ?? ''}</TableCell>
                                <TableCell style={styles.tableCell}>{alert.isNew ? 'New' : 'Updated'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default Notifications;
