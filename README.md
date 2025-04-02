import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Card, CardContent, Typography, Menu, MenuItem, Popover, Modal, Box, Input, Button, IconButton, TextField, FormControl, InputLabel, Select } from '@mui/material';
import { NodeContext } from "../NodeContext";
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import NotesIcon from '@mui/icons-material/Notes';
import CloseIcon from '@mui/icons-material/Close';
import KPIModalContent from './KPIModalContent';
import axiosClient from '../api/client';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
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
  p: 4,
  width: '75%'
};

const modalNotes = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const Node = ({ node, onClick, style, bgcolor, color, enableContextMenu = true }) => {
  const currentDate = moment().tz(ptTimeZone);
  const [state, setState] = React.useState({
    openSnackState: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, openSnackState } = state;
  const [snackMessage, setSnackMessage] = useState('');
  const { syncNotes } = useContext(NodeContext);
  const [contextMenu, setContextMenu] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openNotes, setOpenNotes] = useState(false);
  const [openViewNotes, setViewOpenNotes] = useState(false);
  const [openChart, setOpenChart] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [note, setNote] = useState('');
  const [curr, setCurr] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [endDate, setEndDate] = useState(() => {
    const ptNow = moment.tz(ptTimeZone).format('YYYY-MM-DDTHH:mm');
    return ptNow;
  });
  const [autoDelete, setAutoDelete] = useState(7);
  
  const [startDate, setStartDate] = useState(() => {
    const ptFiveMinutesAgo = moment.tz(ptTimeZone).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm');
    return ptFiveMinutesAgo;
  });

  const [chartFilters, setChartFilters] = React.useState({startDateTime: moment.tz(ptTimeZone).subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss'), endDateTime:  currentDate.format('YYYY-MM-DDTHH:mm:ss')});
  const [from, setFrom] = useState(moment(chartFilters.startDateTime).valueOf());
  const [to, setTo] = useState(moment(chartFilters.endDateTime).valueOf());


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

  const handlePopoverOpen = (event) => {
    if (!enableContextMenu) {
      return;
    }
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
        :
        null,
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
  }

  const saveNote = async () => {
    await axiosClient.post('/api/addNotes', { host_name: node.host_name, notes: note, expiresInDays: autoDelete });
    syncNotes();
    setOpenNotes(false);
  }

  const openSnack = (newState, message = '') => {
    setSnackMessage(message);
    setState({ ...newState, openSnackState: true });
  };

  const closeSnack = () => {
    setState({ ...state, openSnackState: false });
  };

  const deleteNote = async (curr) => {
    await axiosClient.put('/api/deactivateNotes', { host_name: curr.host_name, notes: curr.notes });
    openSnack({ vertical: 'top', horizontal: 'center' }, 'Note has been deleted successfully!!');
    syncNotes();
    setCurr('');
    setConfirmModal(false);
    setViewOpenNotes(false);
  }

  const groupedStats = (stats) => {

    if (!stats) {
      return;
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
  }

  const getPanel = () => {
    if (node.nodetype === 'tas') {
      return 1
    } else if (node.nodetype === 'cscf') {
      return 3
    } else if (node.nodetype === 'bgcf') {
      return 5
    } else if (node.nodetype === 'catf') {
      return 7
    } else if (node.nodetype === 'vss') {
      return 9
    } else if (node.nodetype === 'sbi') {
      return 11
    } else if (node.nodetype === 'csbg') {
      return 13
    }else {
      return 15
    }
  }

  function NameIcons(name) {
    let formattedName = name;
    if (!name) {
      formattedName = 'Default, User';
    } else if (name === 'Default User') {
      formattedName = 'Default, User';
    }
    let [firstName, lastName] = formattedName.split(', ');
    let firstLetterFirstName = firstName.charAt(0).toUpperCase();
    let firstLetterLastName = lastName.charAt(0).toUpperCase();
  
    return (
      <div className="name-icons">
        <div title={formattedName} className="icon">{firstLetterFirstName}{firstLetterLastName}</div>
      </div>
    );
  }

  const remainingDays = (date) => {
    if (date) {
      const currentDate = moment();
      const deletionDate = moment(date);
      const diffInDays = deletionDate.diff(currentDate, 'days');
      return diffInDays;
    } else {
      return 7;
    }
};

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackState}
        autoHideDuration={3000}
        onClose={closeSnack}
        key={vertical + horizontal}
        style={{ top: 100 }}
      >
        <Alert
          onClose={closeSnack}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
      <Card style={{
        ...style,
        backgroundColor: bgcolor || getColorPriority(node?.priority),
        color: color || 'white',
        cursor: 'context-menu'
      }} onClick={onClick} onContextMenu={handleContextMenu} >
        <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, fontSize: '12px' }}>
          <Typography onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose} aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            style={{ fontSize: 'inherit', fontWeight: 'inherit', width: 'auto' }} variant="body2">{node?.host_name?.toUpperCase()}</Typography>

          {
            node && node.notes && node.notes.length > 0 && (
              <CommentIcon style={{ cursor: 'pointer', color: '#000', fontSize: '16px' }} onClick={() => setViewOpenNotes(true)} />
            )
          }
        </CardContent>

        {
          enableContextMenu && (
            <>
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
                  window.open(`https://wasp.eng.t-mobile.com/nodeinfo/${node.host_name?.toUpperCase()}`, '_blank');
                  handleClose();
                }}><HistoryIcon style={{ marginRight: '8px', color: "#d6006e" }} /> Node Info</MenuItem>
                <MenuItem onClick={() => { setOpenChart(true); handleClose(); }}><ShowChartIcon style={{ marginRight: '8px', color: "#d6006e" }} />Charts</MenuItem>
                <MenuItem onClick={() => { setOpenNotes(true); handleClose(); }}><NoteAddIcon style={{ marginRight: '8px', color: "#d6006e" }} />Add Notes</MenuItem>
              </Menu>

              <Popover
                id="mouse-over-popover"
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
                  onMouseLeave={handleMouseLeavePopover}>
                  <CardContent>
                    {
                      node?.stats && (
                        <>
                          <KPIModalContent node={node} data={groupedStats(node?.stats)} />
                        </>
                      )
                    }
                    {
                      !node?.stats && (
                        <Typography variant="h6" sx={{ color: '#d6006e' }}>No Data</Typography>
                      )
                    }
                  </CardContent>
                </Card>
              </Popover>
              <Modal
                open={openChart}
                onClose={() => { setOpenChart(false); }}
                aria-labelledby="chart-modal-title"
                aria-describedby="chart-modal-description"
              >
                <Box sx={modal}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#d6006e' }}>
                    <Typography id="chart-modal-title" variant="h6" component="h2">
                      {node.host_name?.toUpperCase()} - KPI Chart
                    </Typography>

                    <IconButton sx={{ color: '#d6006e' }} onClick={() => { setOpenChart(false); }}><CloseIcon /></IconButton>
                  </Box>
                  <Box sx={{ marginTop: 2, marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label="Start Date"
                      type="datetime-local"
                      value={chartFilters.startDateTime ? moment(chartFilters.startDateTime).format('YYYY-MM-DDTHH:mm:ss') : ''}
                      onChange={(event) => handleChartFilterChange(event, 'startDateTime')}
                      sx={{ marginRight: 1 }}
                    />
                    <TextField
                      label="End Date"
                      type="datetime-local"
                      value={chartFilters.endDateTime ? moment(chartFilters.endDateTime).format('YYYY-MM-DDTHH:mm:ss') : ''}
                      onChange={(event) => handleChartFilterChange(event, 'endDateTime')}
                      sx={{ marginRight: 1 }}
                    />
                    <Button variant="contained" color="primary" onClick={updateGrafana}>Update Chart</Button>
                  </Box>
                  <Box>
                    {from && to && (
                      <iframe
                        src={`https://grafana.tools.nsds.t-mobile.com/d-solo/TAS000003/voicecore-heatmap-tas-performance?tz=America/Los_Angeles&orgId=1&refresh=5m&var-${node.nodetype?.toUpperCase()}=${node.host_name}&var-${node.nodetype?.toUpperCase()}_POOL=${node.pool}&from=${from}&to=${to}&panelId=${getPanel()}&theme=light`}
                        style={{ width: '100%', height: '650px', border: 'none' }}
                        frameBorder="0"
                      ></iframe>
                    )}
                  </Box>
                </Box>
              </Modal>
              <Modal
                open={openNotes}
                onClose={() => { setOpenNotes(false); }}
                aria-labelledby="notes-modal-title"
                aria-describedby="notes-modal-description"
              >
                <Box sx={modalNotes}>
                  <Typography sx={{ color: '#d6006e' }} id="notes-modal-title" variant="h6" component="h2">
                    Add Notes for {node.host_name?.toUpperCase()}
                  </Typography>
                  <Input id="notes" aria-describedby="notes" label="Notes" multiline sx={{ width: '100%', marginBottom: '16px' }} onChange={(e) => { setNote(e.target.value) }} fullWidth />
                  <FormControl sx={{ marginTop: '8px', width: '32%' }}>
                      <InputLabel id="auto-delete-label">Auto Delete</InputLabel>
                      <Select
                          labelId="auto-delete-label"
                          id="auto-delete"
                          value={autoDelete}
                          onChange={(e) => setAutoDelete(e.target.value)}
                      >
                          <MenuItem value={1}>1 day</MenuItem>
                          <MenuItem value={2}>2 days</MenuItem>
                          <MenuItem value={3}>3 days</MenuItem>
                          <MenuItem value={4}>4 days</MenuItem>
                          <MenuItem value={5}>5 days</MenuItem>
                          <MenuItem value={6}>6 days</MenuItem>
                          <MenuItem value={7}>7 days</MenuItem>
                      </Select>
                  </FormControl>
                  <Button sx={{ marginTop: '8px', marginLeft: '8px', height: '56px', width: '32%' }} variant="contained" onClick={() => { saveNote() }}>Submit</Button>
                  <Button sx={{ marginTop: '8px', marginLeft: '8px', height: '56px', width: '32%' }} variant="outlined" onClick={() => { setOpenNotes(false); }}>Cancel</Button>
                </Box>
              </Modal>
              <Modal
                open={confirmModal}
                onClose={() => { setConfirmModal(false); }}
                aria-labelledby="notes-confirm-modal-title"
                aria-describedby="notes-confirm-modal-description"
              >
                <Box sx={modalNotes}>
                  <Typography sx={{ color: '#d6006e' }} id="notes-confirm-modal-title" variant="h6" component="h2">
                    Confirm deleting the Note!
                  </Typography>
                  <Button sx={{ marginTop: '8px' }} variant="contained" onClick={() => { deleteNote(curr); }}>Confirm</Button>
                  <Button sx={{ marginTop: '8px', marginLeft: '8px' }} variant="outlined" onClick={() => { setConfirmModal(false); }}>Cancel</Button>
                </Box>
              </Modal>
              <Modal
                open={openViewNotes}
                onClose={() => { setViewOpenNotes(false); }}
                aria-labelledby="notes-modal-title"
                aria-describedby="notes-modal-description"
              >
                <Box sx={modalNotes}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <Typography sx={{ color: '#d6006e' }} id="notes-modal-title" variant="h6" component="h2">
                      {node.host_name?.toUpperCase()} Notes
                    </Typography>
                    <IconButton sx={{ color: '#d6006e' }} onClick={() => { setViewOpenNotes(false); }}><CloseIcon /></IconButton>
                  </div>
                  {
                    node && node.notes && (
                      node.notes.map((note, index) => (
                        <div style={{ margin: '8px 0', border: '1px solid #d6006e', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', }} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {NameIcons(note?.updated_by)}
                            <Box>
                              <Typography sx={{ fontSize: '24px' }} id="notes-modal-title" variant="body">
                                {note.notes}
                              </Typography>
                              <Typography sx={{ fontSize: '12px' }}>{new Date(note.updated_at).toLocaleDateString()}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AutoDeleteIcon sx={{marginRight: '8px'}}/>{remainingDays(note?.expires_at) + 1}
                            <IconButton sx={{ color: '#d6006e', marginLeft: '8px' }} onClick={() => { setCurr(note); setConfirmModal(true); }}><DeleteIcon /></IconButton>
                          </Box>
                        </div>
                      ))
                    )
                  }
                </Box>
              </Modal>
            </>
          )
        }
      </Card>
    </>
  );
};

export default Node;
