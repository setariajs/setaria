// TODO: 引入Router的方式不太恰当，但在navigate插件中需要注册路由全局钩子，不知该如何取得router对象
// 限制1: 不支持同一路由不同参数间画面的跳转 /user/1 -> /user/2
// 限制2: 不支持<router-link>的方式跳转，且此链接内如果定义path，则params不生效（vue-router的限制）
// 限制3: 新增<navi-link>用于定义静态路由链接。
import Vue from 'vue'
import VueRouter from 'vue-router'
import { install } from './install'
import updateDirection from './guard/updateDirection'
import updateHistory from './guard/updateHistory'
import store, { types } from '../store'
import util from '../../util'

export default class Navigate extends VueRouter {
  constructor (options = {}) {
    super(options)
    // 注册默认全局守卫
    this.beforeEach(updateDirection)
    this.beforeEach(updateHistory)

    this.afterEach(() => {
      store.commit(types.SET_DIRECTION, '')
    })
  }

  forwardTo (name, params = {}, query = {}) {
    store.commit(types.SET_DIRECTION, 'forward')
    if (util.isObject(name)) {
      this.push(name)
    } else {
      this.push({
        name,
        params,
        query
      })
    }
  }

  backTo () {
    super.back()
  }

  back () {
    store.commit(types.SET_DIRECTION, 'back')
    super.back()
  }

  forward () {
    store.commit(types.SET_DIRECTION, 'forward')
    super.forward()
  }
}

Navigate.install = install
if (typeof window !== 'undefined') {
  Vue.use(Navigate)
}
