import { store } from 'setaria'

store.registerModule('module1', {
  namespaced: true,
  state: {
    str: ''
  },
  mutations: {
    set_str (state, payload) {
      state.str = payload
    }
  }
})

store.registerModule('module2', {
  namespaced: true,
  state: {
    num: 0
  },
  mutations: {
    set_num (state, payload) {
      state.num = payload
    }
  }
})
