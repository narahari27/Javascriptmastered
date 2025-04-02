import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Menu, MenuItem, Popover, Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CommentIcon from '@mui/icons-material/Comment';

// Custom KPI Table Component for Popover
const KPITable = ({ node }) => {
  // Define table styles to match screenshot
  const styles = {
    table: {
      borderCollapse: 'collapse',
      width: '100%',
      border: '1px solid #ccc',
      fontSize: '12px',
    },
    headerCell: {
      backgroundColor: '#d6006e',
      color: 'white',
      padding: '8px',
      textAlign: 'left',
      fontWeight: 'bold',
      border: '1px solid #ddd',
    },
    cell: {
      padding: '6px 8px',
      border: '1px solid #ddd',
      color: 'black',
    },
    row: {
      backgroundColor: 'white',
    },
    altRow: {
      backgroundColor: '#f9f9f9',
    },
    nodeInfoTable: {
      marginBottom: '10px',
      width: '100%',
    },
    kpiCell: {
      padding: '6px 8px',
      border: '1px solid #ddd',
      color: '#218838',
      fontWeight: 'medium',
    }
  };

  // Generate mock KPI data if none provided
  const generateMockKPIs = () => {
    return [
      { kpi: 'DIAMRE_LIR_SUCCRATE', sr: 84.45, avg: null, attempts: 32638, avgAtt: null },
      { kpi: 'DIAMRE_UAR_SUCCRATE', sr: 99.2, avg: null, attempts: 36124, avgAtt: null },
      { kpi: 'DIAMRE_MAR_SUCCRATE', sr: 99.96, avg: null, attempts: 7785, avgAtt: null },
      { kpi: 'DIAMRE_SAR_SUCCRATE', sr: 99.62, avg: null, attempts: 23651, avgAtt: null },
      { kpi: 'DIAMRE_REQRCV_SUCCRATE', sr: 100, avg: null, attempts: 19, avgAtt: null },
      { kpi: 'DIAMRE_REQSND_SUCCRATE', sr: 100, avg: null, attempts: 139101, avgAtt: null },
      { kpi: 'GTRE_DNS_SRV_RATE', sr: 100, avg: null, attempts: 765, avgAtt: null },
      { kpi: 'GTRE_DNS_NAPTR_RATE', sr: 100, avg: null, attempts: 558, avgAtt: null },
      { kpi: 'GTRE_ENUM_SUCCRATE', sr: 78.75, avg: null, attempts: 68853, avgAtt: null },
      { kpi: 'SIPRE_ROUTING_SUCCRATE', sr: 100, avg: null, attempts: 2545331, avgAtt: null },
      { kpi: 'SIPRE_DB_ADAPTER_MGR_SUCCRATE', sr: 99.14, avg: null, attempts: 442641, avgAtt: null },
      { kpi: 'SIPRE_DB_ADAPTER_CLIENT_SUCCRATE', sr: 99.14, avg: null, attempts: 442641, avgAtt: null },
    ];
  };

  const kpis = generateMockKPIs();

  return (
    <Box sx={{ p: 1, maxWidth: 700, minWidth: 650 }}>
      {/* Node Info Table */}
      <Table style={styles.nodeInfoTable}>
        <TableHead>
          <TableRow>
            <TableCell style={styles.headerCell}>Node Name</TableCell>
            <TableCell style={styles.headerCell}>Sync Time</TableCell>
            <TableCell style={styles.headerCell}>Nest Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={styles.row}>
            <TableCell style={styles.cell}>{node?.host_name || 'Unknown'}</TableCell>
            <TableCell style={styles.cell}>{new Date().toLocaleString().replace(',', '')}</TableCell>
            <TableCell style={styles.cell}>InService</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* KPI Table */}
      <Table style={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell style={styles.headerCell}>KPI</TableCell>
            <TableCell style={styles.headerCell}>SR%</TableCell>
            <TableCell style={styles.headerCell}>Avg%</TableCell>
            <TableCell style={styles.headerCell}>Attempts</TableCell>
            <TableCell style={styles.headerCell}>Avg Att</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kpis.map((kpi, index) => (
            <TableRow key={index} style={index % 2 === 0 ? styles.row : styles.altRow}>
              <TableCell style={{...styles.cell, color: '#218838'}}>{kpi.kpi}</TableCell>
              <TableCell style={styles.cell}>{kpi.sr}</TableCell>
              <TableCell style={styles.cell}>{kpi.avg || ''}</TableCell>
              <TableCell style={styles.cell}>{kpi.attempts.toLocaleString()}</TableCell>
              <TableCell style={styles.cell}>{kpi.avgAtt || ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
            maxWidth: '800px',
            overflow: 'hidden',
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
          {/* Use our custom KPI table component */}
          <KPITable node={safeNode} />
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
