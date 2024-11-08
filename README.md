<TableCell style={kpi?.succ && !isNaN(parseFloat(kpi.succ)) ? getCellStyle(kpi) : styles.tableCell}>
    {kpi?.succ && !isNaN(parseFloat(kpi.succ)) ? parseFloat(kpi.succ).toFixed(2) : 'null'}
</TableCell>
