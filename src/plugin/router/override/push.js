import { isNotEmpty } from '../../../util/lang'
import { stringifyQuery } from '../../../util/query'

export default function push (router, originFunction) {
  return (location = {}, onComplete, onAbort) => {
    // 因设置了path的场合，params会被无视，所以通过url query string传递跳转方向(前进/后退)
    if (typeof location.path === 'string') {
      if (typeof location.query === 'object') {
        location.query._direction = 'forward'
      } else {
        location.query = {
          _direction: 'forward'
        }
      }
    } else if (typeof location.params === 'object') {
      // 设置了_direction的场合，使用设置的值
      if (!isNotEmpty(location.params._direction)) {
        location.params._direction = 'forward'
      }
    } else {
      location.params = {
        _direction: 'forward'
      }
    }
    // 跨模块跳转支持 query 参数内复杂参数的传递
    if (location.global) {
      router.generateModuleParams(location)
      // vue-router的push函数在iframe下跳转有问题，因此需要使用原生api进行iframe下的页面跳转
      // 根据路由信息取得目标跳转URL
      const path =
        location.path.indexOf('/') !== 0 ? `/${location.path}` : location.path
      const query = location.query ? stringifyQuery(location.query) : ''
      const baseUrl = router.options.base
      const href = `${baseUrl}${path}${query}`
      window.location.href = href
    } else {
      originFunction.call(router, location, onComplete, onAbort)
    }
  }
}
