/* @flow */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import config from '../core/config'
import ServiceError from '../global-object/ServiceError'
import { getStore } from '../plugin/store/index'
import { STORE_KEY } from '../shared/constants'

const KEY_DEFAULTS_SETTING = 'defaults'
const ret = {
  defaults: axios
}

export function init () {
  // Http Config
  const httpConfig = config.http || {}

  // Set Http Default Config
  initConfig(httpConfig)

  // Set Custom Http Instance
  if (Object.keys(httpConfig).length > 0) {
    const instance = initInstance(httpConfig)
    Object.keys(instance).forEach((key) => {
      ret[key] = instance[key]
    })
  }

  // Set Http Interceptor
  initInterceptor(ret)

  return ret
}

export default ret

/**
 * Set Http Default Config
 *
 * @param {*} httpConfig
 */
function initConfig (httpConfig) {
  // Set default http config
  const httpConfigDefault = httpConfig[KEY_DEFAULTS_SETTING]
  if (httpConfigDefault !== undefined && httpConfigDefault !== null) {
    Object.keys(httpConfigDefault).forEach((key) => {
      axios.defaults[key] = httpConfigDefault[key]
    })
  }
}

/**
 * Set Custom Http Instance
 *
 * @param {*} httpConfig
 * @returns
 */
function initInstance (httpConfig) {
  const isCreateCustomHttpInstance = Object.keys(httpConfig).some((key) => {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  })
  if (isCreateCustomHttpInstance) {
    const ret = {}
    Object.keys(httpConfig).forEach((key) => {
      const config = httpConfig[key]
      config.showLoading = true
      ret[key] = axios.create(config)
      // add non-exist function to axios instance
      ret[key].all = axios.all
      ret[key].spread = axios.spread
    })
    return ret
  } else {
    return null
  }
}

/**
 * Set Http Interceptor
 *
 * @param {*} http
 */
function initInterceptor (http) {
  const requestInterceptors = [
    [addLoading]
  ]
  const responseInterceptors = [
    [subLoading, commonErrorHandler]
  ]
  // add interceptor to instance
  if (typeof http === 'function') {
    requestInterceptors.forEach((interceptor) => {
      const r = http.interceptors.request
      r.use.apply(r, interceptor)
    })
    responseInterceptors.forEach((interceptor) => {
      const r = http.interceptors.response
      r.use.apply(r, interceptor)
    })
  } else {
    Object.keys(http).forEach((key) => {
      requestInterceptors.forEach((interceptor) => {
        const r = http[key].interceptors.request
        r.use.apply(r, interceptor)
      })
      responseInterceptors.forEach((interceptor) => {
        const r = http[key].interceptors.response
        r.use.apply(r, interceptor)
      })
    })
  }
}

// interceptor
// Tips: response interceptor will not be executed when got error
// loading interceptor
function addLoading (config) {
  const storeInstance = getStore()
  if (storeInstance && config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.ADD_LOADING_COUNT)
  }
  return config
}
function subLoading (response) {
  const storeInstance = getStore()
  if (storeInstance && response.config.showLoading !== false) {
    storeInstance.commit(STORE_KEY.SUB_LOADING_COUNT)
  }
  return response
}

// error handler
function commonErrorHandler (error) {
  // sub loading state count
  subLoading({
    config: error.config
  })
  // server have response
  if (error.response) {
    console.debug('server have response', error)
    const messagePrefix = 'SYSMSG-SERVICE-STATUS-'
    let messageId = ''
    switch (error.response.status) {
      case 400:
        messageId = '400'
        break
      case 401:
        messageId = '401'
        break
      case 403:
        messageId = '403'
        break
      case 404:
        messageId = '404'
        break
      default:
        messageId = ''
    }
    let message = 'SYSMSG-SERVICE-UNKNOWN-ERROR'
    if (messageId !== '') {
      message = `${messagePrefix}${messageId}`
    }
    throw new ServiceError(message, error)
  // The request was made but no response was received
  } else if (error.request) {
    console.debug('The request was made but no response was received', error)
  // Something happened in setting up the request that triggered an Error
  } else {
    console.debug('Something happened in setting up the request that triggered an Error', error)
    // timeout
    if (error.message.indexOf('timeout of ') === 0) {
      throw new ServiceError('SYSMSG-TIMEOUT', error, [error.config.timeout / 1000])
    // server unavaliable
    } else if (error.message.indexOf('Network Error') === 0) {
      throw new ServiceError('SYSMSG-SERVICE-NETWORK-ERROR', error)
    } else {
      throw new ServiceError('SYSMSG-SERVICE-UNKNOWN-ERROR', error)
    }
  }
  return Promise.reject(error)
}
