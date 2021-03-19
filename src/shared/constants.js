// Module
// Common
export const SETARIA_SDK_STORE_MODULE = '_setaria_common_'
export const SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG = 'systemConfig'

// Getter
export const _GETTER = {
  '_GET_INITIAL_STATE': '_setaria_initial_state',
  '_GET_IS_LOADING': '_setaria_get_is_loading',
  '_GET_LOADING_COUNT': '_setaria_get_loading_count',
  '_GET_ROUTE_HISTORY': '_setaria_get_route_history',
  '_GET_ROUTE_CURRENT_INDEX': '_setaria_get_route_current_index',
  '_GET_TARGET_ROUTE': '_setaria_get_target_route',
  '_GET_DIRECTION': '_setaria_get_direction',
  '_GET_FROM_PAGE_TYPE': '_setaria_get_from_page_type',
  '_GET_LASTEST_TRACK': '_setaria_get_lastest_track',
  '_GET_TRACK_LIST': '_setaria_get_track_list',
  '_GET_TODO_REDIRECT_URL': '_setaria_get_todo_redirect_url',
  '_GET_PAGE_FULL_NAME': 'setaria_get_page_full_name',
  '_GET_PAGE_SINGLE_NAME': 'setaria_get_page_single_name',
  '_GET_PREV_PAGE_TRACK': 'setaria_get_prev_page_track',
  '_GET_CURRENT_PAGE_MODULE': 'setaria_get_current_page_module',
  '_GET_CURRENT_REQUEST_ID': 'setaria_get_current_request_id',
  '_GET_CURRENT_ODD_NUMBER': 'setaria_get_current_odd_number',
  '_GET_DEBUG_REQUEST_LIST': 'setaria_get_debug_request_list',
  '_GET_XSRF': '_setaria_get_xsrf'
}
// Mutation
export const _MUTATION = {
  '_SET_DIRECTION': '_setaria_set_direction',
  '_ADD_LOADING_COUNT': '_setaria_add_loading_count',
  '_SUB_LOADING_COUNT': '_setaria_sub_loading_count',
  '_UPDATE_DIRECTION': '_setaria_update_direction',
  '_UPDATE_ROUTE_HISTORY': '_setaria_update_route_history',
  '_CLEAR_ROUTE_HISTORY': '_setaria_clear_route_history',
  '_SET_FROM_PAGE_TYPE': '_setaria_set_from_page_type',
  '_SET_FROM_PAGE_NAME': '_setaria_set_from_page_name',
  '_ADD_TRACK': '_setaria_add_track',
  '_UPDATE_CURRENT_PAGE_MODULE': '_setaria_update_current_page_module',
  '_ADD_ERROR': '_setaria_add_error',
  '_SET_INITIAL_STATE': '_setaria_initial_state',
  '_SET_PAGE_MODULE': '_setaria_set_page_module',
  '_SET_REQUEST_ID': '_setaria_request_id',
  '_SET_ODD_NUMBER': '_setaria_odd_number',
  '_SET_DEBUG_REQUEST_LIST': '_setaria_set_debug_request_list',
  '_CLEAR_DEBUG_REQUEST_LIST': '_setaria_clear_debug_request_list',
  '_SET_XSRF': '_setaria_set_xsrf'
}

export const STORE_KEY = {
  // Common
  SETARIA_SDK_STORE_MODULE,
  // Getters
  GET_INITIAL_STATE: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_INITIAL_STATE}`,
  GET_IS_LOADING: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_IS_LOADING}`,
  GET_LOADING_COUNT: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_LOADING_COUNT}`,
  GET_ROUTE_HISTORY: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_ROUTE_HISTORY}`,
  GET_ROUTE_CURRENT_INDEX: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_ROUTE_CURRENT_INDEX}`,
  GET_TARGET_ROUTE: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_TARGET_ROUTE}`,
  GET_DIRECTION: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_DIRECTION}`,
  GET_FROM_PAGE_TYPE: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_FROM_PAGE_TYPE}`,
  GET_FROM_PAGE_NAME: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_FROM_PAGE_NAME}`,
  GET_TRACK_LIST: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_TRACK_LIST}`,
  GET_LASTEST_TRACK: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_LASTEST_TRACK}`,
  GET_PAGE_FULL_NAME: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_PAGE_FULL_NAME}`,
  GET_PAGE_SINGLE_NAME: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_PAGE_SINGLE_NAME}`,
  GET_PREV_PAGE_TRACK: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_PREV_PAGE_TRACK}`,
  GET_LASTEST_ERROR: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_LASTEST_ERROR}`,
  GET_CURRENT_ODD_NUMBER: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_CURRENT_ODD_NUMBER}`,
  GET_CURRENT_REQUEST_ID: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_CURRENT_REQUEST_ID}`,
  GET_CURRENT_PAGE_MODULE: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_CURRENT_PAGE_MODULE}`,
  GET_DEBUG_REQUEST_LIST: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_DEBUG_REQUEST_LIST}`,
  GET_XSRF: `${SETARIA_SDK_STORE_MODULE}/${_GETTER._GET_XSRF}`,
  // Getters - SytemConfig
  GET_TODO_REDIRECT_URL: `${SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG}/${_GETTER._GET_TODO_REDIRECT_URL}`,
  // Mutations
  SET_INITIAL_STATE: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_INITIAL_STATE}`,
  SET_DIRECTION: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_DIRECTION}`,
  ADD_LOADING_COUNT: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._ADD_LOADING_COUNT}`,
  SUB_LOADING_COUNT: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SUB_LOADING_COUNT}`,
  UPDATE_DIRECTION: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._UPDATE_DIRECTION}`,
  UPDATE_ROUTE_HISTORY: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._UPDATE_ROUTE_HISTORY}`,
  CLEAR_ROUTE_HISTORY: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._CLEAR_ROUTE_HISTORY}`,
  SET_FROM_PAGE_TYPE: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_FROM_PAGE_TYPE}`,
  SET_FROM_PAGE_NAME: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_FROM_PAGE_NAME}`,
  ADD_TRACK: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._ADD_TRACK}`,
  ADD_ERROR: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._ADD_ERROR}`,
  SET_PAGE_MODULE: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_PAGE_MODULE}`,
  SET_REQUEST_ID: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_REQUEST_ID}`,
  SET_ODD_NUMBER: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_ODD_NUMBER}`,
  UPDATE_CURRENT_PAGE_MODULE: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._UPDATE_CURRENT_PAGE_MODULE}`,
  SET_DEBUG_REQUEST_LIST: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_DEBUG_REQUEST_LIST}`,
  CLEAR_DEBUG_REQUEST_LIST: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._CLEAR_DEBUG_REQUEST_LIST}`,
  SET_XSRF: `${SETARIA_SDK_STORE_MODULE}/${_MUTATION._SET_XSRF}`,
  // Mutations - SytemConfig
  LOGOUT_URL: `${SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG}/logoutUrl`,
  // Actions
  ACTION_FETCH_USER_INFO: `${SETARIA_SDK_STORE_MODULE_SYSTEM_CONFIG}/fetchUserInfo`
}

/**
 * Storage生命期类型
 * @type {Object}
 */
export const STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session'
}

export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
}

export const ERROR_PREFIX = 'Setaria Error'

export const ERROR_MSG_SPLICER = '_$:$_'

export const ERROR_THROW_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
}

export const LAST_PAGE_NAME = '__last_page_name'

export const ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX = 'ROUTER_SESSION_STORAGE'

// 日志类型
export const LOG_TYPE = {
  // 用户登录
  LOGIN: '0',
  // 填单
  CREATE: '1',
  // 审批
  APPROVAL: '2',
  // 查看
  VIEW: '3',
  // 查询
  SEARCH: '4',
  // 修改
  UPDATE: '5',
  // 用户注销
  LOGOUT: '6',
  // 转单
  TRANSFER: '7',
  // 页面加载
  PAGE_LOAD: '8'
}

export const ROUTER = {
  DIRECTION: {
    FORWARD: 'forward',
    BACK: 'back',
    REPLACE: 'replace'
  }
}

export const HTTP = {
  ADD_XSRF: 'addXsrf',
  GET_XSRF: 'getXsrf',
  INTERCEPTOR: 'interceptor',
  REQUEST: 'request',
  RESPONSE: 'response'
}

export default {
  ERROR_THROW_TYPES,
  ERROR_PREFIX,
  ERROR_MSG_SPLICER,
  MESSAGE_TYPE,
  STORE_KEY,
  STORAGE_TYPE,
  ROUTER_SESSION_STORAGE_QUERY_KEY_PREFIX,
  LOG_TYPE,
  LAST_PAGE_NAME,
  HTTP
}
