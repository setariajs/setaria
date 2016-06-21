var expect = chai.expect;
describe('共通函数的测试', function() {
  it('测试对象为空的情况', function() {
    var obj = {};
    expect(_util.isEmpty(obj)).to.be.equal(true);
  });
  it('测试数组为空的情况', function() {
    var arr = [];
    expect(_util.isEmpty(arr)).to.be.equal(true);
  });
  it('测试对象不为空的情况', function() {
    var obj = {"a": "1"};
    expect(_util.isEmpty(obj)).to.be.equal(false);
  });
  it('测试数组不为空的情况', function() {
    var arr = [1];
    expect(_util.isEmpty(arr)).to.be.equal(false);
  });
});
