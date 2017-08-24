// TODO: 引入Router的方式不太恰当，但在navigate插件中需要注册路由全局钩子，不知该如何取得router对象
// 限制1: 不支持同一路由不同参数间画面的跳转 /user/1 -> /user/2
// 限制2: 不支持<router-link>的方式跳转，且此链接内如果定义path，则params不生效（vue-router的限制）
// 限制3: 新增<navi-link>用于定义静态路由链接。
import VueRouter from 'vue-router'
import { install } from './install'
import updateDirection from './guard/updateDirection'
import updateHistory from './guard/updateHistory'
import store from '../store'

export default class Navigate extends VueRouter {
  constructor (options = {}) {
    super(options)
    // 注册全局路由钩子
    this.beforeEach(updateDirection)
    this.beforeEach(updateHistory)
    // this.afterEach(() => {
    //   store.commit('common/direction', '')
    // })
  }

  forwardTo (name, params = {}, query = {}) {
    // 删除
    // if (this.routeHistroy.currentIndex !== this.routeHistroy.history.length - 1) {
    //   let index = this.routeHistroy.history.length - 1
    //   for (index; index > this.routeHistroy.currentIndex; index -= 1) {
    //     this.routeHistroy.history.splice(index - 1, 1)
    //   }
    // }
    // this.routeHistroy.history.push(this.currentRoute.fullPath)
    // this.routeHistroy.currentIndex = this.routeHistroy.history.length - 1
    store.commit('common/direction', 'forward')
    this.push({
      name,
      params,
      query
    })
  }

  backTo () {
    super.back()
  }

  back () {
    store.commit('common/direction', 'back')
    super.back()
  }

  forward () {
    store.commit('common/direction', 'forward')
    super.forward()
  }
}
Navigate.install = install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Navigate)
}
