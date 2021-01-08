import { isNotEmpty } from '../../../util/lang'
import { stringifyQuery } from '../../../util/query'
import { ROUTER } from '../../../shared/constants'
import { addQueryParameter } from '../util'

const DIRECTION_KEY = ROUTER.DIRECTION.KEY
const FORWARD = ROUTER.DIRECTION.FORWARD

export default function push (router, originFunction) {
  return (location = {}, onComplete, onAbort) => {
    let targetLocation = location
    if (typeof targetLocation === 'object') {
      // 因设置了path的场合，params会被无视，所以通过url query string传递跳转方向(前进/后退)
      if (typeof targetLocation.path === 'string') {
        if (typeof targetLocation.query === 'object') {
          targetLocation.query[DIRECTION_KEY] = FORWARD
        } else {
          targetLocation.query = {
            [DIRECTION_KEY]: FORWARD
          }
        }
      } else if (typeof targetLocation.params === 'object') {
        // 设置了_direction的场合，使用设置的值
        if (!isNotEmpty(targetLocation.params[DIRECTION_KEY])) {
          targetLocation.params[DIRECTION_KEY] = FORWARD
        }
      } else if (typeof targetLocation === 'string') {
        targetLocation = {
          path: targetLocation,
          query: {
            [DIRECTION_KEY]: FORWARD
          }
        }
      } else {
        targetLocation.params = {
          [DIRECTION_KEY]: FORWARD
        }
      }
    // push函数的targetLocation支持两种参数类型
    } else if (typeof targetLocation === 'string') {
      targetLocation = addQueryParameter(targetLocation, DIRECTION_KEY, FORWARD)
    }
    // 跨模块跳转支持 query 参数内复杂参数的传递
    if (targetLocation.global) {
      router.generateModuleParams(targetLocation)
      // vue-router的push函数在iframe下跳转有问题，因此需要使用原生api进行iframe下的页面跳转
      // 根据路由信息取得目标跳转URL
      const path =
        targetLocation.path.indexOf('/') !== 0 ? `/${targetLocation.path}` : targetLocation.path
      const query = targetLocation.query ? stringifyQuery(targetLocation.query) : ''
      const baseUrl = router.options.base
      const href = `${baseUrl}${path}${query}`
      window.location.href = href
    } else {
      originFunction.call(router, targetLocation, onComplete, onAbort)
    }
  }
}
