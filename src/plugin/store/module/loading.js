import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    actions: {}
  },
  getters: {
    /**
     * 全局dispatch状态，有任一dispatch执行时，此状态为true
     */
    global (state) {
      return Object.keys(state.actions).some(name => state.actions[name] === true)
    }
  },
  mutations: {
    updateActions (state, { name, status = false }) {
      Vue.set(state.actions, name, status)
    }
  }
}
