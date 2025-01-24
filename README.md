const Dashboard = () => {
    const dispatch = useDispatch();
    const nodesData = useSelector((state) => state.nodes); // Access Redux state
    const {
        priorityFilter,
        setPriorityFilter,
        upfView,
    } = useContext(NodeContext); // Access context values

    const [selectedFilters, setSelectedFilters] = useState(priorityFilter); // Context-based filters
    const [selectedFilters2, setSelectedFilters2] = useState(nodesData.priorityFilters); // Redux-based filters

    // Context-based filter toggle
    const handleFilterToggle = (value, e) => {
        if (selectedFilters.includes(value)) {
            const updatedFilters = selectedFilters.filter((filter) => filter !== value);
            setSelectedFilters(updatedFilters);
            setPriorityFilter(updatedFilters);
        } else {
            const updatedFilters = [...selectedFilters, value];
            setSelectedFilters(updatedFilters);
            setPriorityFilter(updatedFilters);
        }
    };

    // Redux-based filter toggle
    const handleFilterToggle2 = (value, e) => {
        if (selectedFilters2.includes(value)) {
            const updatedFilters = selectedFilters2.filter((filter) => filter !== value);
            setSelectedFilters2(updatedFilters);
            dispatch(setPriorityFilter2({ filters: updatedFilters, current: nodesData }));
        } else {
            const updatedFilters = [...selectedFilters2, value];
            setSelectedFilters2(updatedFilters);
            dispatch(setPriorityFilter2({ filters: updatedFilters, current: nodesData }));
        }
    };

    return (
        <div>
            {/* Context-Based Filters */}
            <Box>
                <Typography variant="h6">Filter by Priority (Context):</Typography>
                {["normal", "major", "critical", "minor"].map((priority) => (
                    <label key={priority}>
                        <Checkbox
                            checked={selectedFilters.includes(priority)}
                            onChange={(e) => handleFilterToggle(priority, e)}
                        />
                        {priority.toUpperCase()}
                    </label>
                ))}
            </Box>

            {/* Redux-Based Filters */}
            <Box>
                <Typography variant="h6">Filter by Priority (Redux):</Typography>
                {["normal", "major", "critical", "minor"].map((priority) => (
                    <label key={priority}>
                        <Checkbox
                            checked={selectedFilters2.includes(priority)}
                            onChange={(e) => handleFilterToggle2(priority, e)}
                        />
                        {priority.toUpperCase()}
                    </label>
                ))}
            </Box>
        </div>
    );
};

export default Dashboard;
