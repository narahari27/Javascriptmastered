      <Box sx={{ p: 3, border: '1px solid #ccc', width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Node View</Typography>
        {Object.keys(filteredNodes || {}).map((region, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="h6">{region}</Typography>
            {Object.keys(filteredNodes[region] || {}).map((dc, dcIdx) => (
              <Box key={dcIdx} sx={{ ml: 2, mb: 1 }}>
                <Typography variant="subtitle1">Data Center: {dc}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2 }}>
                  {(filteredNodes[region][dc] || []).map((node, nodeIdx) => (
                    <Box 
                      key={nodeIdx}
                      sx={{ 
                        p: 1, 
                        backgroundColor: 
                          node.priority === 'critical' ? '#ff0040' :
                          node.priority === 'major' ? '#f2630a' :
                          node.priority === 'oor' ? '#0a58ca' : '#198754',
                        color: 'white',
                        borderRadius: '4px',
                        minWidth: '120px'
                      }}
                    >
                      {node.host_name}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
