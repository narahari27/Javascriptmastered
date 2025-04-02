import React, { useContext, useEffect, useState } from "react";
import { CircularProgress, Grid, Stack, Checkbox, Button } from "@mui/material";
import { NodeContext } from "../SimpleMockNodeContext"; // Make sure this path is correct
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SyncIcon from "@mui/icons-material/Sync";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AppsIcon from "@mui/icons-material/Apps";
import Snackbar from "@mui/material/Snackbar";
import { Paper } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Alert from "@mui/material/Alert";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import Region from "./Region";
import Notifications from "./Notifications";

const styles = {
  table: {
    borderCollapse: "collapse",
    border: "1px solid #e0e0e0",
    minWidth: 400,
  },
  tableHead: {
    backgroundColor: "#d6006e",
    color: "#fff",
  },
  tableCell: {
    border: "1px solid #e0e0e0",
    padding: "2px",
    color: "inherit",
    fontSize: "12px",
  },
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark" ? "#2ECA45" : "rgb(214, 0, 110)",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor:
      theme.palette.mode === "light" ? "rgb(214, 0, 110)" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const DashBoard = () => {
  // Safely access context
  const contextValue = useContext(NodeContext);
  
  // Destructure with default values to prevent errors
  const {
    nodes = {},
    basefilters = { nodetype: ['All'], pools: ['All'] },
    filters = { nodetype: 'All', pools: 'All' },
    setFilters = () => {},
    filteredNodes = {},
    hasFilters = false,
    resetFilters = () => {},
    setSearch = () => {},
    dataLoading = false,
    alerts = [],
    notifications = false,
    error = false,
    setPriorityFilter = () => {},
    setDegradedNodes = () => {},
    degradedNodes = false,
    priorityFilter = ['normal', 'oor', 'major', 'critical'],
  } = contextValue || {};

  const [state, setState] = React.useState({
    openSnackState: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, openSnackState } = state;
  
  const [view, setView] = React.useState(
    localStorage.getItem("view")
      ? localStorage.getItem("view") === "true"
        ? true
        : false
      : false
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    if (scale < 1) {
      setScale(scale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.2) {
      setScale(scale - 0.1);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(searchTerm);
  };

  const openSnack = (newState, message = "") => {
    setState({ ...newState, openSnackState: true });
  };

  React.useEffect(() => {
    if ((alerts || []).filter((x) => x.priority !== "normal").length > 0) {
      openSnack({ vertical: "top", horizontal: "right" });
    } else {
      closeSnack();
    }
  }, [alerts]);

  const closeSnack = () => {
    setState({ ...state, openSnackState: false });
  };

  useEffect(() => {
    setSelectedFilters(priorityFilter || []);
  }, [priorityFilter]);

  const getColorPriority = (priority) => {
    switch (priority) {
      case "critical":
        return "#ff0040";
      case "major":
        return "#f2630a";
      case "minor":
        return "#ffbf00";
      case "oor":
        return "#0a58ca";
      case "normal":
        return "#198754";

      default:
        return "#000";
    }
  };

  const getCellStyle = (priority) => {
    return {
      border: "1px solid #e0e0e0",
      padding: "2px",
      color: getColorPriority(priority),
      fontSize: "12px",
    };
  };

  const [selectedFilters, setSelectedFilters] = useState(priorityFilter || []);

  const handleFilterToggle = (value, e) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
      setPriorityFilter(selectedFilters.filter((filter) => filter !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
      setPriorityFilter([...selectedFilters, value]);
    }
  };

  const layout = () => {
    if (error) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" component="h1" align="center">
            <EngineeringIcon
              style={{ width: "100px", height: "100px", color: "#d6006e" }}
            />
          </Typography>
          <Typography variant="h4" component="h1" align="center">
            Site Maintenance In Progress
          </Typography>
        </Box>
      );
    } else {
      return (
        <>
          {notifications ? (
            <Notifications />
          ) : (
            <>
              <Grid
                container
                direction="row"
                sx={{
                  marginBottom: "24px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Grid item container xs={9}>
                  <Box sx={{ minWidth: 200, marginRight: "24px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="nodetype-label">Tech Type</InputLabel>
                      <Select
                        labelid="nodetype-label"
                        id="teah_type"
                        value={filters?.nodetype || 'All'}
                        label="Tech Type"
                        onChange={(e) => {
                          setFilters({
                            ...(filters || {}),
                            nodetype: e?.target?.value,
                          });
                        }}
                      >
                        {(basefilters?.nodetype || ['All'])?.sort()?.map((ttype) => (
                          <MenuItem key={ttype} value={ttype}>
                            {ttype?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 200, marginRight: "24px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="pool-label">Pool</InputLabel>
                      <Select
                        labelid="pool-label"
                        id="pool"
                        value={filters?.pools || 'All'}
                        label="Pool"
                        onChange={(e) => {
                          setFilters({ ...(filters || {}), pools: e?.target?.value });
                        }}
                      >
                        {(basefilters?.pools || ['All'])?.sort()?.map((pool) => (
                          <MenuItem key={pool} value={pool}>
                            {pool?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 200, marginRight: "24px" }}>
                    <FormControl fullWidth>
                      <TextField
                        labelid="search-label"
                        variant="outlined"
                        label="Search"
                        value={searchTerm}
                        onChange={handleChange}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit(e);
                          }
                        }}
                        sx={{ mr: 1, flex: 1 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleSubmit}
                                sx={{ p: "10px" }}
                                aria-label="search"
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "24px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setDegradedNodes(!degradedNodes);
                      }}
                      sx={{
                        textTransform: "none",
                        height: "56px",
                        minWidth: "160px",
                        backgroundColor: !degradedNodes
                          ? "primary"
                          : "rgb(160, 0, 80)",
                      }}
                    >
                      Degraded Nodes
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={resetFilters} aria-label="refresh">
                      <SyncIcon />
                    </IconButton>
                  </Box>
                </Grid>

                <Stack xs={2} direction="row" spacing={1} alignItems="center">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ViewModuleIcon
                      sx={{ color: !view ? "rgb(214, 0, 110)" : "#000" }}
                    />
                    <Typography sx={{ marginLeft: "4px" }}>
                      Pool View
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={view}
                        onChange={(e) => {
                          localStorage.setItem("view", e.target.checked);
                          setView(e.target.checked);
                        }}
                      />
                    }
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AppsIcon
                      sx={{ color: view ? "rgb(214, 0, 110)" : "#000" }}
                    />
                    <Typography sx={{ marginLeft: "4px" }}>
                      Node View
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" justifyContent="end" xs={1}>
                  {dataLoading && (
                    <Box sx={{ alignItems: "right" }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid container gap={2} sx={{ marginBottom: "24px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters.includes("critical")}
                    onChange={(e) => handleFilterToggle("critical", e)}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "#ff0040",
                      },
                      "&.Mui-checked .MuiIconButton-root": {
                        backgroundColor: "#ff0040",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    Critical
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters.includes("major")}
                    onChange={(e) => handleFilterToggle("major", e)}
                    sx={{
                      color: "#f2630a",
                      "&.Mui-checked": {
                        color: "#f2630a",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    Major
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters.includes("oor")}
                    onChange={(e) => handleFilterToggle("oor", e)}
                    sx={{
                      color: "#0a58ca",
                      "&.Mui-checked": {
                        color: "#0a58ca",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    OOR
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters.includes("normal")}
                    onChange={(e) => handleFilterToggle("normal", e)}
                    sx={{
                      color: "#198754",
                      "&.Mui-checked": {
                        color: "#198754",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    Normal
                  </Typography>
                </Box>

                <div className="controls">
                  <IconButton onClick={handleZoomIn}>
                    <ZoomInIcon sx={{ color: "#d6006e" }} />
                  </IconButton>
                  <IconButton onClick={handleZoomOut}>
                    <ZoomOutIcon sx={{ color: "#d6006e" }} />
                  </IconButton>

                  <Typography
                    sx={{ marginLeft: "4px", color: "#d6006e" }}
                    variant="body"
                  >
                    Use Ctrl +/- for window zoom in and out
                  </Typography>
                </div>
              </Grid>
              <Grid style={{ transform: `scale(${scale})` }} container>
                {/* Render message if no nodes are available */}
                {(!nodes || Object.keys(nodes).length === 0) && !dataLoading && (
                  <Box sx={{ width: '100%', textAlign: 'center', my: 4 }}>
                    <Typography variant="h5">
                      No nodes available. Make sure your context is properly initialized.
                    </Typography>
                  </Box>
                )}

                {((!hasFilters && !view) || (hasFilters && !view)) && (
                  <>
                    {Object.keys(nodes || {})
                      .sort()
                      .map((region) => (
                        <Region
                          key={region}
                          region={region}
                          nodes={nodes[region] || []}
                        />
                      ))}
                  </>
                )}

                {((hasFilters && view) || (!hasFilters && view)) &&
                  Object.keys(filteredNodes || {})
                    .sort()
                    .map((i, index) => (
                      <Box
                        key={index}
                        style={{
                          width: "50%",
                          padding: 0,
                          margin: 0,
                          border: "2px solid black",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* You might need to add NodeGroup import and component here */}
                        {/* <NodeGroup
                          keyProp={index}
                          nodes={filteredNodes[i]}
                          group={Object.keys(filters)
                            .filter((key) => filters[key] !== "All")
                            .reduce(
                              (acc, key) => ({ ...acc, [key]: filters[key] }),
                              {}
                            )}
                        /> */}
                      </Box>
                    ))}
              </Grid>
            </>
          )}
        </>
      );
    }
  };

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: 20 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackState}
        autoHideDuration={10000}
        onClose={closeSnack}
        key={vertical + horizontal}
        style={{
          top: 100,
        }}
      >
        {(alerts || []).filter((x) => x.priority !== "normal").length > 0 && (
          <Paper>
            <div style={styles.table}>
              Alerts are available
            </div>
          </Paper>
        )}
      </Snackbar>
      {layout()}
    </div>
  );
};

export default DashBoard;
