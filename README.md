import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startPolling } from "../polling";
import { store } from "../store";
import { setFilters as setFilters2, resetFilters as resetFilters2, setSearch as setSearch2, setPriorityFilter as setPriorityFilter2, setNestData } from "../reducers/nodeSlice";
import { CircularProgress, Grid, Stack, Checkbox, Button } from "@mui/material";
import { NodeContext } from "../NodeContext";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SyncIcon from "@mui/icons-material/Sync";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import SquareIcon from "@mui/icons-material/Square";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AppsIcon from "@mui/icons-material/Apps";
import Snackbar from "@mui/material/Snackbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Alert from "@mui/material/Alert";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import NodeGroup from "./NodeGroup";
import Notifications from "./Notifications";
import Region from "./Region";
import Region2 from "./Region2";
import { CheckBox, Sync } from "@mui/icons-material";

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
  const [state, setState] = React.useState({
    openSnackState: false,
    vertical: "top",
    horizontal: "right",
  });
  const dispatch = useDispatch();
  const nodesData = useSelector((state) => state.nodes)
  const { vertical, horizontal, openSnackState } = state;
  const {
    nodes,
    basefilters,
    filters,
    setFilters,
    filteredNodes,
    hasFilters,
    resetFilters,
    setSearch,
    dataLoading,
    alerts,
    notifications,
    error,
    setPriorityFilter,
    setDegradedNodes,
    degradedNodes,
    priorityFilter,
    upfView,
    toggleUPFView,
    toggleOOR,
    nestInfo,
    toggleLoader
  } = useContext(NodeContext);
  const [view, setView] = React.useState(
    localStorage.getItem("view")
      ? localStorage.getItem("view") === "true"
        ? true
        : false
      : false
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
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

    setTimeout(() => {
      closeSnack();
    }, 10000);
  };

  React.useEffect(() => {
    if (alerts.filter((x) => x.priority !== "normal").length > 0) {
      openSnack({ vertical: "top", horizontal: "right" });
    } else {
      closeSnack();
    }
  }, [alerts]);

  const closeSnack = () => {
    setState({ ...state, openSnackState: false });
  };

  useEffect(() => {
    setSelectedFilters(priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    startPolling(store);
  }, []);

  const getColorPriority = (priority) => {
    switch (priority) {
      case "critical":
        return "#ff0040";
      case "major":
        return "#f2630a";
      case "minor":
        return "#ffc33f";
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

  const [selectedFilters, setSelectedFilters] = useState(priorityFilter);
  const [selectedFilters2, setSelectedFilters2] = useState(nodesData.priorityFilters);

  const handleFilterToggle = (value, e) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
      setPriorityFilter(selectedFilters.filter((filter) => filter !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
      setPriorityFilter([...selectedFilters, value]);
    }
  };

  const handleFilterToggle2 = (value, e) => {
    if (selectedFilters2.includes(value)) {
      setSelectedFilters2(selectedFilters2.filter((filter) => filter !== value));
      dispatch(setPriorityFilter2({filters: selectedFilters2.filter((filter) => filter !== value), current: nodesData}));
    } else {
      setSelectedFilters2([...selectedFilters2, value]);
      dispatch(setPriorityFilter2({filters: [...selectedFilters2, value], current: nodesData}));
    }
  };

  useEffect(() => {
    if (Object.keys(nestInfo).length > 0) {
      dispatch(setNestData({nest: nestInfo, current: nodesData}));
    }
  }, [nestInfo]);

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
                <Grid item container xs={6}>
                  <Box sx={{ minWidth: 200, marginRight: "24px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="nodetype-label">Tech Type</InputLabel>
                      <Select
                        labelid="nodetype-label"
                        id="teah_type"
                        value={filters.nodetype}
                        label="Tech Type"
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            nodetype: e?.target?.value,
                          });
                        }}
                      >
                        {basefilters.nodetype?.sort()?.map((ttype) => (
                          <MenuItem key={ttype} value={ttype}>
                            {ttype?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 200, marginRight: "5px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="pool-label">Pool</InputLabel>
                      <Select
                        labelid="pool-label"
                        id="pool"
                        value={filters.pools}
                        label="Pool"
                        onChange={(e) => {
                          setFilters({ ...filters, pools: e?.target?.value });
                        }}
                      >
                        {basefilters.pools?.sort()?.map((pool) => (
                          <MenuItem key={pool} value={pool}>
                            {pool?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={resetFilters} aria-label="refresh">
                      <SyncIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ minWidth: 100, marginRight: "12px" }}>
                    <FormControl fullWidth>
                      {/* <InputLabel id="search-label">Search</InputLabel> */}
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
                </Grid>

                <Stack xs={4} direction="row" spacing={10} alignItems="center">
                  <Box sx={{display: 'flex', flexDirection: 'row', gap: '4px'}}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ViewModuleIcon
                        sx={{ color: !view ? "rgb(214, 0, 110)" : "#000" }}
                      />
                      <Typography>
                        Pool View
                      </Typography>
                    </Box>
                    <FormControlLabel
                      style={{marginLeft: 0, marginRight: 0}}
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
                      <Typography >
                        Node View
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', gap: '4px'}}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ViewModuleIcon
                        sx={{ color: !upfView ? "rgb(214, 0, 110)" : "#000" }}
                      />
                      <Typography>
                        Mobility Heatmap
                      </Typography>
                    </Box>
                    <FormControlLabel
                      style={{marginLeft: 0, marginRight: 0}}
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={upfView}
                          onChange={(e) => {
                            localStorage.setItem("upf_view", e.target.checked);
                            toggleUPFView(e.target.checked);

                            // Refresh oor for mobility view
                            localStorage.setItem('oor', 'false');
                            toggleOOR(false)
                          }}
                        />
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AppsIcon
                        sx={{ color: upfView ? "rgb(214, 0, 110)" : "#000" }}
                      />
                      <Typography>
                        UPF/SMF View
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Stack direction="row" justifyContent="end" xs={1}>
                  {dataLoading && (
                    <Box sx={{ alignItems: "right"}}>
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
                    checked={selectedFilters.includes("minor")}
                    onChange={(e) => handleFilterToggle("minor", e)}
                    sx={{
                      color: "#ffc33f",
                      "&.Mui-checked": {
                        color: "#ffc33f",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    Minor
                  </Typography>
                </Box>
                {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters.includes("oor")}
                    onChange={(e) => {handleFilterToggle("oor", e)
                      toggleLoader();
                    }}
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
                </Box> */}
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
                {((!hasFilters && !view) || (hasFilters && !view)) && (
                  <>
                    {Object.keys(nodes)
                      .sort()
                      .map((region, index) => (
                        <Region
                          key={index}
                          region={region}
                          nodes={nodes[region]}
                        />
                      ))}
                  </>
                )}

                {((hasFilters && view) || (!hasFilters && view)) &&
                  Object.keys(filteredNodes)
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
                        <NodeGroup
                          keyProp={index}
                          nodes={filteredNodes[i]}
                          group={Object.keys(filters)
                            .filter((key) => filters[key] !== "All")
                            .reduce(
                              (acc, key) => ({ ...acc, [key]: filters[key] }),
                              {}
                            )}
                        />
                      </Box>
                    ))}
              </Grid>
            </>
          )}
        </>
      );
    }
  };

  const layout2 = () => {
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
                  <Box sx={{ minWidth: 180, marginRight: "12px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="nodetype-label">Tech Type</InputLabel>
                      <Select
                        labelid="nodetype-label"
                        id="teah_type"
                        value={nodesData.filters.nodetype}
                        label="Tech Type"
                        onChange={(e) => {
                          dispatch(setFilters2({ selected: { ...nodesData.filters, nodetype: e?.target?.value }, data: nodesData.data }));
                        }}
                      >
                        {nodesData?.baseFilters?.nodetype?.map((ttype) => (
                          <MenuItem key={ttype} value={ttype}>
                            {ttype?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 180, marginRight: "12px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="pool-label">Pool</InputLabel>
                      <Select
                        labelid="pool-label"
                        id="pool"
                        value={nodesData.filters.pools}
                        label="Pool"
                        onChange={(e) => {
                          dispatch(setFilters2({ selected: { ...nodesData.filters, pools: e?.target?.value }, data: nodesData.data }));
                        }}
                      >
                        {nodesData?.baseFilters?.pools?.map((pool) => (
                          <MenuItem key={pool} value={pool}>
                            {pool?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 180, marginRight: "12px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="market-label">Market</InputLabel>
                      <Select
                        labelid="market-label"
                        id="market"
                        value={nodesData.filters.markets}
                        label="Market"
                        onChange={(e) => {
                          dispatch(setFilters2({ selected: { ...nodesData.filters, markets: e?.target?.value }, data: nodesData.data }));
                        }}
                      >
                        {nodesData?.baseFilters?.markets?.map((market) => (
                          <MenuItem key={market} value={market}>
                            {market?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 180, marginRight: "4px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="rack-label">Rack</InputLabel>
                      <Select
                        labelid="rack-label"
                        id="rack"
                        value={nodesData.filters.racks}
                        label="Rack"
                        onChange={(e) => {
                          dispatch(setFilters2({ selected: { ...nodesData.filters, racks: e?.target?.value }, data: nodesData.data }));
                        }}
                      >
                        {nodesData?.baseFilters?.racks?.map((rack) => (
                          <MenuItem key={rack} value={rack}>
                            {rack?.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => { dispatch(resetFilters2(nodesData.data)) }} aria-label="refresh">
                      <SyncIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ minWidth: 180, marginRight: "12px" }}>
                    <FormControl fullWidth>
                      {/* <InputLabel id="search-label">Search</InputLabel> */}
                      <TextField
                        labelid="search-label"
                        variant="outlined"
                        label="Search"
                        value={searchTerm2}
                        onChange={(e) => {
                          setSearchTerm2(e?.target?.value)
                        }}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            dispatch(setSearch2({
                              search: searchTerm2,
                              selected: nodesData.filters,
                              data: nodesData.data
                            }));
                          }
                        }}
                        sx={{ mr: 1, flex: 1 }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setSearch2({
                                    search: searchTerm2,
                                    selected: nodesData.filters,
                                    data: nodesData.data
                                  }));
                                }}
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
                </Grid>

                <Stack xs={2} direction="column"  alignItems="center">
                  <Box sx={{display: 'flex', flexDirection: 'row', gap: '4px'}}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ViewModuleIcon
                        sx={{ color: !upfView ? "rgb(214, 0, 110)" : "#000" }}
                      />
                      <Typography>
                        Mobility Heatmap
                      </Typography>
                    </Box>
                    <FormControlLabel
                      style={{marginLeft: 0, marginRight: 0}}
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={upfView}
                          onChange={(e) => {
                            localStorage.setItem("upf_view", e.target.checked);
                            toggleUPFView(e.target.checked);
                          }}
                        />
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AppsIcon
                        sx={{ color: upfView ? "rgb(214, 0, 110)" : "#000" }}
                      />
                      <Typography>
                        UPF/SMF View
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Stack direction="row" justifyContent="end" xs={1}>
                  {nodesData.loading && (
                    <Box sx={{ alignItems: "right" }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid container gap={2} sx={{ marginBottom: "24px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters2.includes("critical")}
                    onChange={(e) => handleFilterToggle2("critical", e)}
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
                    checked={selectedFilters2.includes("major")}
                    onChange={(e) => handleFilterToggle2("major", e)}
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
                    checked={selectedFilters2.includes("minor")}
                    onChange={(e) => handleFilterToggle2("minor", e)}
                    sx={{
                      color: "#ffc33f",
                      "&.Mui-checked": {
                        color: "#ffc33f",
                      },
                    }}
                  />
                  <Typography sx={{ marginLeft: "4px" }} variant="body">
                    Minor
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedFilters2.includes("oor")}
                    onChange={(e) => handleFilterToggle2("oor", e)}
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
                    checked={selectedFilters2.includes("normal")}
                    onChange={(e) => handleFilterToggle2("normal", e)}
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
                <>
                  {nodesData.nodes && (Object.keys(nodesData.nodes)
                    .sort()
                    .map((region, index) => (
                      <Region2
                        key={index}
                        region={region}
                        nodes={nodesData.nodes[region]}
                        stats={nodesData.stats}
                        nest={nestInfo}
                      />
                    )))}
                </>
              </Grid>
            </>
          )}
        </>
      );
    }
  };

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: 20 }}>
      <React.Fragment>
        {openSnackState && (
          <Box
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 1300,
              maxWidth: 450, // Adjust width as needed
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Alert
              // severity="warning"
              onClose={closeSnack}
              severity="warning"
              icon={false}
              sx={{
                bgcolor: "white",
                overflow: "hidden",
              }}
            >
              {/* <AlertTitle>Important Alerts</AlertTitle> */}
              <Paper>
                <Table style={styles.table}>
                  <TableHead style={styles.tableHead}>
                    <TableRow>
                      <TableCell style={styles.tableCell}>Node</TableCell>
                      <TableCell style={styles.tableCell}>State</TableCell>
                      <TableCell style={styles.tableCell}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts
                      ?.filter((alert) => alert.priority !== "normal")
                      .map((alert, index) => (
                        <TableRow key={index}>
                          <TableCell style={styles.tableCell}>
                            {alert.host_name}
                          </TableCell>
                          <TableCell style={getCellStyle(alert.priority)}>
                            {alert.priority}
                          </TableCell>
                          <TableCell style={styles.tableCell}>
                            {alert.isNew ? "New" : "Updated"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            </Alert>
          </Box>

        )}
      </React.Fragment>
      {upfView ? layout2() : layout()}
    </div>
  );
};

export default DashBoard;
