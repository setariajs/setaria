// TODO the _util need implement with commonjs module.exports
var _util = require('../src/_util');
console.log(_util);
var expect = require('chai').expect;
describe('共通函数的测试', function() {
  it('测试对象', function() {
    var obj = {};
    expect(_util.isEmpty(obj)).to.be.equal(true);
  });
});
