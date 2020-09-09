import { getStore } from '../../store/index'

/**
 * 跳转至登录页面
 * @param {*} path
 * @param {*} next
 */
function forwardToLoginPage (path, next) {
  next({
    name: 'globalLogin'
  })
}

export default function (checkServer = true) {
  return (to, from, next) => {
    const store = getStore()
    // 目标页面不需要登录的场合
    if (to.meta.auth === false) {
      next()
      return
    }
    if (!store.getters['systemConfig/isLogined']) {
      forwardToLoginPage(to.path, next)
      return
    }
  }
}
