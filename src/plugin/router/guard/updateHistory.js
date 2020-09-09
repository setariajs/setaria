import { getStore } from '../../store/index'
import { STORE_KEY } from '../../../shared/constants'

export default function (to, from, next) {
  const store = getStore()
  const payload = {
    current: {
      url: from.fullPath,
      meta: from.meta,
      originRouteObject: from
    },
    next: {
      url: to.fullPath,
      meta: to.meta,
      originRouteObject: to
    }
  }
  store.commit(STORE_KEY.UPDATE_ROUTE_HISTORY, payload)
  next()
}
