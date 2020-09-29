
/* @flow */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import config from '../../core/config'
import { findIndex, isEmpty, kebabCase, merge } from '../../util/lang'
import defaultInterceptor from './interceptor/default-interceptor'
import addLoading from './interceptor/request/addLoading'
import appendCustomHeader from './interceptor/request/appendCustomHeader'
import fileDownload from './interceptor/response/fileDownload'
import subLoading from './interceptor/response/subLoading'
import errorHandler from './interceptor/response/errorHandler'
import businessErrorHandler from './interceptor/response/businessErrorHandler'
import commonHandler from './interceptor/response/commonHandler'
import defaultHttpConfig from './default-config'

const KEY_DEFAULTS_SETTING = 'defaults'
const KEY_CACHE_CONTROL = 'Cache-Control'
const KEY_PRAGMA = 'Pragma'

let http = {}

export function install (Vue, options) {
  // 默认http实例
  http = {}

  // Http Config
  const httpConfig = merge(defaultHttpConfig, config.http) || {}
  if (config.http) {
    // 合并默认defaultHttp设置
    Object.keys(defaultHttpConfig).forEach(defaultHttpConfigKey => {
      if (config.http[defaultHttpConfigKey] === undefined || config.http[defaultHttpConfigKey] === null) {
        config.http[defaultHttpConfigKey] = defaultHttpConfig[defaultHttpConfigKey]
      }
    })
    // 初始化http实例
    Object.keys(config.http).forEach(function (key) {
      if (!http.hasOwnProperty(key)) {
        Object.defineProperty(http, key, {
          enumerable: true,
          writable: true
        })
      }
    })
  }
  // 设定Axios默认设置
  initAxiosDefaultConfig(httpConfig.defaults)
  http[KEY_DEFAULTS_SETTING] = axios
  // Set Custom Http Instance
  if (Object.keys(httpConfig).length > 0) {
    const instance = initInstance(httpConfig)
    Object.keys(instance).forEach((key) => {
      if (key === KEY_DEFAULTS_SETTING) {
        http[key] = axios
      } else {
        http[key] = instance[key]
      }
      // Set Http Interceptor
      initInterceptor(key, http[key])
    })
  }
}

export function getHttp () {
  return http
}

/**
 * Set Http Default Config
 *
 * @param {*} httpConfig
 */
function initAxiosDefaultConfig (httpConfigDefault = {}) {
  // Set default http config
  if (httpConfigDefault !== undefined && httpConfigDefault !== null) {
    Object.keys(httpConfigDefault).forEach((key) => {
      axios.defaults[key] = httpConfigDefault[key]
    })
  }
  if (httpConfigDefault.headers === undefined || httpConfigDefault.headers === null) {
    httpConfigDefault.headers = {}
  }
  // 定义默认Headers设置，当没有设置缓存策略时，设置ajax请求默认不使用缓存
  const headers = axios.defaults.headers
  const isCacheControlDefine =
    findIndex(Object.keys(headers), key => key.toLowerCase() === KEY_CACHE_CONTROL.toLowerCase())
  // 没有定义Cache-Control的场合，默认不缓存ajax请求
  if (isCacheControlDefine === -1) {
    headers[KEY_CACHE_CONTROL] = 'no-cache'
  }
  const isPragmaDefine =
    findIndex(Object.keys(headers), key => key.toLowerCase() === KEY_PRAGMA.toLowerCase())
  // 没有定义Pragma的场合，默认不缓存ajax请求
  if (isPragmaDefine === -1) {
    headers[KEY_PRAGMA] = 'no-cache'
  }
}

/**
 * Set Custom Http Instance
 *
 * @param {*} httpConfig
 * @returns
 */
function initInstance (httpConfig) {
  const isNeedCreateCustomHttpInstance = Object.keys(httpConfig).some((key) => {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  })
  if (isNeedCreateCustomHttpInstance) {
    const ret = {}
    Object.keys(httpConfig).forEach((key) => {
      if (key !== KEY_DEFAULTS_SETTING) {
        const config = httpConfig[key]
        // set module showLoading varible by user default setting
        let showLoading = false
        const defaultConfig = httpConfig[KEY_DEFAULTS_SETTING]
        if (defaultConfig &&
          typeof defaultConfig.showLoading === 'boolean') {
          showLoading = defaultConfig.showLoading
        }
        // 没有自定义默认显示加载状态的场合
        if (typeof httpConfig[key].showLoading !== 'boolean') {
          config.showLoading = showLoading
        }
        // create module baseURL
        config.baseURL = createModuleDefaultBaseURL(defaultConfig.baseURL, key, config.baseURL)
        config.responseEncoding = 'UTF8'
        config.timeout = 0 // nginx已经设置了请求的超时时间
        ret[key] = {}
        ret[key] = axios.create(config)
        // add non-exist function to axios instance
        ret[key].all = axios.all
        ret[key].spread = axios.spread
      }
    })
    return ret
  } else {
    return {}
  }
}

/**
 * 生成模块API的baseURL
 *
 * @export
 * @param {string} baseURL
 * @param {string} moduleKey
 * @param {string} moduleBaseUrl
 * @returns
 */
export function createModuleDefaultBaseURL (baseURL: string, moduleKey: string, moduleBaseUrl?: string) {
  let ret = moduleBaseUrl
  const modulePath = kebabCase(moduleKey)
  // 模块api没有定义baseURL的场合
  if (!isEmpty(baseURL) && isEmpty(ret)) {
    // 使用key自动生成baseURL
    ret = `${baseURL}/api-${modulePath}/api/${modulePath}/`
  }
  return ret
}

/**
 * Set Http Interceptor
 *
 * @param {*} http
 */
function initInterceptor (key, http) {
  let requestInterceptors = [
    [
      addLoading
    ],
    [
      appendCustomHeader
    ]
  ]
  let responseInterceptors = [
    [
      commonHandler
    ],
    [
      subLoading, errorHandler
    ],
    [
      businessErrorHandler
    ],
    [
      fileDownload
    ]
  ]
  // 自定义拦截器
  const httpInterceptorConfig = defaultInterceptor[key]
  // 定义了自定义请求处理拦截器的场合
  if (httpInterceptorConfig && httpInterceptorConfig.request) {
    requestInterceptors = httpInterceptorConfig.request
  }
  // 定义了自定义返回处理拦截器的场合
  if (httpInterceptorConfig && httpInterceptorConfig.response) {
    responseInterceptors = httpInterceptorConfig.response
  }
  // add interceptor to instance
  if (typeof http === 'function') {
    requestInterceptors.forEach((interceptor) => {
      const r = http.interceptors.request
      r.use.apply(r, interceptor)
    })
    // Tips: response interceptor will not be executed when got error
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
