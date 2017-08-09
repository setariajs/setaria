import store from '../../store'

export default function (to, from, next) {
  const currentPageFullPath = from.fullPath
  const nextPageFullPath = to.fullPath
  store.commit('common/updateHistory', {
    current: currentPageFullPath,
    next: nextPageFullPath
  })
  next()
}
