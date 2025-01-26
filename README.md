useEffect(() => {
    const fetchAllData = async () => {
        setDataLoading(true);

        try {
            await Promise.all([
                fetchAllNodes(),
                fetchNest(),
                fetchStatsV2(),
                fetchNotes(),
                fetchStats15V2(),
                fetchAverageV2()
            ]);
            setDataLoading(false); // Loader stops only after all calls complete
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(true);
            setDataLoading(false); // Handle error gracefully
        }
    };

    fetchAllData();

    // Set intervals for periodic refresh
    const interval = setInterval(() => {
        fetchNest();
        fetchStatsV2();
        fetchAverageV2();
    }, 300000);

    const nodeInterval = setInterval(() => {
        fetchAllNodes();
    }, 900000);

    return () => {
        clearInterval(interval);
        clearInterval(nodeInterval);
    };
}, []);
