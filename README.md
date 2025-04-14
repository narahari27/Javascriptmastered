// Replace the section in your Dashboard.jsx that handles the view rendering
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

  {/* Node View - Show when view is true - Using hardcoded data */}
  {view && (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Hardcoded Regions */}
      {['HYDERABAD', 'BANGALORE', 'INDORE', 'MUMBAI'].map((region) => (
        <Box
          key={region}
          sx={{
            mb: 4,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {/* Region Header */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#d6006e', 
            color: 'white',
            borderBottom: '1px solid #e0e0e0' 
          }}>
            <Typography variant="h6">{region}</Typography>
          </Box>
          
          {/* Nodes Grid */}
          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Generate 6-10 random nodes for each region */}
            {Array.from({ length: Math.floor(Math.random() * 5) + 6 }, (_, i) => {
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
                pool: region
              };
              
              // Use the existing Node component to render
              return (
                <Box key={i} sx={{ width: '150px' }}>
                  <Card
                    sx={{
                      backgroundColor: 
                        priority === 'critical' ? '#ff0040' :
                        priority === 'oor' ? '#0a58ca' : '#198754',
                      color: 'white',
                      cursor: 'pointer',
                      mb: 1
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '12px' }}>
                        {node.host_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  )}
</Grid>
