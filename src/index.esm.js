import { install } from './install'
import { init as initHttp } from './global-api/Http'
import config from './core/config'
import ErrorHandler from './core/ErrorHandler'
import http from './global-api/Http'
import ApplicationError from './global-object/ApplicationError'
import Message from './global-object/Message'
import ServiceError from './global-object/ServiceError'
import { getStore } from './plugin/store/index'
import { getRouter } from './plugin/router/index'
import setariaMessage from './resource/message'
import constants from './shared/constants'
import { inBrowser } from './util/dom'
import { isNotEmpty, merge } from './util/lang'

class Setaria {
  constructor (options = {}) {
    this.initConfig(options)
    this.initGlobalApi()
    ErrorHandler.init()
  }

  initGlobalApi () {
    // config
    const configDef = {}
    configDef.get = () => config
    if (process.env.NODE_ENV !== 'production') {
      configDef.set = () => {
        console.warn(
          'Do not replace the Setaria.config object, set individual fields instead.'
        )
      }
    }
    Object.defineProperty(Setaria, 'config', configDef)

    initHttp()
  }

  initConfig ({ message = {}, http = {}, routes = {}, store = {}, storeScopeKey }) {
    config.message = merge(setariaMessage, message)
    config.http = http || {}
    config.routes = routes || {}
    config.store = store || {}
    // Vuex Store Scope Key
    if (isNotEmpty(storeScopeKey)) {
      config.storeScopeKey = storeScopeKey
    }
  }

  getStore () {
    const store = getStore()
    return store
  }

  getRouter () {
    const router = getRouter()
    return router
  }
}

Setaria.install = install
Setaria.version = '__VERSION__'

export default Setaria

export {
  ApplicationError,
  constants,
  http,
  Message,
  ServiceError
}

if (inBrowser && window.Vue) {
  window.Vue.use(Setaria)
}
