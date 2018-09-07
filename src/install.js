import { install as httpInstall } from './plugin/http/index'
import { install as routerInstall } from './plugin/router/index'
import { install as storeInstall } from './plugin/store/index'

export let _Vue

export function install (Setaria, Vue, options) {
  return (Vue, options) => {
    if (install.installed && _Vue === Vue) return
    install.installed = true
    _Vue = Vue

    const isDef = v => v !== undefined

    Vue.mixin({
      beforeCreate () {
        if (isDef(this.$options.setaria)) {
          this._setaria = this.$options.setaria
          // this.$setaria = this._setaria
          // set store instance on vue
          this.$options.store = Setaria.getStore()
          // set router instance on vue
          this.$options.router = Setaria.getRouter()
        } else {
          this._setaria = (this.$parent && this.$parent._setaria) || this
          // this.$setaria = this._setaria
        }
      },
      destroyed () {
        // console.debug('destroyed', this.$options.setaria)
      }
    })

    // set http instance on vue
    if (Vue.prototype.$http === null || Vue.prototype.$http === undefined) {
      Object.defineProperty(Vue.prototype, '$http', {
        get () { return Setaria.getHttp() }
      })
    }

    // Object.defineProperty(Vue.prototype, '$s', {
    //   get () { return this._setaria }
    // })

    // init http
    httpInstall(Vue, options)
    // init store
    storeInstall(Vue, options)
    // init router
    routerInstall(Vue, options)
  }
}
