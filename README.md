const cleanSucc = kpi.succ.trim(); // Remove any whitespace around the value

<TableCell style={cleanSucc && !isNaN(parseFloat(cleanSucc)) ? getCellStyle(kpi) : styles.tableCell}>
    {cleanSucc && !isNaN(parseFloat(cleanSucc))
        ? Number(parseFloat(cleanSucc)).toFixed(2) // Convert to a number and round to 2 decimals
        : 'null'}
</TableCell>
