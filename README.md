import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid, Popover, Table, TableHead, TableBody, TableRow, TableCell, Box, Modal, IconButton, TextField, Button } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CloseIcon from '@mui/icons-material/Close';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Node from './Node';
import sort_by from '../utils';
import moment from 'moment-timezone';

const ptTimeZone = 'America/Los_Angeles';

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

const Region = ({ region, nodes }) => {
    const currentDate = moment().tz(ptTimeZone);
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
    const [chartFilters, setChartFilters] = React.useState({startDateTime: moment.tz(ptTimeZone).subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'), endDateTime:  currentDate.format('YYYY-MM-DDTHH:mm:ss')});
    const [from, setFrom] = useState(moment(chartFilters.startDateTime).valueOf());
    const [to, setTo] = useState(moment(chartFilters.endDateTime).valueOf());

    const handlePopoverOpen = (event) => {
        if (nodes.filter(_ => _.priority && _.priority !== 'normal' && _.priority !== 'oor').length === 0) {
            return
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
    }, [expanded])

    const getPoolHealth = () => {
        const pr = nodes.map(node => node.priority);
        const total = nodes.length;
        const criticals = pr.filter(_ => _ === 'critical')?.length;
        const major = pr.filter(_ => _ === 'major')?.length;
        const oor = pr.filter(_ => _ === 'oor')?.length;
        const normal = pr.filter(_ => _ === 'normal')?.length;
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
    }

    useEffect(() => {
        getPoolHealth();
    }, [nodes]);

    const getColorPriority = () => {
        const pr = nodes.map(node => node.priority)
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
    }

    const getHealthColor = () => {
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
    }

    const handleChartFilterChange = (event, key) => {
        setChartFilters({
            ...chartFilters,
            [key]: moment(event.target.value).format('YYYY-MM-DDTHH:mm:ss')
        });
    }

    const updateGrafana = () => {
        setFrom(moment(chartFilters.startDateTime).valueOf());
        setTo(moment(chartFilters.endDateTime).valueOf());
    }

    return (
        <div style={containerStyle}>
            {
                showRegion && (
                    <>
                        <Card
                            style={{
                                border: '2px solid black',
                                margin: '4px',
                                backgroundColor: health?.background || getColorPriority(),
                                color: 'white',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(null);
                                setExpanded(!expanded)
                            }}
                        >
                            <CardContent style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography sx={{ width: 'auto', display: 'inline-block' }} aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose} variant="h6">{region}</Typography>
                                <Box>
                                    <SsidChartIcon style={{marginRight: '8px'}} onClick={() => setOpenChart(true)} />
                                    <MonitorHeartIcon aria-owns={healthOpen ? 'health-popover' : undefined}
                                        aria-haspopup="true" onMouseEnter={handleHealthPopoverOpen}
                                        onMouseLeave={handleHealthPopoverClose} style={{
                                            color: getHealthColor()
                                        }} />
                                </Box>
                            </CardContent>
                        </Card>
                        <Popover
                            id="mouse-over-popover"
                            sx={{
                                pointerEvents: 'none'
                            }}
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
                                        {nodes.filter(_ => _.priority && _.priority !== 'normal' && _.priority !== 'oor').map(node => (
                                            <Node style={{
                                                minWidth: '32.85%', minHeight: 60,
                                                border: '1px solid black',
                                                borderRadius: 0,
                                                margin: '1px',
                                            }} key={node.host_name} node={node} />
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Popover>
                        <Popover
                            id="health-popover"
                            sx={{
                                pointerEvents: 'none'
                            }}
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
                                    <Typography sx={{ width: 'auto', display: 'inline-block', textAlign: 'center' }} variant="h6">Pool Stats</Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Nodes
                                                </TableCell>
                                                <TableCell>
                                                    Count
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    Critical
                                                </TableCell>
                                                <TableCell>
                                                    {health?.criticals}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Major
                                                </TableCell>
                                                <TableCell>
                                                    {health?.major}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    OOR
                                                </TableCell>
                                                <TableCell>
                                                    {health?.oor}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Normal
                                                </TableCell>
                                                <TableCell>
                                                    {health?.normal}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Popover>
                    </>

                )
            }
            {expanded && (
                <Card style={{
                    border: '2px solid black',
                    margin: '4px'
                }}>
                    <CardContent>
                        <Grid container spacing={1}>
                            {
                                !showRegion && (
                                    <Node
                                        style={{
                                        backgroundColor: 'lightgray', minWidth: '32.85%', minHeight: 35,
                                        border: '1px solid black',
                                        borderRadius: 0,
                                        margin: '1px'
                                    }} key={region} node={{ host_name: region }} color={'black'} bgcolor={'lightgray'} onClick={() => setExpanded(!expanded)} enableContextMenu={false} />
                                )
                            }
                            {nodes?.sort(sort_by('host_name', false, (a) => a.toUpperCase()))?.map(node => (
                                <Node style={{
                                    minWidth: '32.85%', minHeight: 35,
                                    border: '1px solid black',
                                    borderRadius: 0,
                                    margin: '1px'
                                }} key={node.host_name} node={node} />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            <Modal
                open={openChart}
                onClose={() => { setOpenChart(false); }}
                aria-labelledby="chart-modal-title"
                aria-describedby="chart-modal-description"
            >
                <Box sx={modal}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', color: '#d6006e'}}>
                        <Typography id="chart-modal-filters" variant="h6" component="h4">
                            Filters
                        </Typography>
                        <IconButton sx={{ color: '#d6006e' }} onClick={() => { setOpenChart(false); }}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, marginY: 2}}>
                        <TextField
                            variant="outlined"
                            label="Start Date Time"
                            type="datetime-local"
                            value={chartFilters.startDateTime ? moment(chartFilters.startDateTime).format('YYYY-MM-DDTHH:mm:ss') : ''}
                            onChange={(event) => handleChartFilterChange(event, 'startDateTime')}
                        />
                        <TextField
                            variant="outlined"
                            label="End Date Time"
                            type="datetime-local"
                            value={chartFilters.endDateTime ? moment(chartFilters.endDateTime).format('YYYY-MM-DDTHH:mm:ss') : ''}
                            onChange={(event) => handleChartFilterChange(event, 'endDateTime')}
                        />
                        <Button variant="contained" color="primary" onClick={updateGrafana}>Update Chart</Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#d6006e' }}>
                        <Typography id="chart-modal-title" variant="h6" component="h2">
                            {region} - Pool Chart
                        </Typography>
                    </Box>
                    {from && to &&
                        <Box>
                            <iframe src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-TAS_POOL=${region}&from=${from}&to=${to}&panelId=2&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-CSCF_POOL=${region}&from=${from}&to=${to}&panelId=4&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-BGCF_POOL=${region}&from=${from}&to=${to}&panelId=6&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-CATF_POOL=${region}&from=${from}&to=${to}&panelId=8&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-VSS_POOL=${region}&from=${from}&to=${to}&panelId=10&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-SBI_POOL=${region}&from=${from}&to=${to}&panelId=12&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-CSBG_POOL=${region}&from=${from}&to=${to}&panelId=14&theme=light`}
                                style={{ width: '100%', height: '275px', border: 'none' }}
                                frameBorder="0"
                            ></iframe>
                        </Box>
                    }
                </Box>
            </Modal>
        </div>
    );
};

export default Region;
