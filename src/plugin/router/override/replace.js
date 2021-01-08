import { ROUTER } from '../../../shared/constants'
import { addQueryParameter } from '../util'

const DIRECTION_KEY = ROUTER.DIRECTION.KEY
const REPLACE = ROUTER.DIRECTION.REPLACE

export default function push (router, originFunction) {
  return (location, onComplete, onAbort) => {
    let targetLocation = location
    if (typeof targetLocation === 'object') {
      // 用于记录路由历史
      if (typeof targetLocation.params === 'object') {
        targetLocation.params[DIRECTION_KEY] = REPLACE
      } else {
        targetLocation.params = {
        }
        targetLocation.params[DIRECTION_KEY] = REPLACE
      }
    } else if (typeof targetLocation === 'string') {
      targetLocation = addQueryParameter(targetLocation, DIRECTION_KEY, REPLACE)
    }
    originFunction.call(router, targetLocation, onComplete, onAbort)
  }
}
