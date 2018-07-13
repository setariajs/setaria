
/* @flow */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import config from '../../core/config'
import addLoading from './interceptor/addLoading'
import subLoading from './interceptor/subLoading'
import errorHandler from './interceptor/errorHandler'

let http

export function install (Vue, options) {
  http = {
    defaults: axios
  }

  // Http Config
  const httpConfig = config.http || {}

  // Set Http Default Config
  initConfig(httpConfig)

  // Set Custom Http Instance
  if (Object.keys(httpConfig).length > 0) {
    const instance = initInstance(httpConfig)
    Object.keys(instance).forEach((key) => {
      http[key] = instance[key]
    })
  }

  // Set Http Interceptor
  initInterceptor(http)
}

export function getHttp () {
  return http
}

const KEY_DEFAULTS_SETTING = 'defaults'

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
    return {}
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
    [
      subLoading, errorHandler
    ]
  ]
  // Tips: response interceptor will not be executed when got error
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
