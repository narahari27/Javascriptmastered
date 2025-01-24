import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startPolling } from "../polling";
import { store } from "../store";
import {
    setFilters as setFilters2,
    resetFilters as resetFilters2,
    setSearch as setSearch2,
    setPriorityFilter as setPriorityFilter2,
    setNestData,
} from "../reducers/nodeSlice";
import {
    CircularProgress,
    Grid,
    Stack,
    Checkbox,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
    TextField,
    InputAdornment,
    Snackbar,
    Alert,
} from "@mui/material";
import { NodeContext } from "../NodeContext";
import SyncIcon from "@mui/icons-material/Sync";
import SearchIcon from "@mui/icons-material/Search";
import Notifications from "./Notifications";
import Region from "./Region";
import Region2 from "./Region2";

const Dashboard = () => {
    const dispatch = useDispatch();
    const nodesData = useSelector((state) => state.nodes);
    const {
        nodes,
        filters,
        basefilters,
        resetFilters,
        setSearch,
        setPriorityFilter,
        priorityFilter,
        upfView,
    } = useContext(NodeContext);

    const [selectedFilters, setSelectedFilters] = useState(priorityFilter);
    const [selectedFilters2, setSelectedFilters2] = useState(nodesData.priorityFilters);
    const [searchTerm, setSearchTerm] = useState("");
    const [scale, setScale] = useState(1);

    useEffect(() => {
        setSelectedFilters(priorityFilter);
    }, [priorityFilter]);

    useEffect(() => {
        startPolling(store);
    }, []);

    // Context-based filter toggle
    const handleFilterToggle = (value, e) => {
        if (selectedFilters.includes(value)) {
            const updatedFilters = selectedFilters.filter((filter) => filter !== value);
            setSelectedFilters(updatedFilters);
            setPriorityFilter(updatedFilters); // Update context
        } else {
            const updatedFilters = [...selectedFilters, value];
            setSelectedFilters(updatedFilters);
            setPriorityFilter(updatedFilters); // Update context
        }
    };

    // Redux-based filter toggle
    const handleFilterToggle2 = (value, e) => {
        if (selectedFilters2.includes(value)) {
            const updatedFilters = selectedFilters2.filter((filter) => filter !== value);
            setSelectedFilters2(updatedFilters);
            dispatch(setPriorityFilter2({ filters: updatedFilters, current: nodesData }));
        } else {
            const updatedFilters = [...selectedFilters2, value];
            setSelectedFilters2(updatedFilters);
            dispatch(setPriorityFilter2({ filters: updatedFilters, current: nodesData }));
        }
    };

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

    const layout = () => {
        return (
            <>
                <Grid container gap={2} sx={{ marginBottom: "24px" }}>
                    {/* Context-Based Filters */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters.includes("critical")}
                            onChange={(e) => handleFilterToggle("critical", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Critical
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters.includes("major")}
                            onChange={(e) => handleFilterToggle("major", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Major
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters.includes("minor")}
                            onChange={(e) => handleFilterToggle("minor", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Minor
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters.includes("normal")}
                            onChange={(e) => handleFilterToggle("normal", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Normal
                        </Typography>
                    </Box>
                </Grid>

                <Grid container gap={2} sx={{ marginBottom: "24px" }}>
                    {/* Redux-Based Filters */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters2.includes("critical")}
                            onChange={(e) => handleFilterToggle2("critical", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Critical (Redux)
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters2.includes("major")}
                            onChange={(e) => handleFilterToggle2("major", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Major (Redux)
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters2.includes("minor")}
                            onChange={(e) => handleFilterToggle2("minor", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Minor (Redux)
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                            checked={selectedFilters2.includes("normal")}
                            onChange={(e) => handleFilterToggle2("normal", e)}
                        />
                        <Typography sx={{ marginLeft: "4px" }} variant="body">
                            Normal (Redux)
                        </Typography>
                    </Box>
                </Grid>
            </>
        );
    };

    return (
        <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: 20 }}>
            {layout()}
        </div>
    );
};

export default Dashboard;
