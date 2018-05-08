// [Module]Common
export const MODULE_SETARIA_STORE = '_setaria_common_'
// Getter
export const _GET_IS_LOADING = '_setaria_get_is_loading'
export const _GET_LOADING_COUNT = '_setaria_get_loading_count'
export const _GET_ROUTE_HISTORY = '_setaria_get_route_history'
export const _GET_ROUTE_CURRENT_INDEX = '_setaria_get_route_current_index'
export const _GET_DIRECTION = '_setaria_get_direction'
// Mutation
export const _SET_DIRECTION = '_setaria_set_direction'
export const _ADD_LOADING_COUNT = '_setaria_add_loading_count'
export const _SUB_LOADING_COUNT = '_setaria_sub_loading_count'
export const _UPDATE_DIRECTION = '_setaria_update_direction'
export const _UPDATE_ROUTE_HISTORY = '_setaria_update_route_history'
// Action

// [Module]Auth
export const MODULE_AUTH = '_setaria_auth_'
// Getter
export const _GET_USER = '_setaria_get_user'
export const _GET_TOKEN = '_setaria_get_token'
// Mutation
export const _SET_TOKEN = '_setaria_set_token'
export const _SET_USER = '_setaria_set_user'
// Action

export default {
  // Common
  MODULE_SETARIA_STORE,
  GET_IS_LOADING: `${MODULE_SETARIA_STORE}/${_GET_IS_LOADING}`,
  GET_LOADING_COUNT: `${MODULE_SETARIA_STORE}/${_GET_LOADING_COUNT}`,
  GET_ROUTE_HISTORY: `${MODULE_SETARIA_STORE}/${_GET_ROUTE_HISTORY}`,
  GET_ROUTE_CURRENT_INDEX: `${MODULE_SETARIA_STORE}/${_GET_ROUTE_CURRENT_INDEX}`,
  GET_DIRECTION: `${MODULE_SETARIA_STORE}/${_GET_DIRECTION}`,
  SET_DIRECTION: `${MODULE_SETARIA_STORE}/${_SET_DIRECTION}`,
  ADD_LOADING_COUNT: `${MODULE_SETARIA_STORE}/${_ADD_LOADING_COUNT}`,
  SUB_LOADING_COUNT: `${MODULE_SETARIA_STORE}/${_SUB_LOADING_COUNT}`,
  UPDATE_DIRECTION: `${MODULE_SETARIA_STORE}/${_UPDATE_DIRECTION}`,
  UPDATE_ROUTE_HISTORY: `${MODULE_SETARIA_STORE}/${_UPDATE_ROUTE_HISTORY}`,
  MODULE_AUTH,
  // Auth
  GET_USER: `${MODULE_SETARIA_STORE}/${MODULE_AUTH}/${_GET_USER}`,
  GET_TOKEN: `${MODULE_SETARIA_STORE}/${MODULE_AUTH}/${_GET_TOKEN}`,
  SET_TOKEN: `${MODULE_SETARIA_STORE}/${MODULE_AUTH}/${_SET_TOKEN}`,
  SET_USER: `${MODULE_SETARIA_STORE}/${MODULE_AUTH}/${_SET_USER}`
}
