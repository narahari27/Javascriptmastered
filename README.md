import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Menu, MenuItem, Popover, Box, IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CommentIcon from '@mui/icons-material/Comment';

// Create a simple KPI Modal Content component if you don't have one
const SimpleKPIModalContent = ({ node }) => {
  return (
    <Box sx={{ p: 2, minWidth: 300 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {node.host_name} Statistics
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Platform: {node.nodetype?.toUpperCase()}</Typography>
        <Typography variant="subtitle1">Data Center: {node.pool}</Typography>
        <Typography variant="subtitle1">Status: {node.nestStatus}</Typography>
        <Typography variant="subtitle1">Priority: {node.priority}</Typography>
      </Box>
      
      {node.stats ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>KPI Metrics:</Typography>
          {Object.keys(node.stats).map((key) => {
            const stat = node.stats[key];
            return (
              <Box key={key} sx={{ mb: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Typography variant="body2">KPI: {stat.kpi}</Typography>
                <Typography variant="body2">Rate: {stat.rate}%</Typography>
                <Typography variant="body2">Average: {stat.avg}%</Typography>
                <Typography variant="body2">Attempts: {stat.att}</Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography>No statistics available</Typography>
      )}
    </Box>
  );
};

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
    console.log("Hover detected");
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
    console.log("Mouse entered popover");
    setMouseIsOver(true);
  };

  // Handle mouse leaving popover
  const handleMouseLeavePopover = () => {
    console.log("Mouse left popover");
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

  return (
    <>
      <Card 
        ref={nodeRef}
        style={{
          ...style,
          backgroundColor: bgcolor || getColorPriority(safePriority),
          color: color || 'white',
          cursor: 'context-menu'
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
        sx={{ pointerEvents: 'none' }}
      >
        <Box 
          onMouseEnter={handleMouseEnterPopover}
          onMouseLeave={handleMouseLeavePopover}
          sx={{ pointerEvents: 'auto' }}
        >
          <SimpleKPIModalContent node={safeNode} />
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
