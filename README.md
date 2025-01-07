const processVEPDGNodes = (nodes)=>{
    return nodes.map((node)=>{
      if(node.nodetype === 'vepdg'){
        const kpiStats = node.stats?.OOR;
        if(kpiStats){
          if(kpiStats.att === 'InService'){
            node.priority = 'normal';
          }else if (kpiStats.att === 'OOR'){
            node.priority = 'oor';
          }else if (kpiStats.att === 'Error'){
            node.priority = 'major';
          }else {
            node.priority = 'normal';
          }
        }else{
          node.priority = 'normal';
        }
      }
      return node;
    });
  };
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
