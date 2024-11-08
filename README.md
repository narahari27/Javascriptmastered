<TableCell
    style={
        (kpi?.succ && kpi.succ !== "null" && !isNaN(parseFloat(kpi.succ.trim()))) // Exclude 'null' string
            ? getCellStyle(kpi)
            : styles.tableCell
    }
>
    {filters.nodetype === 'smsf'
        ? (kpi?.succ && kpi.succ !== "null" && !isNaN(parseFloat(kpi.succ.trim()))
            ? parseFloat(kpi.succ.trim()).toFixed(2) // Convert to number and round to 2 decimals
            : 'null') // Show 'null' if it's the string "null" or invalid number
        : (kpi?.succ && !isNaN(parseFloat(kpi.succ))
            ? parseFloat(kpi.succ).toFixed(2)
            : 'null')
    }
</TableCell>
