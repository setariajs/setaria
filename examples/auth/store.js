import { storageTypes, storeRegister } from 'setaria'

storeRegister('module1', {
  namespaced: true,
  state: {
    str: ''
  },
  mutations: {
    set_str (state, payload) {
      state.str = payload
    }
  }
}, storageTypes.LOCAL)

storeRegister('module2', {
  namespaced: true,
  state: {
    num: 0
  },
  mutations: {
    set_num (state, payload) {
      state.num = payload
    }
  }
}, storageTypes.SESSION)
