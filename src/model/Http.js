/* @flow */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import ServiceError from './ServiceError'
import { getStore, types } from './store/index'
import config from '../config/index'
import util from '../util'

const KEY_DEFAULTS_SETTING = 'defaults'

let ret = axios

// Http Config
const httpConfig = util.get(config, 'http')
// set default http config
const httpConfigDefault = util.get(httpConfig, KEY_DEFAULTS_SETTING)
if (httpConfigDefault) {
  console.debug(httpConfigDefault)
  Object.keys(httpConfigDefault).forEach((key) => {
    axios.defaults[key] = httpConfigDefault[key]
  })
}

// set custom http instance
let isCreateCustomHttpInstance = false
if (httpConfig !== null && httpConfig !== undefined) {
  isCreateCustomHttpInstance = Object.keys(httpConfig).some((key) => {
    if (key !== KEY_DEFAULTS_SETTING) {
      return true
    }
    return false
  })
  if (isCreateCustomHttpInstance) {
    ret = {}
    Object.keys(httpConfig).forEach((key) => {
      const config = httpConfig[key]
      config.showLoading = true
      ret[key] = axios.create(config)
      // add non-exist function to axios instance
      ret[key].all = axios.all
      ret[key].spread = axios.spread
    })
  }
}

// interceptor
// Tips: response interceptor will not be executed when got error
// loading interceptor
function addLoading (config) {
  const storeInstance = getStore()
  if (storeInstance && config.showLoading !== false) {
    storeInstance.commit(types.ADD_LOADING_COUNT)
  }
  return config
}
function subLoading (response) {
  const storeInstance = getStore()
  if (storeInstance && response.config.showLoading !== false) {
    storeInstance.commit(types.SUB_LOADING_COUNT)
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

// add interceptor to instance
if (typeof ret === 'function') {
  ret.interceptors.request.use(addLoading)
  ret.interceptors.response.use(subLoading, commonErrorHandler)
} else {
  Object.keys(ret).forEach((key) => {
    ret[key].interceptors.request.use(addLoading)
    ret[key].interceptors.response.use(subLoading, commonErrorHandler)
  })
}

export default ret
