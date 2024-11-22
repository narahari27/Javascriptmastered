const getKpiTableData = (techType, kpiData = []) => {
        const kpiList = hardcodedKPI[techType]?.kpi || []; // Fetch hardcoded KPI names for the tech type.

        return kpiList.map((kpiName, index) => {
            const apiKpi = kpiData.find(kpi => kpi.kpi === kpiName); // Match hardcoded KPI with API data.

            return (
                <TableRow key={`kpi-data-${index}`}>
                    <TableCell style={styles.tableCell}>{kpiName}</TableCell>
                    <TableCell style={styles.tableCell}>{apiKpi?.succ || 'null'}</TableCell>
                    <TableCell style={styles.tableCell}>{apiKpi?.avg || 'null'}</TableCell>
                    <TableCell style={styles.tableCell}>{apiKpi?.att || 'null'}</TableCell>
                    <TableCell style={styles.tableCell}>{apiKpi?.last_7_att || 'null'}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            <Table style={styles.table}>
                <TableHead style={styles.tableHead}>
                    <TableRow>
                        <TableCell style={styles.tableCell}>KPI</TableCell>
                        <TableCell style={styles.tableCell}>Success Rate</TableCell>
                        <TableCell style={styles.tableCell}>Average</TableCell>
                        <TableCell style={styles.tableCell}>Attempts</TableCell>
                        <TableCell style={styles.tableCell}>Last 7 Attempts</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Updated: Pass the hardcoded KPI tech type and data */}
                    {getKpiTableData(filters.nodetype, data?.kpi)}
                </TableBody>
            </Table>
        </>
    );
});
