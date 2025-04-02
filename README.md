import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Menu, MenuItem, Popover, Box, IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CommentIcon from '@mui/icons-material/Comment';
import KPIModalContent from './KPIModalContent'; // Import the existing KPIModalContent

const Node = ({ node, onClick, style, bgcolor, color, enableContextMenu = true }) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const nodeRef = useRef(null);
  
  // Add defensive checks for node properties
  const safeNode = node || {};
  const safePriority = safeNode.priority || 'normal';
  const safeHostName = safeNode.host_name || 'Unknown';
  const safeNotes = Array.isArray(safeNode.notes) ? safeNode.notes : [];

  // Handle popover open on hover
  const handlePopoverOpen = (event) => {
    if (!enableContextMenu) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  // Handle popover close
  const handlePopoverClose = () => {
    setTimeout(() => {
      if (!mouseIsOver) {
        setAnchorEl(null);
      }
    }, 100);
  };

  // Handle mouse entering popover
  const handleMouseEnterPopover = () => {
    setMouseIsOver(true);
  };

  // Handle mouse leaving popover
  const handleMouseLeavePopover = () => {
    setMouseIsOver(false);
    setAnchorEl(null);
  };

  // Check if popover is open
  const open = Boolean(anchorEl);

  // Handle right-click context menu
  const handleContextMenu = (event) => {
    if (!enableContextMenu) {
      return;
    }
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        : null,
    );
  };

  // Handle context menu close
  const handleClose = () => {
    setContextMenu(null);
  };

  // Get color based on priority
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
        return 'rgb(128, 128, 128)';
    }
  };

  // Create dummy data structure for stats that KPIModalContent expects
  const groupedStats = (stats) => {
    if (!stats) {
      return undefined;
    }

    const panels = Object.values(stats)?.reduce((acc, curr) => {
      if (!acc[curr.panel]) {
        acc[curr.panel] = [];
        acc[curr.panel].push(curr);
      } else {
        acc[curr.panel].push(curr);
      }

      return acc;
    }, {});

    return panels;
  };

  return (
    <>
      <Card 
        ref={nodeRef}
        style={{
          ...style,
          backgroundColor: bgcolor || getColorPriority(safePriority),
          color: color || 'white',
          cursor: 'context-menu',
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={onClick} 
        onContextMenu={handleContextMenu}
      >
        <CardContent 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: 8, 
            fontSize: '12px' 
          }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <Typography
            style={{ fontSize: 'inherit', fontWeight: 'inherit', width: 'auto' }} 
            variant="body2"
          >
            {safeHostName.toUpperCase()}
          </Typography>

          {safeNotes && safeNotes.length > 0 && (
            <CommentIcon style={{ cursor: 'pointer', color: '#000', fontSize: '16px' }} />
          )}
        </CardContent>
      </Card>

      {/* Popover for hovering over node */}
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        sx={{ 
          pointerEvents: 'none',
          '& .MuiPopover-paper': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            maxWidth: '600px',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(10px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              },
            },
          }
        }}
      >
        <Box 
          onMouseEnter={handleMouseEnterPopover}
          onMouseLeave={handleMouseLeavePopover}
          sx={{ 
            pointerEvents: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Use the existing KPIModalContent component */}
          <KPIModalContent node={safeNode} data={groupedStats(safeNode.stats)} />
        </Box>
      </Popover>

      {/* Context menu for right-clicking */}
      {enableContextMenu && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => {
            alert(`Node info for ${safeHostName.toUpperCase()}`);
            handleClose();
          }}>
            <HistoryIcon style={{ marginRight: '8px', color: "#d6006e" }} /> Node Info
          </MenuItem>
          <MenuItem onClick={() => {
            alert(`Charts for ${safeHostName.toUpperCase()}`);
            handleClose();
          }}>
            <ShowChartIcon style={{ marginRight: '8px', color: "#d6006e" }} />Charts
          </MenuItem>
          <MenuItem onClick={() => {
            alert(`Add notes for ${safeHostName.toUpperCase()}`);
            handleClose();
          }}>
            <NoteAddIcon style={{ marginRight: '8px', color: "#d6006e" }} />Add Notes
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default Node;

// In KPIModalContent.jsx
// Adjust the styles object to make it fit better in a popover

const styles = {
    table: {
        borderCollapse: 'collapse',
        border: '1px solid #e0e0e0',
        minWidth: 350,
        maxWidth: '100%',
    },
    tableHead: {
        backgroundColor: '#d6006e',
        color: '#fff'
    },
    tableCell: {
        border: '1px solid #e0e0e0',
        padding: '4px 8px', // Slightly smaller padding for popover
        color: 'inherit',
        fontSize: '12px',
    },
    tableCellColored: {
        border: '1px solid #e0e0e0',
        padding: '4px 8px',
        backgroundColor: '#d6006e',
        color: 'white',
        fontSize: '12px',
    },
};

// Make the component more compact for popover display
const KPIModalContent = React.memo(({ node, data }) => {
    // Rest of your component code...
    
    return (
        <>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCell}>Node Name</TableCell>
                        <TableCell style={styles.tableCell}>Sync Time</TableCell>
                        <TableCell style={styles.tableCell}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={styles.tableCell}>{node?.host_name}</TableCell>
                        <TableCell style={styles.tableCell}>{showTime(Object.values(node?.stats || {})[0]?.time_value)}</TableCell>
                        <TableCell style={styles.tableCell}>{node?.nestStatus || 'NA'}</TableCell>
                    </TableRow>
                    {
                        node?.notes?.length > 0 && (
                            <TableRow>
                                <TableCell style={styles.tableCellColored}>Latest Note</TableCell>
                                <TableCell style={styles.tableCell}>{node?.notes[0]?.notes || ''}</TableCell>
                                <TableCell style={styles.tableCell}>{node?.notes[0] ? noteInfo(node?.notes[0]) : ''}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: '8px',
                p: 1
            }}>
                {
                    data && Object.keys(data).length > 0 ? (
                        Object.values(data).map((kpis, index) => (
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
                        ))
                    ) : (
                        <Box sx={{ p: 2, width: '100%', textAlign: 'center' }}>
                            <Typography variant="body2">No KPI data available</Typography>
                        </Box>
                    )
                }
            </Box>
        </>
    );
});
