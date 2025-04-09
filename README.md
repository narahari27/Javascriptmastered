// Find the filter checkboxes section in your Dashboard.jsx file
// Replace it with this updated version with only critical, normal, and OOR filters

// This is the section to replace:
<Grid container gap={2} sx={{ marginBottom: "24px" }}>
  {/* Keep only critical, normal and OOR filters */}
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

// Also update the "Degraded Nodes" button functionality to only filter critical nodes:
const handleDegradedNodesToggle = () => {
  try {
    const newValue = !degradedNodes;
    setDegradedNodes(newValue);
    
    // Update priority filter to only include critical nodes when degraded is on
    // or include all (normal, critical, oor) when off
    setPriorityFilter(newValue ? ['critical'] : ['normal', 'critical', 'oor']);
  } catch (error) {
    console.error("Error toggling degraded nodes:", error);
  }
};

// Then find the Degraded Nodes button and update its onClick handler:
<Button
  variant="contained"
  onClick={handleDegradedNodesToggle}
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
