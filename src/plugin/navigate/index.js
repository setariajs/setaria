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

/**
 * 取得路由中定义的中间件
 * 注意：中间件的文件必须位于src/middleware目录下，其中src目录与node_modules位于同级目录
 * @param {String} name
 */
function getMiddleware (name) {
  let middleware = null
  try {
    middleware = require('../../../src/middleware/' + name + '.js')
    if (middleware) {
      middleware = middleware.default
    }
  } catch (e) {
    console.debug(`找不到指定的中间件${name}`, e)
  }
  return middleware
}

/**
 * 根据指定值调用Vue-Route的路由钩子函数
 * @param {Function} nextFunc
 * @param {*} val
 */
function routeNext (nextFunc, val) {
  if (val !== null && val !== undefined) {
    nextFunc(val)
  } else {
    nextFunc()
  }
}

/**
 * 取得定义了中间件的路由一览
 * @param {Array} routes
 */
function findComponentMiddleware (routes) {
  let ret = []
  routes.forEach((r) => {
    // 定义了中间件的场合
    if (!util.isEmpty(r.middleware)) {
      ret.push(r)
    // 存在子路有的场合
    } else if (!util.isEmpty(r.children)) {
      ret = ret.concat(findComponentMiddleware(r.children))
    }
  })
  return ret
}

/**
 * 判断是否为同一路由
 * @param {Object} param0 当前目标路由
 * @param {Object} param1 定义了中间件的路由
 */
function compareRoute ({ name, matched }, { name: originName, path: originPath }) {
  // 优先使用Name属性进行判断
  if (!util.isEmpty(originName)) {
    return name === originName
  // 没有定义Name属性的场合，使用path属性进行判断
  } else if (!util.isEmpty(matched) && !util.isEmpty(originPath)) {
    let routeDefinedPath = matched[matched.length - 1].path
    if (originPath.indexOf('/') !== 0) {
      matched.forEach((m) => {
        if (routeDefinedPath.indexOf(m.path) === 0) {
          routeDefinedPath = routeDefinedPath.substring(m.path.length)
        }
      })
      // 存在父路由的场合
      if (matched.length > 1) {
        if (routeDefinedPath.indexOf('/') === 0) {
          routeDefinedPath = routeDefinedPath.substring(1)
        }
      }
    }
    if (routeDefinedPath === originPath) {
      return true
    }
  }
  return false
}

export default class Navigate extends VueRouter {
  constructor (options = {}) {
    super(options)
    const self = this
    // 注册默认全局守卫
    this.beforeEach(updateDirection)
    this.beforeEach(updateHistory)
    // 注册中间件
    const globalMiddleware = []
    // 取得全局中间件
    if (typeof options.middleware === 'string') {
      const m = getMiddleware(options.middleware)
      if (typeof m === 'function') {
        globalMiddleware.push(m)
      }
    } else if (util.isArray(options.middleware)) {
      options.middleware.forEach((middleware) => {
        const m = getMiddleware(middleware)
        if (typeof m === 'function') {
          globalMiddleware.push(m)
        }
      })
    }
    // 注册全局守卫
    globalMiddleware.forEach((m) => {
      this.beforeEach((to, from, next) => {
        const result = m({
          path: to.path,
          query: to.query,
          params: to.params,
          name: to.name,
          from,
          to,
          route: self
        })
        if (result instanceof Promise) {
          result.then((res) => {
            routeNext(next, res)
          })
          .catch((err) => {
            routeNext(next, err)
          })
        } else {
          routeNext(next, result)
        }
      })
    })
    // 取得定义了中间件的路由一览
    const middlewareRouteArray = findComponentMiddleware(options.routes)
    if (!util.isEmpty(middlewareRouteArray)) {
      middlewareRouteArray.forEach((route) => {
        const m = getMiddleware(route.middleware)
        if (util.isFunction(m)) {
          this.beforeEach((to, from, next) => {
            // 判断是否为定义中间件的路由
            if (compareRoute(to, route)) {
              const result = m({
                path: to.path,
                query: to.query,
                params: to.params,
                name: to.name,
                from,
                to,
                route: self
              })
              if (result instanceof Promise) {
                result.then((res) => {
                  routeNext(next, res)
                })
                .catch((err) => {
                  routeNext(next, err)
                })
              } else {
                routeNext(next, result)
              }
            } else {
              next()
            }
          })
        }
      })
    }
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
