import store, { types } from '../../store'

export default function (to, from, next) {
  const currentPageFullPath = from.fullPath
  const nextPageFullPath = to.fullPath
  store.commit(types.UPDATE_ROUTE_HISTORY, {
    current: currentPageFullPath,
    next: nextPageFullPath
  })
  next()
}
