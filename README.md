const checkNodeTypeConditions = (node) => {
  switch (node.nodetype) {
    case "mme":
    case "amf":
      return node.stats?.RC_Value?.att !== 50 || node.stats?.RC?.att !== 50;
    case "nrf":
      return node.ntwCheck === 'ON';
    case "vepdg":
      return node.stats?.OOR?.att !== "OOR";
    case "smsf":
      return node.stats?.ModelD?.att === 'true';
    default:
      return true;
  }
};
