import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Popover } from '@mui/material';
import KPIModalContent2 from './KPIModalContent2';
import Node2 from './Node2';

const timeZone = 'UTC';

const Rack = React.memo(({ rack, nodes, setExpandMarketContainer, stats, nest }) => {
    const [expanded, setExpanded] = useState(false);
    const [showRack, setShowRack] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mouseIsOver, setMouseIsOver] = useState(false);

    const containerStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
        width: 'auto',
        transition: 'width 0.3s',
        minWidth: '32.85%'
    };

    useEffect(() => {
        if (expanded) {
            setShowRack(false);
            setExpandMarketContainer(true);
        } else {
            setShowRack(true);
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
        if (stats[rack] && stats[rack].length) {
            const pr = stats[rack].map(_ => _.priority)
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
                showRack && (
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
                                    onMouseLeave={handlePopoverClose} aria-owns={open ? 'mouse-over-rackpopover' : undefined}
                                    aria-haspopup="true" 
                                    sx={{ width: 'auto', display: 'inline-block' }} variant="h6">{`RCK::${rack}`}</Typography>
                            </CardContent>

                            <Popover
                                id="mouse-over-rackpopover"
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
                                            stats[rack] && (
                                                <KPIModalContent2 node={rack} data={stats[rack]} nest={nest} hideNest={true}/>
                                            )
                                        }
                                        {
                                            !stats[rack] && (
                                                <Typography variant="h6" sx={{ color: '#d6006e' }}>No Data</Typography>
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
                    backgroundColor: expanded ? '#e3edd3' : 'none'
                }}>
                    <CardContent>
                        <Grid container spacing={1}>
                            {
                                !showRack && (
                                    <Node2
                                        style={{
                                            backgroundColor: 'lightgray', minWidth: '32.85%', minHeight: 35,
                                            border: '1px solid black',
                                            borderRadius: 0,
                                            margin: '1px'
                                        }} key={rack} node={{ host_name: rack }} color={'black'} bgcolor={'lightgray'} onClick={() => setExpanded(!expanded)} enableContextMenu={false} />
                                )
                            }
                            {nodes.length && (
                                nodes?.map((node, index) => (
                                    <Node2 style={{
                                        minWidth: '32.85%', minHeight: 35,
                                        border: '1px solid black',
                                        borderRadius: 0,
                                        margin: '1px'
                                    }} key={index} node={node} stats={stats} nest={nest} />
                                ))
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </div>
    );
});

export default Rack;
