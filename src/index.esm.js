import { install } from './install'
import config from './core/config'
import ErrorHandler from './core/ErrorHandler'
import { initGlobalAPI } from './global-api/index'
import ApplicationError from './global-object/ApplicationError'
import Message from './global-object/Message'
import ServiceError from './global-object/ServiceError'
import setariaMessage from './resource/message'
import constants from './shared/constants'
import { inBrowser } from './util/dom'
import { isNotEmpty, merge } from './util/lang'

class Setaria {
  constructor (options = {}) {
    const _setaria = this
    this.initConfig(options)
    initGlobalAPI(Setaria, _setaria)
    ErrorHandler.init()
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
}

Setaria.install = install(Setaria)
Setaria.version = '__VERSION__'

export default Setaria

export {
  ApplicationError,
  constants,
  Message,
  ServiceError
}

if (inBrowser && window.Vue) {
  window.Vue.use(Setaria)
}
