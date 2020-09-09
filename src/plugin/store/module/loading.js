import { merge } from '../../../util/lang'

export default {
  namespaced: true,
  state: {
    actions: {
    }
  },
  getters: {
    /**
     * 全局dispatch状态，有任一dispatch执行时，此状态为true
     */
    global (state) {
      return Object.keys(state.actions).some(name => state.actions[name] === true)
    },
    action (state, key) {
      return (key) => {
        return state.actions[key]
      }
    }
  },
  mutations: {
    updateActions (state, { name, status = false }) {
      if (typeof state.actions[name] !== 'boolean') {
        state.actions[name] = false
      }
      state.actions[name] = status
      state.actions = merge({}, state.actions)
    }
  }
}
