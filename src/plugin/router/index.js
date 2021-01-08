/* @flow */
import VueRouter from 'vue-router'
import { getStore } from '../store/index'
import config from '../../core/config'
import ApplicationError from '../../global-object/ApplicationError'
import constants, { ROUTER } from '../../shared/constants'
import TrackDto from '../store/dto/TrackDto'
import { findIndex, isNotEmpty, keys, isArray } from '../../util/lang'
import pushFunction from './override/push'
import replaceFunction from './override/replace'
import updateDirection from './guard/updateDirection'
import updateHistory from './guard/updateHistory'
import {
  getQueryValueByStorageKey,
  getQueryParameter,
  isStorageKeyExistInQueryParameter,
  supportsPushState,
  generateStorageKeyByUrlQueryAttribute,
  setQueryValueByStorageKey
} from './util'

const DIRECTION_KEY = ROUTER.DIRECTION.KEY
const BACK = ROUTER.DIRECTION.BACK

let router

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
const defaultScrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}

    // return new Promise(resolve => {
    // check if any matched route config has meta that requires scrolling to top
    const index = findIndex(to.matched, m => m.meta.scrollToTop)
    let selector = null
    if (index !== -1) {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      selector = to.matched[index].meta.selector
      if (typeof selector === 'string') {
        if (document.querySelector(selector).scrollTo) {
          document.querySelector(selector).scrollTo(0, 0)
        } else {
          document.querySelector(selector).scrollTop = 0
        }
        return false
      }
    }

    return new Promise(resolve => {
      if (selector === null) {
        position.x = 0
        position.y = 0
        resolve(position)
      }
    })
    // resolve(position)
    // // wait for the out transition to complete (if necessary)
    // this.app.$root.$once('triggerScroll', () => {
    //   // if the resolved position is falsy or an empty object,
    //   // will retain current scroll position.
    //   resolve(position)
    // })
    // })
  }
}

const getRouterBase = function (router) {
  let base = router.options.base
  if (base.indexOf('/') !== 0) {
    base = `/${base}`
  }
  if (base.charAt(base.length - 1) === '/') {
    base = base.substring(0, base.length - 1)
  }
  return base
}

export function install (Vue, options) {
  console.debug('router install')
  // 安装VueRouter
  Vue.use(VueRouter)
  if (config.routes) {
    const { routes, scrollBehavior } = config.routes
    // 没有设置scrollBehavior的场合，使用默认scrollBehavior
    if (scrollBehavior === undefined || scrollBehavior === null) {
      config.routes.scrollBehavior = defaultScrollBehavior
    }
    if (routes && routes.length > 0) {
      // 404
      if (routes[routes.length - 1]) {
        const lastestRoute = routes[routes.length - 1]
        // 没有定义404页面的且使用html5 history模式的场合，添加全局默认404页面
        if (config.routes.mode === 'history' && lastestRoute.path !== '*') {
          routes.push({
            path: '*',
            component: { template: '<div>404</div>' }
          })
        }
      }
    }
  }
  // 创建Vue Router实例
  router = new VueRouter(config.routes)
  // 从url parameter中取得&保存系统信息
  router.beforeEach((to, from, next) => {
    // 保存非SPA前页面信息
    const lastPageName = getQueryParameter(constants.LAST_PAGE_NAME)
    if (isNotEmpty(lastPageName)) {
      getStore().commit(constants.STORE_KEY.SET_FROM_PAGE_NAME, lastPageName)
    }
    next()
  })
  // 更新跳转方向（前进/后退）
  router.beforeEach(updateDirection)
  // 添加页面浏览历史
  router.beforeEach(updateHistory)
  // 埋点增加页面初始化操作
  router.beforeEach((to, from, next) => {
    let base = router.options.base
    if (!isNotEmpty(base)) {
      next()
      return
    }
    base = getRouterBase(router)
    const pathname = `${base}${to.path}`
    getStore().commit(constants.STORE_KEY.UPDATE_CURRENT_PAGE_MODULE, pathname)
    const fromRouteTitle = from && from.meta ? from.meta.title : ''
    const toRouteTitle = to && to.meta ? to.meta.title : ''
    const trackDto = new TrackDto('', '', 'init', toRouteTitle, fromRouteTitle, to.query)
    getStore().commit(constants.STORE_KEY.ADD_TRACK, trackDto)
    let currentPageName = getStore().getters[constants.STORE_KEY.GET_CURRENT_PAGE_MODULE] || []
    currentPageName = currentPageName.map(item => item.label).concat(toRouteTitle).join(',')
    console.log('当前页面[pageName]:', currentPageName)
    next()
  })
  // 模块间跳转时，可能存在需要传递大量参数的场景，此时跳转前值会存入SessionStorage，执行跳转动作后，在此处判断Storage内是否存在保存的query值
  router.beforeEach((to, from, next) => {
    // 模块首次渲染的场合
    if (to.query) {
      keys(to.query).forEach((queryKey) => {
        const queryValue = to.query[queryKey]
        // 存在query专有key，之前保存时框架会加入前缀
        if (isStorageKeyExistInQueryParameter(queryValue)) {
          const val = getQueryValueByStorageKey(queryValue)
          if (val) {
            to.query[queryKey] = val
          }
        }
      })
    }
    next()
  })
  // 同步用户信息
  router.beforeEach((to, from, next) => {
    const store = getStore()
    store.dispatch(constants.STORE_KEY.ACTION_FETCH_USER_INFO)
      .then(() => {
        next()
      })
      .catch(() => {
        // 开发环境的场合
        if (process.env.NODE_ENV === 'development') {
          next()
        } else {
          // 失败的场合跳转至登陆页面
          window.alert('无法取得用户信息')
        }
      })
  })
  const originPushFunction = router.push
  const originReplaceFunction = router.replace
  // 覆写push函数，实现路由历史记录，四期模块间和跳转至三期页面，通过tab页打开目标页面的功能
  router.push = pushFunction(router, originPushFunction)
  // 覆写replace函数，实现路由历史记录功能
  router.replace = replaceFunction(router, originReplaceFunction)
  // 当页面被iframe加载且浏览器网页上存在多个iframe时，iframe内页面的跳转会被vue-router通过记录到
  if (window.top !== window && supportsPushState()) {
    window.history.pushState = (state, title, url) => {
      // console.log(state, title, url)
    }
    window.history.go = (index) => {
      try {
        const targetRoute = getStore().getters[constants.STORE_KEY.GET_TARGET_ROUTE](index)
        if (targetRoute) {
          const originRouteObject = targetRoute.originRouteObject
          if (originRouteObject) {
            originRouteObject
            const {
              name,
              query,
              params = {}
            } = originRouteObject
            params[DIRECTION_KEY] = BACK
            getRouter().push({
              name,
              query,
              params
            })
          } else {
            router.close()
          }
        } else {
          router.close()
        }
      } catch (err) {
        throw new ApplicationError('SYSMSG-ROUTE-NOT-EXIST')
      }
    }
  }

  /**
   * 手动生产跨模块间的传参
   * @params location 跳转对象路由信息
  */
  router.generateModuleParams = function (location: any) {
    if (location.query && typeof location.query === 'object') {
      keys(location.query).forEach(key => {
        if (location.query[key] !== null &&
          (typeof location.query[key] === 'object' || isArray(location.query[key]))) {
          const newKey = generateStorageKeyByUrlQueryAttribute(location.path, key)
          // 因浏览器对于url长度的限制(IE:2083, Chrome:8182)，复杂数据将放入SessionStorage保存
          setQueryValueByStorageKey(newKey, location.query[key])
          location.query[key] = newKey
        }
      })
    }
    return location
  }
}

export function getRouter () {
  return router
}
