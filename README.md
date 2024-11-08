<TableCell style={kpi?.succ ? getCellStyle(kpi) : styles.tableCell}>
    {kpi?.succ && !isNaN(parseFloat(kpi.succ))
        ? Number(parseFloat(kpi.succ)).toFixed(2) // Convert to a number and round to 2 decimals
        : 'null'} // If the value cannot be converted to a number, show 'null'
</TableCell>
