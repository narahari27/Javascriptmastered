import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Popover, Table, TableHead, TableBody, TableRow, TableCell, Box, Modal, IconButton, TextField, Button } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CloseIcon from '@mui/icons-material/Close';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Node from './Node';

// Updated component for Data Center (formerly Region)
const Region = ({ region, nodes }) => {
    const [openChart, setOpenChart] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [showRegion, setShowRegion] = useState(false);
    const [health, setHealth] = useState({
        health: 'normal',
        nodes: 0,
        criticals: 0,
        major: 0,
        oor: 0,
        normal: 0,
        backgroundColor: '#198754'
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [healthEl, setHealthEl] = React.useState(null);
    
    // Define a safe version of nodes
    const safeNodes = Array.isArray(nodes) ? nodes : [];

    const handlePopoverOpen = (event) => {
        // Only show popover if there are critical or major nodes
        if (safeNodes.filter(_ => _.priority && _.priority !== 'normal' && _.priority !== 'oor').length === 0) {
            return;
        }
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const handleHealthPopoverOpen = (event) => {
        setHealthEl(event.currentTarget);
    };

    const handleHealthPopoverClose = () => {
        setHealthEl(null);
    };

    const healthOpen = Boolean(healthEl);

    const containerStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '25%',
        transition: 'width 0.3s',
    };

    useEffect(() => {
        if (expanded) {
            setShowRegion(false);
        } else {
            setShowRegion(true);
        }
    }, [expanded]);

    const getPoolHealth = () => {
        try {
            const pr = safeNodes.map(node => node.priority || 'normal');
            const total = safeNodes.length;
            const criticals = pr.filter(_ => _ === 'critical')?.length || 0;
            const major = pr.filter(_ => _ === 'major')?.length || 0;
            const oor = pr.filter(_ => _ === 'oor')?.length || 0;
            const normal = pr.filter(_ => _ === 'normal')?.length || 0;
            let health = 'normal';
            let background = '#198754';

            if (criticals || major) {
                const cpr = Math.round((criticals / total) * 100);
                const mpr = Math.round((major / total) * 100);
                const ovr = Math.round(((criticals + major) / total) * 100);

                if (cpr >= 20) {
                    health = 'critical';
                    background = '#ff0040';
                } else if (mpr >= 20) {
                    health = 'major';
                    background = '#f2630a';
                } else if (ovr >= 20) {
                    health = 'critical';
                    background = '#ff0040';
                }
            }

            setHealth({
                health,
                nodes: total,
                criticals,
                major,
                oor,
                normal,
                background
            });
        } catch (error) {
            console.error("Error calculating health:", error);
            // Set default health if error occurs
            setHealth({
                health: 'normal',
                nodes: safeNodes.length,
                criticals: 0,
                major: 0,
                oor: 0,
                normal: safeNodes.length,
                background: '#198754'
            });
        }
    };

    useEffect(() => {
        getPoolHealth();
    }, [nodes]);

    const getColorPriority = () => {
        try {
            const pr = safeNodes.map(node => node.priority || 'normal');
            const priority = [...new Set(pr)];
            if (priority.length > 0) {
                if (priority.indexOf('critical') !== -1) {
                    return '#ff0040';
                } else if (priority.indexOf('major') !== -1) {
                    return '#f2630a';
                } else if (priority.indexOf('minor') !== -1) {
                    return '#ffbf00';
                } else if (priority.indexOf('normal') !== -1) {
                    return '#198754';
                } else if (priority.indexOf('oor') !== -1) {
                    return '#198754';
                } else {
                    return 'darkgray';
                }
            } else {
                return 'rgb(128, 128, 128)';
            }
        } catch (error) {
            console.error("Error getting color priority:", error);
            return 'rgb(128, 128, 128)';
        }
    };

    const getHealthColor = () => {
        try {
            if (health?.health === 'normal') {
                if (health?.criticals > 0) {
                    return '#ff0040';
                } else if (health?.major > 0) {
                    return '#f2630a';
                } else {
                    return 'white';
                }
            } else {
                return 'white';
            }
        } catch (error) {
            console.error("Error getting health color:", error);
            return 'white';
        }
    };

    const modal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        padding: 4,
        width: '75%',
        maxHeight: '85vh', 
        overflowY: 'auto',
    };

    return (
        <div style={containerStyle}>
            {showRegion && (
                <>
                    <Card
                        style={{
                            border: '2px solid black',
                            margin: '4px',
                            backgroundColor: health?.background || getColorPriority(),
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            setExpanded(!expanded);
                        }}
                    >
                        <CardContent style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography 
                                sx={{ width: 'auto', display: 'inline-block' }}
                                aria-owns={open ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose} 
                                variant="h6"
                            >
                                {region}
                            </Typography>
                            <Box>
                                <SsidChartIcon 
                                    style={{marginRight: '8px', cursor: 'pointer'}} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenChart(true);
                                    }} 
                                />
                                <MonitorHeartIcon 
                                    aria-owns={healthOpen ? 'health-popover' : undefined}
                                    aria-haspopup="true" 
                                    onMouseEnter={handleHealthPopoverOpen}
                                    onMouseLeave={handleHealthPopoverClose} 
                                    style={{color: getHealthColor()}} 
                                />
                            </Box>
                        </CardContent>
                    </Card>
                    
                    {/* Popover for degraded nodes */}
                    <Popover
                        id="mouse-over-popover"
                        sx={{pointerEvents: 'none'}}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        <Card>
                            <CardContent>
                                <Grid container>
                                    {safeNodes
                                        .filter(_ => _.priority && _.priority !== 'normal' && _.priority !== 'oor')
                                        .map(node => (
                                            <Node 
                                                style={{
                                                    minWidth: '32.85%', 
                                                    minHeight: 60,
                                                    border: '1px solid black',
                                                    borderRadius: 0,
                                                    margin: '1px',
                                                }} 
                                                key={node.host_name || 'unknown'} 
                                                node={node} 
                                            />
                                        ))
                                    }
                                </Grid>
                            </CardContent>
                        </Card>
                    </Popover>
                    
                    {/* Health stats popover */}
                    <Popover
                        id="health-popover"
                        sx={{pointerEvents: 'none'}}
                        open={healthOpen}
                        anchorEl={healthEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handleHealthPopoverClose}
                        disableRestoreFocus
                    >
                        <Card>
                            <CardContent style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <Typography sx={{ width: 'auto', display: 'inline-block', textAlign: 'center' }} variant="h6">
                                    Data Center Stats
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nodes</TableCell>
                                            <TableCell>Count</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Critical</TableCell>
                                            <TableCell>{health?.criticals}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Major</TableCell>
                                            <TableCell>{health?.major}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>OOR</TableCell>
                                            <TableCell>{health?.oor}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Normal</TableCell>
                                            <TableCell>{health?.normal}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Popover>
                </>
            )}
            
            {/* Expanded view showing all nodes */}
            {expanded && (
                <Card style={{
                    border: '2px solid black',
                    margin: '4px'
                }}>
                    <CardContent>
                        <Grid container spacing={1}>
                            {!showRegion && (
                                <Node
                                    style={{
                                        backgroundColor: 'lightgray', 
                                        minWidth: '32.85%', 
                                        minHeight: 35,
                                        border: '1px solid black',
                                        borderRadius: 0,
                                        margin: '1px'
                                    }} 
                                    key={region} 
                                    node={{ host_name: region }} 
                                    color={'black'} 
                                    bgcolor={'lightgray'} 
                                    onClick={() => setExpanded(!expanded)} 
                                    enableContextMenu={false} 
                                />
                            )}
                            {safeNodes.map(node => (
                                <Node 
                                    style={{
                                        minWidth: '32.85%', 
                                        minHeight: 35,
                                        border: '1px solid black',
                                        borderRadius: 0,
                                        margin: '1px'
                                    }} 
                                    key={node.host_name || `node-${Math.random()}`} 
                                    node={node} 
                                />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Charts modal */}
            <Modal
                open={openChart}
                onClose={() => { setOpenChart(false); }}
                aria-labelledby="chart-modal-title"
                aria-describedby="chart-modal-description"
            >
                <Box sx={modal}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', color: '#d6006e'}}>
                        <Typography id="chart-modal-title" variant="h6" component="h2">
                            {region} - Platform Performance
                        </Typography>
                        <IconButton sx={{ color: '#d6006e' }} onClick={() => { setOpenChart(false); }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    
                    {/* Placeholder charts */}
                    <Box sx={{ mt: 4 }}>
                        {['SONY', 'ZEE', 'STAR', 'KNITE'].map((platform, index) => (
                            <Box 
                                key={platform}
                                sx={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    mb: 2, 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <Typography variant="h6" color="#d6006e">
                                    {platform} Performance Dashboard for {region}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Region;
