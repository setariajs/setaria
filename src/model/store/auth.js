import config from '../../config/index'
import { initState } from './util'
import { MODULE_SETARIA_STORE, MODULE_AUTH, _GET_USER, _GET_TOKEN, _SET_USER, _SET_TOKEN } from './types'

const name = MODULE_AUTH
const syncObjectPath = `${MODULE_SETARIA_STORE}/${name}`
if (config) {
  config.storeSync[syncObjectPath] = config.auth.storageMode
}
// initial state
const state = initState({
  _setaria_token: '',
  _setaria_user: null
}, syncObjectPath, config.auth.storageMode)

// getters
const getters = {
  [_GET_USER]: state => state._setaria_user,
  [_GET_TOKEN]: state => state._setaria_token
}

// actions
const actions = {
}

// mutations
const mutations = {
  [_SET_TOKEN] (stateObj, val) {
    const s = stateObj
    s._setaria_token = val
  },
  [_SET_USER] (stateObj, val) {
    const s = stateObj
    s._setaria_user = val
  }
}

export default {
  namespaced: true,
  name,
  state,
  getters,
  actions,
  mutations
}
