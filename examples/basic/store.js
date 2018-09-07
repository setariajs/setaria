import Setaria from 'setaria'

export default {
  state: {
    form: {
      foo: ''
    }
  },
  mutations: {
    set_foo (state, payload) {
      state.form.foo = payload
    }
  },
  actions: {
    fetch ({ commit }, payload) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('set_foo', payload)
          Setaria.getStore().commit('loading/updateActions', {
            name: 'fetch',
            status: true
          })
          resolve()
        }, 2500)
      })
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
          },
          modules: {
            'module1-1-1': {
              actions: {
                dispatch_foo ({ commit }, payload) {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      commit('set_foo', payload)
                      resolve()
                    }, 10000)
                  })
                },
                global_dispatch_foo: {
                  root: true,
                  handler (context, payload) {
                    return new Promise((resolve) => {
                      context.dispatch('fetch', 'async-foo', { root: true })
                        .then(() => {
                          setTimeout(() => {
                            context.commit('set_foo', payload, { root: true })
                            resolve()
                          }, 2000)
                        })
                    })
                  }
                }
              }
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
