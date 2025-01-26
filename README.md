import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Card, CardContent, Typography, Grid, Popover, Table, TableHead, TableBody, TableRow, TableCell, Box, Modal, IconButton, TextField, Button } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import CloseIcon from '@mui/icons-material/Close';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Market from './Market';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment-timezone';

const timeZone = 'UTC';

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

const Region2 = ({ region, nodes, nest }) => {
    const { stats, priorityData } = useSelector((state) => state.nodes);
    const [expanded, setExpanded] = useState(false);
    const [showRegion, setShowRegion] = useState(false);
    const [expandContainer, setExpandContainer] = useState(false);

    //Chart & Health
    const currentDate = moment().tz(timeZone);
    const [openChart, setOpenChart] = useState(false);
    const [health, setHealth] = useState({
        health: 'normal',
        nodes: 0,
        criticals: 0,
        major: 0,
        oor: 0,
        normal: 0,
        backgroundColor: '#198754'
    });

    const [healthEl, setHealthEl] = React.useState(null);
    const [chartFilters, setChartFilters] = React.useState({ startDateTime: moment.tz(timeZone).subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'), endDateTime: currentDate.format('YYYY-MM-DDTHH:mm:ss') });
    const [from, setFrom] = useState(moment(chartFilters.startDateTime).valueOf());
    const [to, setTo] = useState(moment(chartFilters.endDateTime).valueOf());

    const handleHealthPopoverOpen = (event) => {
        setHealthEl(event.currentTarget);
    };

    const handleHealthPopoverClose = () => {
        setHealthEl(null);
    };

    const healthOpen = Boolean(healthEl);

    const getPoolHealth = () => {
        const markets = Object.keys(nodes);
        const mprio = markets.map(_ => priorityData[_]).filter(_ => _)
        const racks = markets.reduce((acc, curr) => {
            const temp = acc
            acc = [...temp, ...Object.keys(nodes[curr])]
            return acc
        }, [])
        const rprio = racks.map(_ => priorityData[_]).filter(_ => _)
        const _nodes = []

        markets.forEach((market) => {
            racks.forEach((rack) => {
                if (nodes[market][rack] && nodes[market][rack].length) {
                    nodes[market][rack].forEach(_ => {
                        if (_.host_name)
                            _nodes.push(_.host_name)
                    })
                }
            })
        })

        const nprio = _nodes.map(_ => priorityData[_]).filter(_ => _)

        const total = mprio.length + rprio.length + nprio.length;
        const criticals = mprio.filter(_ => _ === 'critical')?.length + rprio.filter(_ => _ === 'critical')?.length + nprio.filter(_ => _ === 'critical')?.length;
        const major = mprio.filter(_ => _ === 'major')?.length + rprio.filter(_ => _ === 'major')?.length + nprio.filter(_ => _ === 'major')?.length;
        const minor = mprio.filter(_ => _ === 'minor')?.length + rprio.filter(_ => _ === 'minor')?.length + nprio.filter(_ => _ === 'minor')?.length;
        const normal = mprio.filter(_ => _ === 'normal')?.length + rprio.filter(_ => _ === 'normal')?.length + nprio.filter(_ => _ === 'normal')?.length;
        const oor = mprio.filter(_ => _ === 'oor')?.length + rprio.filter(_ => _ === 'oor')?.length + nprio.filter(_ => _ === 'oor')?.length;
        let health = 'normal';
        let background = '#198754';

        if (criticals || major || minor) {
            const cpr = Math.round((criticals / total) * 100);
            const mpr = Math.round((major / total) * 100);
            const mipr = Math.round((minor / total) * 100);
            const ovr = Math.round(((criticals + major) / total) * 100);

            ; if (cpr >= 20) {
                health = 'critical';
                background = '#ff0040';
            } else if (mpr >= 20) {
                health = 'major';
                background = '#f2630a';
            } else if (mipr >= 20) {
                health = 'minor';
                background = '#ffc33f';
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
            minor,
            oor,
            normal,
            background
        });
    }

    const getHealthColor = () => {
        if (health?.health === 'normal') {
            if (health?.criticals > 0) {
                return '#ff0040';
            } else if (health?.major > 0) {
                return '#f2630a';
            } else if (health?.minor > 0) {
                return '#ffc33f';
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

    useEffect(() => {
        if (Object.keys(priorityData)?.length > 0)
            getPoolHealth();
    }, [priorityData]);


    const containerStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: expandContainer ? '75%' : '25%',
        transition: 'width 0.3s',
    };

    useEffect(() => {
        if (expanded) {
            setShowRegion(false);
        } else {
            setShowRegion(true);
        }
    }, [expanded])

    const getColorPriority = () => {
        if (stats) {
            const markets = Object.keys(nodes);
            let _nodes = [];

            markets.forEach(mar => {
                if (stats[mar]?.length > 0)
                    _nodes = [...stats[mar]];
            })
            const pr = _nodes?.map(node => node.priority)
            const priority = [...new Set(pr)];
            if (priority.length > 0) {
                if (priority.indexOf('critical') !== -1) {
                    return '#ff0040';
                } else if (priority.indexOf('major') !== -1) {
                    return '#f2630a';
                } else if (priority.indexOf('minor') !== -1) {
                    return '#ffc33f';
                } else if (priority.indexOf('normal') !== -1) {
                    return '#198754';
                } else if (priority.indexOf('oor') !== -1) {
                    return '#198754';
                } else {
                    return 'darkgray';
                }
            }
        }

        return 'rgb(128, 128, 128)';
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
                                backgroundColor: health.background || 'rgb(128, 128, 128)',
                                color: 'white',
                            }}
                            onClick={(e) => {
                                setExpanded(!expanded)
                            }}
                        >
                            <CardContent style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography sx={{ width: 'auto', display: 'inline-block' }} variant="h6">{region}</Typography>
                                <Box>
                                    <SsidChartIcon style={{ marginRight: '8px' }} onClick={() => setOpenChart(true)} />
                                    <MonitorHeartIcon aria-owns={healthOpen ? 'health-popover' : undefined}
                                        aria-haspopup="true" onMouseEnter={handleHealthPopoverOpen}
                                        onMouseLeave={handleHealthPopoverClose} style={{
                                            color: getHealthColor()
                                        }} />
                                </Box>
                            </CardContent>
                        </Card>
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
                                                    Markets/Racks/Nodes
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
                                                    Minor
                                                </TableCell>
                                                <TableCell>
                                                    {health?.minor}
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
                                    <Card
                                        style={{
                                            border: '2px solid black',
                                            margin: '4px',
                                            backgroundColor: 'lightgray',
                                            color: 'black',
                                            width: '32.4%',
                                            maxHeight: 72
                                        }}
                                        onClick={(e) => {
                                            setExpanded(!expanded)
                                            setExpandContainer(false)
                                        }}
                                    >
                                        <CardContent style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography sx={{ width: 'auto', display: 'inline-block', fontSize: '1rem' }} variant="h6"><IconButton><ArrowBackIcon style={{ marginRight: '8px' }} /></IconButton>{region}</Typography>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            {<>
                                {Object.keys(nodes)
                                    .sort()
                                    .map((market, index) => (
                                        <Market
                                            key={index}
                                            market={market}
                                            nodes={nodes[market]}
                                            setExpandContainer={setExpandContainer}
                                            stats={stats}
                                            nest={nest}
                                        />
                                    ))}
                            </>}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#d6006e' }}>
                        <Typography id="chart-modal-filters" variant="h6" component="h4">
                            Filters
                        </Typography>
                        <IconButton sx={{ color: '#d6006e' }} onClick={() => { setOpenChart(false); }}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, marginY: 2 }}>
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
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/ZB5uWsLMk/national-heatmap?orgId=1&var-measurement=mme&var-poolname=${region}&from=${from}&to=${to}&theme=light&panelId=48`}
                                width="100%"
                                height="350"
                                frameborder="0">
                            </iframe>
                            <iframe
                                src={`https://grafana.tools.nsds.t-mobile.com/d-solo/ZB5uWsLMk/national-heatmap?orgId=1&var-measurement=mme&var-poolname=${region}&from=${from}&to=${to}&theme=light&panelId=831`}
                                width="100%"
                                height="350"
                                frameborder="0">
                            </iframe>
                        </Box>
                    }
                </Box>
            </Modal>
        </div>
    );
};

export default Region2;
