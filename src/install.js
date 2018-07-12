import { install as routerInstall } from './plugin/router/index'
import { install as storeInstall } from './plugin/store/index'

export let _Vue

export function install (Vue, options) {
  if (install.installed && _Vue === Vue) return
  install.installed = true
  _Vue = Vue

  const isDef = v => v !== undefined

  Vue.mixin({
    beforeCreate () {
      // console.debug('beforeCreate', this.$options.setaria)
      if (isDef(this.$options.setaria)) {
        this._setaria = this.$options.setaria
        // set store instance on vue
        this.$options.store = this._setaria.getStore()
        // set router instance on vue
        this.$options.router = this._setaria.getRouter()
      } else {
        this._setaria = (this.$parent && this.$parent._setaria) || this
      }
    },
    destroyed () {
      // console.debug('destroyed', this.$options.setaria)
    }
  })

  if (Vue.prototype.$http === null || Vue.prototype.$http === undefined) {
    Object.defineProperty(Vue.prototype, '$http', {
      get () { return this._setaria.http }
    })
  }

  Object.defineProperty(Vue.prototype, '$s', {
    get () { return this._setaria }
  })

  // init store
  storeInstall(Vue, options)
  // init router
  routerInstall(Vue, options)
}
