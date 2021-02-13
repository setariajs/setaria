import { getStore } from '../../store/index'
import { ROUTER, STORE_KEY } from '../../../shared/constants'

export default function push (router, originFunction) {
  return (location, onComplete, onAbort) => {
    const targetLocation = location
    // 记录跳转状态
    getStore().commit(STORE_KEY.SET_DIRECTION, ROUTER.DIRECTION.REPLACE)
    originFunction.call(router, targetLocation, onComplete, onAbort)
  }
}
