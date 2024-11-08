<TableCell style={kpi?.succ && !isNaN(parseFloat(kpi.succ)) ? getCellStyle(kpi) : styles.tableCell}>
    {kpi?.succ && !isNaN(parseFloat(kpi.succ))
        ? parseFloat(kpi.succ).toFixed(2) // Convert to float and round to 2 decimals
        : 'null'} // If not a valid number, show 'null'
</TableCell>
