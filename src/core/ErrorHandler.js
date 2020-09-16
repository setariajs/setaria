/* @flow */
import Vue from 'vue'
import { ERROR_THROW_TYPES, STORE_KEY } from '../shared/constants'
import { getStore } from '../plugin/store/index'
import config from './config'
import ApplicationError, { ERROR_PREFIX, ERROR_MSG_SPLICER } from '../global-object/ApplicationError'
import { findIndex } from '../util/lang'

/**
 * 判断是否为ApplicationError
 * @param {*} error
 */
function isApplicationError (error: string | Object | Error | PromiseRejectionEvent): boolean {
  return typeof error === 'object' && error._name &&
    error._name === 'ApplicationError'
}

/**
 * 判断是否为ServiceError
 * @param {*} error
 */
function isServiceError (error: string | Object | Error | PromiseRejectionEvent): boolean {
  return typeof error === 'object' && error._name &&
    error._name === 'ServiceError'
}

function parseApplicationError (error: string | Object): ApplicationError {
  let ret: ApplicationError = null
  let id: string = ''
  let message: ?string = ''
  // TODO 需要确认此处error为什么为undefined
  if (error === undefined || error === null) {
    ret = new ApplicationError('MAM004E')
  } else if (isApplicationError(error)) {
    ret = new ApplicationError(error.id, [], error.noIdMessage)
  } else if (isServiceError(error)) {
    ret = error
  // 普通Error对象
  } else if (error.message) {
    message = error.message
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (message.indexOf('Error: ') === 0) {
      message = message.replace('Error: ', '')
    // chrome, safari
    } else if (message.indexOf('Uncaught Error: ') === 0) {
      message = message.replace('Uncaught Error: ', '')
    // chrome
    } else if (message.indexOf('Uncaught TypeError: ' === 0)) {
      message = message.replace('Uncaught TypeError: ', '')
    }
    // 解析SDK错误信息，取得错误代码和错误内容
    if (message.indexOf(ERROR_PREFIX) !== -1) {
      if (message.indexOf(ERROR_MSG_SPLICER) !== -1) {
        const msgArr: Array<string> = []
        const splicerIndex = message.indexOf(ERROR_MSG_SPLICER)
        msgArr[0] = message.substring(0, splicerIndex)
        msgArr[1] = message.substring(splicerIndex + 1)
        id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '')
        message = msgArr[1]
      } else {
        id = 'unknown'
      }
    }
    ret = new ApplicationError(id, [], message)
  } else if (typeof error.toString === 'function') {
    ret = new ApplicationError(null, null, error.toString())
  } else {
    ret = new ApplicationError('MAM004E')
  }
  return ret
}

function isIgnoreError (errorObject) {
  let errorString = ''
  if (typeof errorObject === 'string') {
    errorString = errorObject
  } else if (typeof errorObject === 'object' && errorObject.name) {
    errorString = errorObject.name
  }
  const ignoreErrorTypeArray = ['SCRIPT438']
  const index = findIndex(ignoreErrorTypeArray, ignoreErrorType => errorString.indexOf(ignoreErrorType) === 0)
  return index !== -1
}

export default class ErrorHandler {
  /**
   * 捕获系统异常，Vue抛出的异常和Promise异常
   */
  static init (): void {
    // Vue异常
    // 从 2.2.0 起，这个钩子也会捕获组件生命周期钩子里的错误。同样的，当这个钩子是 undefined 时，被捕获的错误会通过 console.error 输出而避免应用崩溃。
    // 从 2.4.0 起，这个钩子也会捕获 Vue 自定义事件处理函数内部的错误了。
    // 从 2.6.0 起，这个钩子也会捕获 v-on DOM 监听器内部抛出的错误。另外，如果任何被覆盖的钩子或处理函数返回一个 Promise 链 (例如 async 函数)，
    // 则来自其 Promise 链的错误也会被处理。
    Vue.config.errorHandler = (err: Error, vm: Object, info: Object) => {
      console.error('The Exception from Vue', vm, info)
      ErrorHandler.handleError(ERROR_THROW_TYPES.VUE_ERROR, err, {
        vm,
        info
      })
    }
    // JavaScript执行期异常
    window.onerror = (err: Error) => {
      console.error('The Exception from window.onerror')
      ErrorHandler.handleError(ERROR_THROW_TYPES.NORMAL_ERROR, err, {})
    }

    // promise异常
    // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
    // Promise Rejection异常处理函数
    const unhandledrejectionHandler = (err: Object | PromiseRejectionEvent) => {
      console.error('The Exception from promise')
      ErrorHandler.handleError(ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR, err, {})
    }
    // 绑定Promise Reject Event处理逻辑
    window.onunhandledrejection = unhandledrejectionHandler
  }

  /**
   * 处理捕获的异常
   */
  static handleError (
    type: ERROR_THROW_TYPES,
    error: string | Object | Error | PromiseRejectionEvent,
    source?: Object): void {
    let requestId = null
    let oddNumber = null
    if (type === ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR) {
      requestId = error.reason.requestId
      oddNumber = error.reason.oddNumber
    }
    // 取得异常内容
    const errorObject: ApplicationError = this.parseError(type, error, source)
    // 生产环境不显示部分错误类型
    const isIgnoreErrorFlag = process.env.NODE_ENV === 'production' && isIgnoreError(error)
    const storeInstance = getStore()
    storeInstance.commit(STORE_KEY.ADD_ERROR, {
      error: errorObject,
      origin: error,
      type,
      requestId,
      oddNumber
    })
    if (typeof config.errorHanlder === 'function' && !isIgnoreErrorFlag) {
      config.errorHanlder(errorObject, type, error, source)
    }
  }

  /**
   * 解析异常
   */
  static parseError (
    type: ERROR_THROW_TYPES,
    error: string | Object | Error | PromiseRejectionEvent,
    source?: Object): ApplicationError {
    let ret: ?ApplicationError = null
    // 从Vue中抛出异常的场合
    if (type === ERROR_THROW_TYPES.VUE_ERROR) {
      ret = parseApplicationError(error)
    } else if (type === ERROR_THROW_TYPES.NORMAL_ERROR) {
      if (typeof error === 'string') {
        error = {
          message: error
        }
      }
      ret = parseApplicationError(error)
    // Promise回调函数中抛出的异常
    } else if (type === ERROR_THROW_TYPES.PROMISE_UNREJECT_ERROR) {
      ret = parseApplicationError(error.reason)
    } else {
      ret = new ApplicationError('MAM004E')
    }

    // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
    if (type === ERROR_THROW_TYPES.VUE_ERROR) {
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.error(error)
    }
    return ret
  }
}
