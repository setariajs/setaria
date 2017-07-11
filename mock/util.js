var path = require('path');
var fs = require('fs');
var Mock = require('mockjs');

module.exports = {
  getFileFullPath: function(filePath) {
    return path.resolve(__dirname, filePath);
  },
  getJson: function(jsonFilePath) {
    var jsonFileFullPath = this.getFileFullPath(jsonFilePath);
    return Mock.mock(JSON.parse(fs.readFileSync(jsonFileFullPath, 'utf-8')))
  }
};
