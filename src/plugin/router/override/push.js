import { getStore } from '../../store/index'
import { stringifyQuery } from '../../../util/query'
import { ROUTER, STORE_KEY } from '../../../shared/constants'

export default function push (router, originFunction) {
  return (location = {}, onComplete, onAbort) => {
    getStore().commit(STORE_KEY.SET_DIRECTION, ROUTER.DIRECTION.FORWARD)
    const targetLocation = location
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
