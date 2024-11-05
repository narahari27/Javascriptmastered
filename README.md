 <InputLabel id="nodetype-label">Tech Type</InputLabel>
                      <Select
                        labelid="nodetype-label"
                        id="tech_type"
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
