import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Popover, IconButton } from '@mui/material';
import KPIModalContent2 from './KPIModalContent2';
import Rack from './Rack';
import Node2 from './Node2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const timeZone = 'UTC';

const Market = React.memo(({ market, nodes, setExpandContainer, stats, nest }) => {
    const [expanded, setExpanded] = useState(false);
    const [showMarket, setShowMarket] = useState(false);
    const [expandMarketContainer, setExpandMarketContainer] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mouseIsOver, setMouseIsOver] = useState(false);

    const containerStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: expandMarketContainer ? '100%' : 'auto',
        transition: 'width 0.3s',
        minWidth: '32.85%'
    };

    useEffect(() => {
        if (expanded) {
            setShowMarket(false);
            setExpandContainer(true);
            setExpandMarketContainer(true);
        } else {
            setShowMarket(true);
            setExpandContainer(false);
            setExpandMarketContainer(false);
        }
    }, [expanded])

    const handlePopoverOpen = (event) => {
        const target = event.currentTarget;
        setAnchorEl(target);
    };

    const handlePopoverClose = () => {
        setTimeout(() => {
            if (!mouseIsOver) {
                setAnchorEl(null);
            }
        })
    };

    const handleMouseEnterPopover = () => {
        setMouseIsOver(true);
    };

    const handleMouseLeavePopover = () => {
        setMouseIsOver(false);
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getColorPriority = () => {
        if (stats[market] && stats[market].length) {
            const pr = stats[market].map(_ => _.priority)
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

    const mapData = () => {

        return (<>
            {
                Object.keys(nodes)?.map((rack, index) => {
                    if (rack === 'SMFRACK') {
                        return (nodes[rack]?.map((node, index) => (
                            <Node2 style={{
                                minWidth: '32.45%',
                                minHeight: 72,
                                margin: '4px',
                                border: '1px solid black',
                                borderRadius: '6px'

                            }} key={index} node={node} stats={stats} variation={'h6'} nest={nest} />
                        )))
                    } else {
                        return (
                            <Rack
                                key={index}
                                rack={rack}
                                nodes={nodes[rack]}
                                setExpandMarketContainer={setExpandMarketContainer}
                                stats={stats}
                                nest={nest}
                            />
                        )
                    }
                })
            }
        </>)
    }

    return (
        <div style={containerStyle}>
            {
                showMarket && (
                    <>
                        <Card
                            style={{
                                border: '2px solid black',
                                margin: '4px',
                                backgroundColor: getColorPriority(),
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
                                <Typography 
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose} aria-owns={open ? 'mouse-over-marketpopover' : undefined}
                                    aria-haspopup="true" 
                                    sx={{ width: 'auto', display: 'inline-block' }} variant="h6">{`MKT::${market}`}</Typography>
                            </CardContent>

                            <Popover
                                id="mouse-over-marketpopover"
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus

                            >
                                <Card onMouseEnter={handleMouseEnterPopover}
                                    onMouseLeave={handleMouseLeavePopover}
                                >
                                    <CardContent style={{ backgroundColor: '#bfab5b',padding:'8px' }}
                                    >
                                        {
                                            stats[market] && (
                                                <KPIModalContent2 node={market} data={stats[market]} nest={nest} hideNest={true} />
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            </Popover>
                        </Card>
                    </>

                )
            }
            {expanded && (
                <Card style={{
                    border: '2px solid black',
                    margin: '4px',
                    backgroundColor: expanded ? '#f2d8d8' : 'none',
                }}>
                    <CardContent>
                        <Grid container spacing={1}>
                            {
                                !showMarket && (
                                    <Card
                                        style={{
                                            border: '2px solid black',
                                            margin: '4px',
                                            backgroundColor: 'lightgray',
                                            color: 'black',
                                            width: '32.4%',
                                            maxHeight: 76
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
                                            <Typography sx={{ width: 'auto', display: 'inline-block', fontSize: '1rem' }} variant="h6"><IconButton><ArrowBackIcon style={{ marginRight: '8px' }} /></IconButton>{market}</Typography>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            {mapData()}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </div>
    );
});

export default Market;
