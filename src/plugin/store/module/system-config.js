// import { getHttp } from '../../http'
import { _GETTER } from '../../../shared/constants'
import { clone, merge } from '../../../util/lang'

function getDefaultUserInfoObject () {
  return {
    employeeName: '',
    id: '',
    type: '',
    userId: '',
    email: ''
  }
}

const state = {
  userInfo: getDefaultUserInfoObject(),
  logoutUrl: '',
  todoRedirectUrl: ''
}

const getters = {
  user: state => {
    return clone(state.userInfo)
  },
  isLogined: state => {
    return state.userInfo.userId && state.userInfo.userId !== ''
  },
  logoutUrl: state => state.logoutUrl,
  [_GETTER._GET_TODO_REDIRECT_URL]: state => state.todoRedirectUrl
}

const mutations = {
  setUser (stateObj, val) {
    const s = stateObj
    const userInfo = val || getDefaultUserInfoObject()
    s.userInfo = merge(s.userInfo, userInfo)
  },
  setLogoutUrl (stateObj, val) {
    const s = stateObj
    s.logoutUrl = val
  }
}

const actions = {
  /**
   * 取得用户信息
   *
   * @param {*} context
   * @returns
   */
  fetchUserInfo (context) {
    return new Promise((resolve) => {
      resolve({
        id: 'test'
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
