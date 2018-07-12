export default {
  state: {
    foo: ''
  },
  mutations: {
    set_foo (state, payload) {
      state.foo = payload
    }
  },
  modules: {
    'module1': {
      scope: 'session',
      namespaced: true,
      state: {
        foo: ''
      },
      getters: {
        get_foo: (state) => {
          return state.foo
        }
      },
      mutations: {
        set_foo (state, payload) {
          state.foo = payload
        }
      },
      modules: {
        'module1-1': {
          scope: 'local',
          namespaced: true,
          state: {
            foo: ''
          },
          getters: {
            get_foo: (state) => {
              return state.foo
            }
          },
          mutations: {
            set_foo (state, payload) {
              state.foo = payload
            }
          }
        },
        'module1-2': {
          scope: 'session',
          namespaced: true,
          state: {
            foo: ''
          },
          getters: {
            get_foo: (state) => {
              return state.foo
            }
          },
          mutations: {
            set_foo (state, payload) {
              state.foo = payload
            }
          }
        }
      }
    },
    'module2': {
      scope: 'local',
      namespaced: true,
      state: {
        foo: ''
      },
      getters: {
        get_foo: (state) => {
          return state.foo
        }
      },
      mutations: {
        set_foo (state, payload) {
          state.foo = payload
        }
      }
    }
  }
}
