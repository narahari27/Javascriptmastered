useEffect(() => {
    if (data.length) {
      let temp = [...data];
      temp = processVEPDGNodes(temp);
      if (oor) {
        // let temp = data.filter(_ => (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found') && !(_.isCombiNode == 1 && _.stats?.RC_Value?.att !== 50 && _.stats?.RC?.att !== 50));
        temp = temp.filter((_) => {
          if(_.nodetype === 'vepdg'){
            return true;
          }
          return(
            (_.nestStatus?.toLowerCase() === 'inservice' || _.nestStatus?.toLowerCase() === 'not_found') && !(_.isCombiNode == 1
             && _.stats?.RC_Value?.att !== 50 && _.stats?.RC?.att !== 50
            ));
          });
          temp = temp.filter(_ => {
            if (_.nodetype === 'nrf') {
              return _.ntwCheck === 'ON';
            } else {
              return true
            }
          });
        setNodes(groupByPool(temp));
        setBasefilters(getFilters(temp));
        setFilteredNodes(groupByRegions(temp));
      } else {
        // console.log(data[0])
        setNodes(groupByPool(data));
        setBasefilters(getFilters(data));
        setFilteredNodes(groupByRegions(data));
      }
    }
  }, [data,oor]);
