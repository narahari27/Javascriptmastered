if (filters.nodetype === "smsf") {
    console.log("SMSF kpi.succ (raw):", kpi.succ);
    console.log("SMSF kpi.succ isNaN:", isNaN(parseFloat(kpi.succ?.trim())));
    console.log("SMSF kpi.succ after parseFloat:", parseFloat(kpi.succ?.trim()));
}
if (filters.nodetype === "smsf") {
    const trimmedSucc = kpi.succ?.trim();
    console.log("Trimmed kpi.succ:", trimmedSucc, "Length:", trimmedSucc?.length);
}
<TableCell
    style={
        kpi?.succ &&
        kpi.succ.trim() !== "null" && // Ensure it's not the string "null"
        kpi.succ.trim() !== "" && // Ensure it's not an empty string
        !isNaN(parseFloat(kpi.succ.trim())) // Ensure it's a valid number
            ? getCellStyle(kpi)
            : styles.tableCell
    }
>
    {kpi?.succ &&
    kpi.succ.trim() !== "null" &&
    kpi.succ.trim() !== "" &&
    !isNaN(parseFloat(kpi.succ.trim()))
        ? parseFloat(kpi.succ.trim()).toFixed(2) // Convert to float and round to 2 decimals
        : "null"} // If not a valid number, show 'null'
</TableCell>
