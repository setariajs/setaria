import VueRouter from 'vue-router'
// import config from '../../config/index'
// import ApplicationError from '../../model/ApplicationError'
// import util from '../../util'

// function getDirection (to, from, next) {
//   const params = to.params
//   const currentPageFullPath = from.fullPath
//   let direction = store.state.common.direction
//   let isExistForwardPage = false
//   const nextPageFullPath = to.fullPath
//   const history = routeHistroy.history
//   if (params && params.$$direction === 'forward') {
//     direction = 'forward'
//     // 保存跳转方向
//     store.commit('common/direction', direction)
//   }
//   // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
//   if (direction !== 'forward' && direction !== 'back') {
//     if (history.length === 0) {
//       routeHistroy.currentIndex = 0
//       history.push(currentPageFullPath)
//       next()
//       return
//     }
//     if (history.length > 0) {
//       // 当前游标处于最末尾
//       if (routeHistroy.currentIndex === history.length - 1) {
//         const path = history[routeHistroy.currentIndex]
//         // 跳转画面的路径为前画面的场合
//         if (path === nextPageFullPath) {
//           direction = 'back'
//         } else {
//           direction = 'forward'
//         }
//       // 当前画面拥有次画面
//       } else {
//         let path = null
//         // 判断目标画面是否为前画面
//         if (routeHistroy.currentIndex !== 0) {
//           path = history[routeHistroy.currentIndex]
//           if (path === nextPageFullPath) {
//             direction = 'back'
//           }
//         }
//         // 判断目标画面是否为次画面
//         if (direction === '') {
//           path = history[routeHistroy.currentIndex + 1]
//           if (path === nextPageFullPath) {
//             direction = 'forward'
//             isExistForwardPage = true
//           }
//         }
//       }
//       // 保存跳转方向
//       store.commit('common/direction', direction)
//     }
//   }
//
//   if (direction === '') {
//     direction = 'forward'
//     // 保存跳转方向
//     store.commit('common/direction', direction)
//   }
//
//   // 更新浏览历史
//   if (direction === 'back') {
//     if (routeHistroy.currentIndex === 0) {
//       routeHistroy.currentIndex = null
//     } else {
//       history[routeHistroy.currentIndex] = currentPageFullPath
//       routeHistroy.currentIndex -= 1
//     }
//   } else if (direction === 'forward') {
//     if (!isExistForwardPage) {
//       if (routeHistroy.currentIndex < history.length - 1) {
//         let index = history.length - 1
//         for (index; index > routeHistroy.currentIndex; index -= 1) {
//           history.splice(index, 1)
//         }
//       }
//       history.push(currentPageFullPath)
//     } else {
//       history[routeHistroy.currentIndex + 1] = currentPageFullPath
//     }
//     routeHistroy.currentIndex += 1
//   }
//   next()
// }

export function install (Vue) {
  if (install.installed) {
    return
  }
  install.installed = true
  VueRouter.install(Vue)
  Vue.mixin({
    destroyed () {
      this.$store.commit('common/direction', '')
    }
  })
}
