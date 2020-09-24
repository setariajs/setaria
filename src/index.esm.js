import Vue from 'vue'
import { install } from './install'
import config from './core/config'
import ErrorHandler from './core/ErrorHandler'
import { initGlobalAPI } from './global-api/index'
import ApplicationError from './global-object/ApplicationError'
import Message from './global-object/Message'
import ServiceError from './global-object/ServiceError'
import StoreGlobalAPI from './plugin/store/index'
import sdkMessage from './resource/message'
import constants from './shared/constants'
import defaultConfig from './shared/default-config'
import { inBrowser } from './util/dom'
import { isEmpty, isNotEmpty, merge } from './util/lang'
import util from './util/index'

class Setaria {
  constructor (options = {}) {
    const _sdk = this
    this.initConfig(options)
    initGlobalAPI(Setaria, _sdk)
    ErrorHandler.init()
    // 不由框架进行Vue根组件的创建
    if (isEmpty(options.entry)) {
      return
    }
    Vue.use(Setaria, options)
  }

  /**
   * 初始化设置，增加新设置项的场合，需要在此处进行merge
   */
  initConfig ({
    message = {},
    http = {},
    routes = {},
    store = {},
    storeScopeKey,
    logHandler,
    excludeRecordPageLoadTimeComponentName,
    log,
    moduleUrlRules
  }) {
    config.message = merge(sdkMessage, message)
    config.http = http || {}
    config.routes = routes || {}
    config.store = store || {}
    // Vuex Store Scope Key
    if (isNotEmpty(storeScopeKey)) {
      config.storeScopeKey = storeScopeKey
    }
    if (isNotEmpty(excludeRecordPageLoadTimeComponentName)) {
      config.excludeRecordPageLoadTimeComponentName = excludeRecordPageLoadTimeComponentName
    }
    if (typeof logHandler === 'function') {
      config.logHandler = logHandler
    }
    if (typeof log === 'boolean') {
      config.log = log
    }
    if (isNotEmpty(moduleUrlRules)) {
      config.moduleUrlRules = moduleUrlRules
    }
    console.log('config init complete')
  }
}

Setaria.install = install(Setaria)
Setaria.version = '__VERSION__'

export default Setaria

export {
  ApplicationError,
  constants,
  defaultConfig,
  Message,
  ServiceError,
  StoreGlobalAPI,
  util
}

if (inBrowser && window.Vue) {
  window.Vue.use(Setaria)
}
