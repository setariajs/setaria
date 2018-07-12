// Module
// Common
export const SETARIA_STORE_MODULE = '_setaria_common_'

// Getter
export const _GETTER = {
  '_GET_IS_LOADING': '_setaria_get_is_loading',
  '_GET_LOADING_COUNT': '_setaria_get_loading_count',
  '_GET_ROUTE_HISTORY': '_setaria_get_route_history',
  '_GET_ROUTE_CURRENT_INDEX': '_setaria_get_route_current_index',
  '_GET_DIRECTION': '_setaria_get_direction'
}
// Mutation
export const _MUTATION = {
  '_SET_DIRECTION': '_setaria_set_direction',
  '_ADD_LOADING_COUNT': '_setaria_add_loading_count',
  '_SUB_LOADING_COUNT': '_setaria_sub_loading_count',
  '_UPDATE_DIRECTION': '_setaria_update_direction',
  '_UPDATE_ROUTE_HISTORY': '_setaria_update_route_history'
}

export const STORE_KEY = {
  // Common
  SETARIA_STORE_MODULE,
  GET_IS_LOADING: `${SETARIA_STORE_MODULE}/${_GETTER._GET_IS_LOADING}`,
  GET_LOADING_COUNT: `${SETARIA_STORE_MODULE}/${_GETTER._GET_LOADING_COUNT}`,
  GET_ROUTE_HISTORY: `${SETARIA_STORE_MODULE}/${_GETTER._GET_ROUTE_HISTORY}`,
  GET_ROUTE_CURRENT_INDEX: `${SETARIA_STORE_MODULE}/${_GETTER._GET_ROUTE_CURRENT_INDEX}`,
  GET_DIRECTION: `${SETARIA_STORE_MODULE}/${_GETTER._GET_DIRECTION}`,
  SET_DIRECTION: `${SETARIA_STORE_MODULE}/${_MUTATION._SET_DIRECTION}`,
  ADD_LOADING_COUNT: `${SETARIA_STORE_MODULE}/${_MUTATION._ADD_LOADING_COUNT}`,
  SUB_LOADING_COUNT: `${SETARIA_STORE_MODULE}/${_MUTATION._SUB_LOADING_COUNT}`,
  UPDATE_DIRECTION: `${SETARIA_STORE_MODULE}/${_MUTATION._UPDATE_DIRECTION}`,
  UPDATE_ROUTE_HISTORY: `${SETARIA_STORE_MODULE}/${_MUTATION._UPDATE_ROUTE_HISTORY}`
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

export const ERROR_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
}

export default {
  ERROR_TYPES,
  MESSAGE_TYPE,
  STORE_KEY,
  STORAGE_TYPE
}
