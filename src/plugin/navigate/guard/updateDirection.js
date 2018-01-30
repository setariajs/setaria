import store, { types } from '../../store'

export default function (to, from, next) {
  const params = to.params
  const currentPageFullPath = from.fullPath
  let direction = store.state[types.GET_DIRECTION]
  const nextPageFullPath = to.fullPath
  if (params && params.$$direction === 'forward') {
    direction = 'forward'
    // 保存跳转方向
    store.commit(types.SET_DIRECTION, direction)
  }
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit(types.UPDATE_DIRECTION, {
    current: currentPageFullPath,
    next: nextPageFullPath
  })
  // if (direction === '') {
  //   direction = 'forward'
  //   // 保存跳转方向
  //   store.commit('common/direction', direction)
  // }
  next()
}
