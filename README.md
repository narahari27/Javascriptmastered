<TableCell
    style={
        kpi?.succ && !isNaN(parseFloat(kpi.succ.trim())) // Use `trim()` to remove whitespace
            ? getCellStyle(kpi)
            : styles.tableCell
    }
>
    {filters.nodetype === 'smsf' 
        ? // Special handling for "smsf" tech type
          (kpi?.succ && !isNaN(parseFloat(kpi.succ.trim()))
            ? parseFloat(kpi.succ.trim()).toFixed(2) // Trim, convert to float, and round to 2 decimals
            : 'null')
        : // Default handling for other tech types
          (kpi?.succ && !isNaN(parseFloat(kpi.succ))
            ? parseFloat(kpi.succ).toFixed(2)
            : 'null')
    }
</TableCell>
