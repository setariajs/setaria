import { install as httpInstall } from './plugin/http/index'
import { install as routerInstall } from './plugin/router/index'
import { install as storeInstall } from './plugin/store/index'
import { install as i18nInstall } from './plugin/i18n/index'
import { install as initialStateInstall } from './plugin/initial-state/index'
import config from './core/config'
import { LOG_TYPE, STORE_KEY } from './shared/constants'
import { findIndex, isNotEmpty } from './util/lang'

export let _Vue

export function install(Setaria, Vue, options) {
  return (Vue, options) => {
    if (install.installed && _Vue === Vue) return
    install.installed = true
    _Vue = Vue
    const isDef = v => v !== undefined
    if (!isDef(Vue.prototype.$setaria)) {
      Vue.prototype.$setaria = {
        api: {},
      }
    }

    Vue.mixin({
      beforeCreate() {
        if (isDef(this.$options.sdk)) {
          this._sdk = this.$options.sdk
          // set store instance on vue
          this.$options.store = Setaria.getStore()
          // set router instance on vue
          this.$options.router = Setaria.getRouter()

          this.$options.i18n = Setaria.getI18n()

        } else {
          this._sdk = (this.$parent && this.$parent._sdk) || this
        }
      },
      destroyed() {
        // console.error('destroyed', this.$options.sdk)
      }
    })

    // init http
    httpInstall(Vue, options)
    // init store
    storeInstall(Vue, options)
    // init router
    routerInstall(Vue, options)
    // init i18n
    i18nInstall(Vue, options)
    // init vue app
    initialStateInstall(Setaria, Vue, options)

    Vue.mixin({
      beforeRouteEnter(to, from, next) {
        const loadStartTime = new Date().getTime()
        next((vm) => {
          if (vm && vm.$options) {
            const currentComponentName = vm.$options.name || ''
            const excludeComponentArray = config.excludeRecordPageLoadTimeComponentName || []
            if (findIndex(excludeComponentArray, item => item === currentComponentName) === -1) {
              const currentTime = new Date().getTime()
              const pageName = vm.$store.getters[STORE_KEY.GET_PAGE_FULL_NAME](',')
              if (typeof config.logHandler === 'function') {
                try {
                  config.logHandler(pageName, LOG_TYPE.PAGE_LOAD, currentTime - loadStartTime, vm)
                } catch (e) {
                  // do nothing
                }
              }
              console.log(`${pageName} 页面加载耗时 ${currentTime - loadStartTime}ms`)
            }
          }
        })
      }
    })

    // set http instance on vue
    if (Vue.prototype.$api === null || Vue.prototype.$api === undefined) {
      Object.defineProperty(Vue.prototype, '$api', {
        get() { return Setaria.getHttp() }
      })
    }

    // 系统信息处理
    // 保存工程子模块url与模块属性的映射关系
    const { moduleUrlRules } = config
    if (isNotEmpty(moduleUrlRules)) {
      Object.keys(moduleUrlRules).forEach((rule) => {
        Setaria.getStore().commit(STORE_KEY.SET_PAGE_MODULE, {
          uriContext: rule,
          modules: moduleUrlRules[rule]
        })
      })
    }
  }
}
