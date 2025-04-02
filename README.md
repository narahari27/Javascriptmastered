import React, { useState } from 'react';
import { Card, CardContent, Typography, Menu, MenuItem, Box, IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CommentIcon from '@mui/icons-material/Comment';

const Node = ({ node, onClick, style, bgcolor, color, enableContextMenu = true }) => {
  const [contextMenu, setContextMenu] = useState(null);
  
  // Add defensive checks for node properties
  const safeNode = node || {};
  const safePriority = safeNode.priority || 'normal';
  const safeHostName = safeNode.host_name || 'Unknown';
  const safeNotes = Array.isArray(safeNode.notes) ? safeNode.notes : [];

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

  const handleClose = () => {
    setContextMenu(null);
  };

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

  // Simplified version showing just the node card with no modals
  return (
    <>
      <Card 
        style={{
          ...style,
          backgroundColor: bgcolor || getColorPriority(safePriority),
          color: color || 'white',
          cursor: 'context-menu'
        }} 
        onClick={onClick} 
        onContextMenu={handleContextMenu}
      >
        <CardContent style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: 8, 
          fontSize: '12px' 
        }}>
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
            // Just show alert instead of opening external URL
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
