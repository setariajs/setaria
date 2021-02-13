import { _GETTER, _MUTATION, ROUTER } from '../../../shared/constants'
import { findIndex, isNotEmpty, trim, startsWith } from '../../../util/lang'
import { getRouter } from '../../router/index'

const FORWARD = ROUTER.DIRECTION.FORWARD
const BACK = ROUTER.DIRECTION.BACK
const REPLACE = ROUTER.DIRECTION.REPLACE

function getDefaultRouteHistory () {
  return {
    currentIndex: null,
    history: []
  }
}

// initial state
const state = {
  // 自定义初始化数据
  _setaria_initial_state: {
    data: null,
    error: null
  },
  _setaria_direction: '',
  _setaria_loading: 0,
  _setaria_routeHistory: getDefaultRouteHistory(),
  _setaria_from_page_type: '',
  _setaria_from_page_name: '',
  _setaria_track_history: [],
  _setaria_error_history: [],
  _setaria_page_module_list: [],
  _setaria_current_page_module: [],
  _setaria_request_id: '',
  _setaria_odd_number: '',
  _setaria_debug_request_list: []
}

function getRouteHistory (state) {
  const routeHistory = state._setaria_routeHistory
  const { currentIndex = 0, history = [] } = routeHistory
  if (history.length > currentIndex) {
    return currentIndex === 0 ? history.slice(0, 1) : history.slice(0, currentIndex + 1)
  }
  return history
}

function getPageName (state, isSingleName, separator) {
  let pageName = ''
  // 否则从路由中取得当前页面名称
  const router = getRouter()
  if (router && router.history) {
    const currentRouter = router.history.current
    if (currentRouter) {
      pageName = currentRouter.meta && currentRouter.meta.title || currentRouter.name
    }
  }
  return pageName
}

// getters
const getters = {
  /**
   * 系统自定义初始化状态
   */
  [_GETTER._GET_INITIAL_STATE]: state => state._setaria_initial_state,
  /**
   * 取得当前路由历史
   */
  [_GETTER._GET_ROUTE_HISTORY]: (state) => {
    return getRouteHistory(state)
  },
  [_GETTER._GET_ROUTE_CURRENT_INDEX]: state => state._setaria_routeHistory.currentIndex,
  [_GETTER._GET_TARGET_ROUTE]: state => (index) => state._setaria_routeHistory.history[state._setaria_routeHistory.currentIndex + index],
  [_GETTER._GET_IS_LOADING]: state => state._setaria_loading !== 0,
  [_GETTER._GET_LOADING_COUNT]: state => state._setaria_loading,
  [_GETTER._GET_DIRECTION]: state => state._setaria_direction,
  [_GETTER._GET_FROM_PAGE_TYPE]: state => state._setaria_from_page_type,
  [_GETTER._GET_FROM_PAGE_NAME]: state => state._setaria_from_page_name,
  [_GETTER._GET_PAGE_FULL_NAME]: (state, getters) => (seprator) => {
    return getPageName(state, false, seprator)
  },
  [_GETTER._GET_PAGE_SINGLE_NAME]: (state, getters) => getPageName(state, true),
  /**
   * 取得所有埋点信息
   */
  [_GETTER._GET_TRACK_LIST]: (state, getters) => {
    return state._setaria_track_history
  },
  /**
   * 取得最新的埋点信息
   */
  [_GETTER._GET_LASTEST_TRACK]: (state, getters) => {
    if (state._setaria_track_history && state._setaria_track_history.length > 0) {
      return state._setaria_track_history[state._setaria_track_history.length - 1]
    }
    return null
  },
  /**
   * 取得前页面最后一次操作信息
   */
  [_GETTER._GET_PREV_PAGE_TRACK]: (state, getters) => (currentPageName) => {
    const historyList = state._setaria_track_history || []
    if (historyList.length === 0 || !isNotEmpty(currentPageName)) {
      return null
    }
    let index = -1
    // 取得当前页的init事件记录
    for (let i = historyList.length - 1; i >= 0; i--) {
      const item = historyList[i]
      if (item.pageName === currentPageName && item.eventName === 'init') {
        index = i
        break
      }
    }
    // 没有前页面的场合
    if (index === -1 || index === 0) {
      return null
    }
    return historyList[index - 1]
  },
  /**
   * 取得最新的错误信息
   */
  [_GETTER._GET_LASTEST_ERROR]: (state) => {
    if (state._setaria_error_history && state._setaria_error_history.length > 0) {
      return state._setaria_error_history[state._setaria_error_history.length - 1]
    }
    return null
  },
  [_GETTER._GET_CURRENT_PAGE_MODULE]: (state) => {
    return state._setaria_current_page_module
  },
  [_GETTER._GET_CURRENT_REQUEST_ID]: (state) => {
    return state._setaria_request_id
  },
  [_GETTER._GET_CURRENT_ODD_NUMBER]: (state) => {
    return state._setaria_odd_number
  },
  [_GETTER._GET_DEBUG_REQUEST_LIST]: (state) => {
    return state._setaria_debug_request_list
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  /**
   * 设置系统自定义出售计划状态
   * @param {*} stateObj
   * @param {*} val
   */
  [_MUTATION._SET_INITIAL_STATE] (stateObj, { data, error }) {
    const s = stateObj
    s._setaria_initial_state.data = data
    s._setaria_initial_state.error = error
  },
  [_MUTATION._SET_DIRECTION] (stateObj, val) {
    const s = stateObj
    s._setaria_direction = val
  },
  [_MUTATION._ADD_LOADING_COUNT] (stateObj) {
    const s = stateObj
    s._setaria_loading += 1
  },
  [_MUTATION._SUB_LOADING_COUNT] (stateObj) {
    const s = stateObj
    if (s._setaria_loading > 0) {
      s._setaria_loading -= 1
    }
  },
  [_MUTATION._UPDATE_DIRECTION] (stateObj, { current, next }) {
    let direction = stateObj._setaria_direction
    const routeHistory = stateObj._setaria_routeHistory
    if (direction !== FORWARD && direction !== BACK && direction !== REPLACE) {
      if (routeHistory.history.length > 0) {
        // 当前游标处于最末尾
        if (routeHistory.currentIndex === routeHistory.history.length - 1) {
          direction = BACK
        } else {
          let path = null
          // 判断目标画面是否为前画面
          if (routeHistory.currentIndex !== 0) {
            path = routeHistory.history[routeHistory.currentIndex - 1].url
            if (path === next) {
              direction = BACK
            }
          }
          // 判断目标画面是否为次画面
          if (direction === '') {
            path = routeHistory.history[routeHistory.currentIndex + 1].url
            if (path === next) {
              direction = FORWARD
            }
          }
        }
      } else {
        direction = FORWARD
      }
      if (direction !== FORWARD && direction !== BACK) {
        direction = FORWARD
      }
      // 保存跳转方向
      stateObj._setaria_direction = direction
    }
  },
  [_MUTATION._UPDATE_ROUTE_HISTORY] (stateObj, { current, next }) {
    const direction = stateObj._setaria_direction
    const routeHistory = stateObj._setaria_routeHistory
    // 更新浏览历史
    if (direction === BACK) {
      if (routeHistory.currentIndex === 0) {
        routeHistory.currentIndex = null
      } else {
        routeHistory.history[routeHistory.currentIndex] = current
        routeHistory.currentIndex -= 1
      }
    } else if (direction === FORWARD) {
      // if (!isExistForwardPage) {
      //   if (routeHistory.currentIndex < history.length - 1) {
      //     let index = history.length - 1
      //     for (index; index > routeHistory.currentIndex; index -= 1) {
      //       history.splice(index, 1)
      //     }
      //   }
      //   history.push(currentPageFullPath)
      // } else {
      // }
      if (routeHistory.currentIndex === null) {
        routeHistory.currentIndex = 0
      } else {
        // 如果未处于队列末尾,则删除当前游标后的数据
        if (routeHistory.currentIndex < routeHistory.history.length - 1) {
          const history = routeHistory.history.splice(0, routeHistory.currentIndex + 1)
          routeHistory.history = history
        }
        routeHistory.currentIndex += 1
      }
      routeHistory.history.push(next)
    // 替换当前路由信息
    } else if (direction === REPLACE) {
      const originRouteHistory = routeHistory
      originRouteHistory.history[routeHistory.currentIndex] = next
      stateObj._setaria_routeHistory = {}
      stateObj._setaria_routeHistory = originRouteHistory
    }
    // 清空跳转方向
    stateObj._setaria_direction = ''
  },
  [_MUTATION._CLEAR_ROUTE_HISTORY] (stateObj) {
    stateObj._setaria_routeHistory = getDefaultRouteHistory()
  },
  /**
   * 设置页面打开方式
   */
  [_MUTATION._SET_FROM_PAGE_TYPE] (stateObj, val) {
    stateObj._setaria_from_page_type = val
  },
  /**
   * 设置SPA前页面名称
   */
  [_MUTATION._SET_FROM_PAGE_NAME] (stateObj, val) {
    stateObj._setaria_from_page_name = val
  },
  [_MUTATION._ADD_TRACK] (stateObj, val) {
    if (val) {
      const trackBean = val
      if (isNotEmpty(trackBean.componentLabel)) {
        trackBean.componentLabel = trim(trackBean.componentLabel)
      }
      trackBean.pageName = getPageName(stateObj, true)
      stateObj._setaria_track_history.push(trackBean)
    }
  },
  [_MUTATION._ADD_ERROR] (stateObj, val) {
    // 错误最多只保存100条
    if (stateObj._setaria_error_history && stateObj._setaria_error_history.length > 100) {
      stateObj._setaria_error_history.pop()
    }
    stateObj._setaria_error_history.push(val)
  },
  [_MUTATION._SET_PAGE_MODULE] (stateObj, val) {
    // 为空的场合，不进行后续处理
    if (!isNotEmpty(val)) {
      return
    }
    if (!isNotEmpty(val.uriContext) || !isNotEmpty(val.modules)) {
      return
    }
    const { _setaria_page_module_list } = stateObj
    const index = findIndex(_setaria_page_module_list, item => item.uriContext === val.uriContext)
    if (index === -1) {
      // 新增
      _setaria_page_module_list.push(val)
    } else {
      // 更新
      _setaria_page_module_list[index] = val
    }
  },
  [_MUTATION._UPDATE_CURRENT_PAGE_MODULE] (stateObj, val) {
    let ret = []
    let path = val
    if (isNotEmpty(path)) {
      // Internet Explorer does not provide the leading slash character in the pathname (docs/Web/API/Location instead of /docs/Web/API/Location).
      if (!startsWith('/', path)) {
        path = `/${path}`
      }
      const pageModuleList = state._setaria_page_module_list
      const index = findIndex(pageModuleList, item => path.indexOf(item.uriContext) !== -1)
      if (index !== -1) {
        ret = pageModuleList[index]['modules']
      }
    }
    stateObj._setaria_current_page_module = ret
  },
  [_MUTATION._SET_REQUEST_ID] (stateObj, val) {
    stateObj._setaria_request_id = val
  },
  [_MUTATION._SET_ODD_NUMBER] (stateObj, val) {
    stateObj._setaria_odd_number = val
  },
  [_MUTATION._SET_DEBUG_REQUEST_LIST] (stateObj, val) {
    stateObj._setaria_debug_request_list.push(val)
  },
  [_MUTATION._CLEAR_DEBUG_REQUEST_LIST] (stateObj, val) {
    stateObj._setaria_debug_request_list = []
  }
}

const modules = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
