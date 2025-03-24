import React, { Fragment } from 'react';
import Node from './Node';
import { CardContent, Card, Grid, Box, Typography } from '@mui/material';
import sort_by from '../utils';

const REGIONS = {
    'WEST': ['W1', 'W2', 'W3', 'HI'],
    'CENTRAL': ['C1', 'C2', 'C3'],
    'SOUTH': ['SE', 'SE1', 'SE2', 'SE3', 'SW', 'SW1', 'SW2', 'SW3', 'PR'],
    'NORTH': ['NE', 'NE1', 'NE2', 'NE3', 'G'],
}

const NodeGroup = ({ nodes, group, keyProp }) => {
    const groupBy = 'region';
    return (
        <Fragment key={keyProp}>
            {
                Object.keys(nodes).map((region, index) => (
                    <Fragment key={index}>
                        {
                            nodes[region]?.sort(sort_by('host_name', false, (a) => a?.toUpperCase()))?.length > 0 && (
                                <Grid container key={index} style={{ padding: 0, margin: 0, border: '1px solid black', position: 'relative', flexGrow: 1 }}>
                                    <Box width={'100%'} padding={2} textAlign="center">
                                        <Typography style={{ fontWeight: 'bold', position: 'relative', border: '0 !important', minHeight: 'auto !important', backgroundColor: 'transparent !important', boxShadow: 'none', fontWeight: 'bold', fontSize: '14px' }} variant="body2">{'Pool:' + region?.toUpperCase()}</Typography>
                                    </Box>
                                    {
                                        nodes[region]?.sort(sort_by)?.map((node, nodeIndex) => (
                                            <Node groupBy={groupBy} style={{
                                                width: 'calc(16.5% - 2px)',
                                                maxHeight: 35,
                                                border: '1px solid black',
                                                borderRadius: 0,
                                                margin: '1px',
                                                padding: '1px'
                                            }} key={nodeIndex} node={node} />
                                        ))
                                    }
                                </Grid>
                            )
                        }
                    </Fragment>

                ))
            }
        </Fragment>
    );
};

export default NodeGroup;
