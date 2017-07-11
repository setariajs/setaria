var path = require('path');
var fs = require('fs');
var Mock = require('mockjs');
var config = require('./config.js');
var util = require('./util.js');
var exclude = config.exclude;

function isExclude(service) {
  var ret = false;

  for (var i = 0; i < exclude.length; i++) {
    if (exclude[i] === service) {
      ret = true;
      break;
    }
  }
  return ret;
}

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

exports.call = function(req, res) {
  var proxyPath = req.originalUrl;
  var jsonFilePath = null;
  var mockJson = null;
  if (proxyPath && proxyPath !== '' && proxyPath.indexOf('/') !== -1) {
    proxyPath = proxyPath.replace(config.baseUrl, '');
    try {
      if (!isExclude(proxyPath)) {
        if (fs.existsSync(util.getFileFullPath('./datasource/' + proxyPath + '.js'))) {
          var jsModule = requireUncached(util.getFileFullPath('./datasource/' + proxyPath + '.js'));
          var folderPath = proxyPath.substring(0, proxyPath.lastIndexOf("/") + 1);
          var webServiceId = proxyPath.substring(proxyPath.lastIndexOf("/") + 1);
          mockJson = jsModule('./datasource/' + folderPath, webServiceId, req.body, req.query);
        } else {
          jsonFilePath = util.getFileFullPath('./datasource/' + proxyPath + '.json');
          mockJson = Mock.mock(JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8')));
        }
      }
    } catch (error) {
      jsonFilePath = util.getFileFullPath('./datasource/error.json');
      mockJson = Mock.mock(JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8')));
    }
  }
  return mockJson;
};
