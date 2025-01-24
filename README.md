const fetchStatsV2 = async () => {
    tech.forEach(t => {
      setLoadingState((prev)=>({...prev,[t]:true}));
      axiosClient.get(`/api/getNodeStats/?nodeType=${t}`).then(res => {
        const data = res?.data?.data || [];
        setError(false);
        setStatsV2((prev) => ({...prev, [t]: data}));
      }).catch(err => {
        setError(true);
        setStatsV2((prev) => ({...prev, [t]: []}));
      });
    })
    .finally(()=>{
      setLoadingState((prev)=>({...prev,[t]:false}));
    })
  }
