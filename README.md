import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setFilters as setFilters2,
    setPriorityFilter as setPriorityFilter2,
    setNestData,
} from "../reducers/nodeSlice";
import {
    CircularProgress,
    Grid,
    Box,
    Checkbox,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
} from "@mui/material";
import { NodeContext } from "../NodeContext";
import Region from "./Region";
import Region2 from "./Region2";

const Dashboard = () => {
    const dispatch = useDispatch();
    const nodesData = useSelector((state) => state.nodes); // Redux state
    const {
        nodes,
        filteredNodes,
        filters,
        basefilters,
        setFilters,
        resetFilters,
        priorityFilter,
        setPriorityFilter,
        upfView, // Toggle for UPF view
    } = useContext(NodeContext); // Access NodeContext

    const [selectedFilters, setSelectedFilters] = useState(priorityFilter); // Context filters
    const [selectedFilters2, setSelectedFilters2] = useState(nodesData.priorityFilters); // Redux filters

    useEffect(() => {
        setSelectedFilters(priorityFilter); // Sync context filters
    }, [priorityFilter]);

    useEffect(() => {
        setSelectedFilters2(nodesData.priorityFilters); // Sync Redux filters
    }, [nodesData.priorityFilters]);

    /**
     * Handle filter toggle for mobility view (context-based).
     * @param {string} value - The priority to toggle.
     */
    const handleFilterToggle = (value) => {
        const updatedFilters = selectedFilters.includes(value)
            ? selectedFilters.filter((filter) => filter !== value)
            : [...selectedFilters, value];

        setSelectedFilters(updatedFilters);
        setPriorityFilter(updatedFilters); // Update NodeContext
    };

    /**
     * Handle filter toggle for UPF view (Redux-based).
     * @param {string} value - The priority to toggle.
     */
    const handleFilterToggle2 = (value) => {
        const updatedFilters = selectedFilters2.includes(value)
            ? selectedFilters2.filter((filter) => filter !== value)
            : [...selectedFilters2, value];

        setSelectedFilters2(updatedFilters);
        dispatch(setPriorityFilter2({ filters: updatedFilters, current: nodesData })); // Update Redux
    };

    /**
     * Render filters for mobility or UPF view.
     */
    const renderFilters = () => {
        const handleToggle = upfView ? handleFilterToggle2 : handleFilterToggle;
        const activeFilters = upfView ? selectedFilters2 : selectedFilters;

        return (
            <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
                {["critical", "major", "minor", "normal"].map((priority) => (
                    <Box sx={{ display: "flex", alignItems: "center" }} key={priority}>
                        <Checkbox
                            checked={activeFilters.includes(priority)}
                            onChange={() => handleToggle(priority)}
                        />
                        <Typography sx={{ marginLeft: "4px" }}>{priority.toUpperCase()}</Typography>
                    </Box>
                ))}
            </Grid>
        );
    };

    /**
     * Render nodes or racks based on the view (mobility or UPF).
     */
    const renderNodes = () => {
        if (upfView) {
            return (
                <Grid container spacing={2}>
                    {Object.keys(nodesData.nodes || {}).map((region, index) => (
                        <Region2
                            key={index}
                            region={region}
                            nodes={nodesData.nodes[region]} // Use UPF-specific nodes
                        />
                    ))}
                </Grid>
            );
        } else {
            return (
                <Grid container spacing={2}>
                    {Object.keys(nodes || {}).map((region, index) => (
                        <Region
                            key={index}
                            region={region}
                            nodes={nodes[region]} // Use mobility-specific nodes
                        />
                    ))}
                </Grid>
            );
        }
    };

    return (
        <Box sx={{ padding: "24px" }}>
            {renderFilters()}
            {renderNodes()}
            {nodesData.loading && (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
};

export default Dashboard;
