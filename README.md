useEffect(() => {
    if (data.length) {
      // let temp = processVEPDGNodes([...data]);
      if (!oor) {
        let temp = data.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found'));
        temp = temp.filter((_) => (_?.priority !== 'oor'));
        
        //   if (_.nodetype === "mme"){
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === "amf") {
        //     return ( _.stats?.RC_Value?.att != 50 || _.stats?.RC?.att != 50)
        //   } else if (_.nodetype === 'nrf') {
        //     return _.ntwCheck === 'ON';
        //   } else if (_.nodetype === "vepdg") {
        //     return _.stats?.OOR?.att !== "OOR"
        //   } else if (_.nodetype === "smsf") {
        //     return _.stats?.ModelD?.att === 'true'
        //   } else {
        //     return _
        //   }
        // });
        setNodes(groupByPool(temp));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(temp));
      } else {
        setNodes(groupByPool(data));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(data));
      }
    }
  }, [data, oor, priorityFilter]);
