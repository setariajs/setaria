import { getStore } from '../../store/index'
import { ROUTER, STORE_KEY } from '../../../shared/constants'

export default function back (router, originFunction) {
  return (location, onComplete, onAbort) => {
    const targetLocation = location
    getStore().commit(STORE_KEY.SET_DIRECTION, ROUTER.DIRECTION.BACK)
    originFunction.call(router, targetLocation, onComplete, onAbort)
  }
}
