import React, { useContext, useEffect, useState } from "react";
import { NodeContext } from "../NodeContext";
import { 
    Table, TableBody, TableCell, TableHead, TableRow, Paper, 
    Typography, Grid, Box, Checkbox, Select, MenuItem,
    FormControl, InputLabel, IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

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
    tableHeaderCell: {
        border: '1px solid #e0e0e0',
        padding: '8px 2px',
        color: 'white',
        fontSize: '12px',
        position: 'relative',
    },
    filterIcon: {
        color: 'white',
        fontSize: '16px',
        marginLeft: '4px',
        cursor: 'pointer',
        verticalAlign: 'middle'
    },
    filterContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 10,
        border: '1px solid #d6006e',
        width: '200px',
        padding: '8px',
        borderRadius: '4px',
        top: '100%',
        left: '0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    filterSelect: {
        width: '100%',
        backgroundColor: 'white',
        '& .MuiSelect-select': {
            padding: '8px'
        }
    },
    filterActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '8px'
    }
};

const Notifications = () => {
    const { allAlerts, alerts, setNotificationsFilter, notificationsFilter, filteredNotifications } = useContext(NodeContext);

    // State for which filter dropdown is open
    const [openFilter, setOpenFilter] = useState(null);
    
    // State for column filters
    const [columnFilters, setColumnFilters] = useState({
        currentState: 'All',
        previousState: 'All',
        node: 'All',
        kpiName: 'All',
        pool: 'All',
        status: 'All'
    });
    
    // State for filtered alerts
    const [filteredNewAlerts, setFilteredNewAlerts] = useState([]);
    const [filteredAllAlerts, setFilteredAllAlerts] = useState([]);
    
    // Extract unique values for each column to use in filter dropdowns
    const getUniqueFilterValues = (column) => {
        const allValues = new Set();
        
        // Map column names to actual alert properties
        const columnMapping = {
            'currentState': 'priority',
            'previousState': 'prevPriority',
            'node': 'host_name',
            'kpiName': 'kpi',
            'pool': 'pool',
            'status': 'isNew'
        };
        
        const property = columnMapping[column];
        
        if (property) {
            // Special handling for status column which is boolean
            if (property === 'isNew') {
                return ['All', 'New', 'Updated'];
            }
            
            // Add values from both alert arrays
            [...alerts, ...allAlerts].forEach(alert => {
                if (alert[property]) {
                    allValues.add(alert[property]);
                }
            });
        }
        
        return ['All', ...Array.from(allValues)];
    };
    
    // Function to toggle filter dropdown
    const toggleFilter = (column) => {
        if (openFilter === column) {
            setOpenFilter(null);
        } else {
            setOpenFilter(column);
        }
    };
    
    // Handle filter change
    const handleFilterChange = (column, value) => {
        setColumnFilters({
            ...columnFilters,
            [column]: value
        });
    };
    
    // Clear a specific filter
    const clearFilter = (column) => {
        setColumnFilters({
            ...columnFilters,
            [column]: 'All'
        });
    };
    
    // Apply filters to alert data
    useEffect(() => {
        // Get alerts already filtered by priority and time
        let newAlertsToFilter = notificationsFilter.priorities.length 
            ? filteredNotifications.alerts 
            : alerts;
            
        let allAlertsToFilter = notificationsFilter.priorities.length 
            ? filteredNotifications.allAlerts 
            : allAlerts;
        
        // Apply column filters
        Object.entries(columnFilters).forEach(([column, value]) => {
            if (value !== 'All') {
                const columnMapping = {
                    'currentState': 'priority',
                    'previousState': 'prevPriority',
                    'node': 'host_name',
                    'kpiName': 'kpi',
                    'pool': 'pool',
                    'status': 'isNew'
                };
                
                const property = columnMapping[column];
                
                if (property) {
                    // Special handling for status column
                    if (property === 'isNew') {
                        const isNew = value === 'New';
                        newAlertsToFilter = newAlertsToFilter.filter(alert => 
                            alert[property] === isNew
                        );
                        allAlertsToFilter = allAlertsToFilter.filter(alert => 
                            alert[property] === isNew
                        );
                    } else {
                        newAlertsToFilter = newAlertsToFilter.filter(alert => 
                            alert[property] === value
                        );
                        allAlertsToFilter = allAlertsToFilter.filter(alert => 
                            alert[property] === value
                        );
                    }
                }
            }
        });
        
        // Sort by timestamp (newest first)
        newAlertsToFilter = [...newAlertsToFilter].filter(alert => 
            alert.host_name.indexOf('NRF') === -1
        ).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        allAlertsToFilter = [...allAlertsToFilter].filter(alert => 
            alert.host_name.indexOf('NRF') === -1
        ).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setFilteredNewAlerts(newAlertsToFilter);
        setFilteredAllAlerts(allAlertsToFilter);
    }, [
        filteredNotifications,
        columnFilters,
        allAlerts, 
        alerts, 
        notificationsFilter
    ]);

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

    const handleFilterToggle = (value, inputType) => {
        if (inputType === "priorities") {
            // Check if the priority is already selected
            const index = notificationsFilter.priorities.indexOf(value);
            if (index !== -1) {
                // If selected, remove it
                const updatedPriorities = [...notificationsFilter.priorities];
                updatedPriorities.splice(index, 1);
                setNotificationsFilter({ ...notificationsFilter, priorities: updatedPriorities });
            } else {
                // If not selected, add it
                setNotificationsFilter({ ...notificationsFilter, priorities: [...notificationsFilter.priorities, value] });
            }
        } else if (inputType === "timeRange") {
            let timeRange = null;
            if (value.target.checked) {
                timeRange = "1hr"
            }
            setNotificationsFilter({
                ...notificationsFilter,
                timeRange: timeRange
            });
        }
    };

    // Render a table header cell with filter
    const renderFilterableHeader = (title, column) => (
        <TableCell style={styles.tableHeaderCell}>
            {title}
            <IconButton
                size="small"
                onClick={() => toggleFilter(column)}
                style={{ padding: '2px', marginLeft: '4px' }}
            >
                <FilterListIcon style={styles.filterIcon} />
            </IconButton>
            
            {openFilter === column && (
                <div style={styles.filterContainer} onClick={(e) => e.stopPropagation()}>
                    <FormControl fullWidth size="small">
                        <InputLabel id={`${column}-filter-label`}>Filter {title}</InputLabel>
                        <Select
                            labelId={`${column}-filter-label`}
                            value={columnFilters[column]}
                            label={`Filter ${title}`}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            style={styles.filterSelect}
                        >
                            {getUniqueFilterValues(column).map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={styles.filterActions}>
                        <IconButton
                            size="small"
                            onClick={() => clearFilter(column)}
                            style={{ padding: '2px' }}
                            title="Clear filter"
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </div>
                </div>
            )}
        </TableCell>
    );
    
    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenFilter(null);
        };
        
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h2" sx={{ py: 2 }}>Notifications</Typography>

            {/* Priority & Time Filters Section */}
            <Grid container gap={2} sx={{ marginBottom: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={notificationsFilter.priorities.includes('critical')}
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
                        checked={notificationsFilter.priorities.includes('major')}
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
                        checked={notificationsFilter.priorities.includes('minor')}
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
                        checked={notificationsFilter.priorities.includes('oor')}
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
                        checked={notificationsFilter.priorities.includes('normal')}
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
                        checked={notificationsFilter.timeRange != null}
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

            {/* New Alerts Table */}
            <Typography variant="h4" sx={{ py: 2 }}>New Alerts</Typography>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableHeaderCell}>Time</TableCell>
                        {renderFilterableHeader('Node', 'node')}
                        {renderFilterableHeader('Previous State', 'previousState')}
                        {renderFilterableHeader('Current State', 'currentState')}
                        {renderFilterableHeader('KPI/KCI/KEI Name', 'kpiName')}
                        {renderFilterableHeader('Pool', 'pool')}
                        <TableCell style={styles.tableHeaderCell}>Att/Succ %</TableCell>
                        {renderFilterableHeader('Status', 'status')}
                        <TableCell style={styles.tableHeaderCell}>Green</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Yellow</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Orange</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Red</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredNewAlerts.map((alert, index) => (
                        <TableRow key={index}>
                            <TableCell style={styles.tableCell}>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.host_name}</TableCell>
                            <TableCell style={getCellStyle(alert.prevPriority || alert.priority)}>{alert.prevPriority || alert.priority}</TableCell>
                            <TableCell style={getCellStyle(alert?.priority)}>{alert?.priority}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.kpi}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.pool ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.value}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.isNew ? 'New' : 'Updated'}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.green ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.yellow ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.orange ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.red ?? ''}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            {/* All Alerts Table */}
            <Typography variant="h4" sx={{ py: 2 }}>All Alerts</Typography>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableHeaderCell}>Time</TableCell>
                        {renderFilterableHeader('Node', 'node')}
                        {renderFilterableHeader('Previous State', 'previousState')}
                        {renderFilterableHeader('Current State', 'currentState')}
                        {renderFilterableHeader('KPI/KCI/KEI Name', 'kpiName')}
                        {renderFilterableHeader('Pool', 'pool')}
                        <TableCell style={styles.tableHeaderCell}>Att/Succ %</TableCell>
                        {renderFilterableHeader('Status', 'status')}
                        <TableCell style={styles.tableHeaderCell}>Green</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Yellow</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Orange</TableCell>
                        <TableCell style={styles.tableHeaderCell}>Red</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAllAlerts.map((alert, index) => (
                        <TableRow key={index}>
                            <TableCell style={styles.tableCell}>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.host_name}</TableCell>
                            <TableCell style={getCellStyle(alert.prevPriority || alert.priority)}>{alert.prevPriority || alert.priority}</TableCell>
                            <TableCell style={getCellStyle(alert?.priority)}>{alert?.priority}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.kpi}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.pool ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.value}</TableCell>
                            <TableCell style={styles.tableCell}>{alert?.isNew ? 'New' : 'Updated'}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.green ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.yellow ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.orange ?? ''}</TableCell>
                            <TableCell style={styles.tableCell}>{alert.red ?? ''}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default Notifications;
