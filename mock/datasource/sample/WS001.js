var util = require('../../util.js');

module.exports = function(folderPath, wsId, params, query){
  var ret = {};
  if (params) {
    if (params[0] === "1") {
      ret = util.getJson(folderPath + 'WS001-1.json');
    } else if (params[0] === "2") {
      ret = util.getJson(folderPath + 'WS001-2.json');
    }
  }
  return ret;
};
