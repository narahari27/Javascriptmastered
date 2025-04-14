// First, make sure you have these imports at the top of your Dashboard.jsx file:
import { 
  CircularProgress, 
  Grid, 
  Stack, 
  Checkbox, 
  Button,
  Box,
  Typography,
  Card,
  CardContent
} from "@mui/material";

// Then replace the section in your Dashboard.jsx that handles the view rendering
// Find the section where you check the "view" state variable

// Grid container that holds both view types
<Grid style={{ transform: `scale(${scale})` }} container>
  {/* Pool View - Show when view is false */}
  {!view && (
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

  {/* Node View - Show when view is true - Using hardcoded data that matches your project style */}
  {view && (
    <>
      {['HYDERABAD', 'BANGALORE', 'INDORE', 'MUMBAI'].map((region) => (
        <Box
          key={region}
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
          <Card style={{
            border: '2px solid black',
            margin: '4px'
          }}>
            <CardContent>
              <Grid container spacing={1}>
                {/* Node that shows region name */}
                <Node
                  style={{
                    backgroundColor: 'lightgray', 
                    minWidth: '32.85%', 
                    minHeight: 35,
                    border: '1px solid black',
                    borderRadius: 0,
                    margin: '1px'
                  }} 
                  key={region} 
                  node={{ host_name: region }} 
                  color={'black'} 
                  bgcolor={'lightgray'} 
                  enableContextMenu={false} 
                />
                
                {/* Generate random nodes for this region */}
                {Array.from({ length: Math.floor(Math.random() * 15) + 10 }, (_, i) => {
                  // Random platform for each node
                  const platforms = ['SONY', 'ZEE', 'STAR', 'KNITE'];
                  const platform = platforms[Math.floor(Math.random() * platforms.length)];
                  
                  // Random priority with higher chance of normal
                  const priorities = ['normal', 'normal', 'normal', 'critical', 'oor'];
                  const priority = priorities[Math.floor(Math.random() * priorities.length)];
                  
                  // Create node object
                  const node = {
                    host_name: `${platform}-${region.substring(0, 3)}-${i + 1}`,
                    priority: priority,
                    nodetype: platform.toLowerCase(),
                    pool: region,
                    nestStatus: 'inservice'
                  };
                  
                  // Use your existing Node component with the same styling
                  return (
                    <Node 
                      style={{
                        minWidth: '32.85%', 
                        minHeight: 35,
                        border: '1px solid black',
                        borderRadius: 0,
                        margin: '1px'
                      }} 
                      key={`node-${region}-${i}`} 
                      node={node} 
                    />
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ))}
    </>
  )}
</Grid>
