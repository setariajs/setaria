export default function push (router, originFunction) {
  return (location, onComplete, onAbort) => {
    // 用于记录路由历史
    if (typeof location.params === 'object') {
      location.params._direction = 'replace'
    } else {
      location.params = {
        _direction: 'replace'
      }
    }
    originFunction.call(router, location, onComplete, onAbort)
  }
}
