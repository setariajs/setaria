/* @flow */
import Vue from 'vue'
import config from '../config/index'
import ApplicationError, { ERROR_PREFIX, ERROR_MSG_SPLICER } from './ApplicationError'

/**
 * 判断是否为ApplicationError
 * @param {*} error
 */
function isApplicationError (error: string | Object | Error | PromiseRejectionEvent): boolean {
  return typeof error === 'object' && error._name &&
    error._name === 'ApplicationError'
}

function parseApplicationError (error: string | Object): ApplicationError {
  let ret: ApplicationError = null
  let id: string = ''
  let message: ?string = ''
  // ApplicationError对象
  if (isApplicationError(error)) {
    ret = new ApplicationError(error.id, [], error.noIdMessage)
  // Error对象
  } else if (error.message) {
    message = error.message
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (message.indexOf('Error: ') === 0) {
      message = message.replace('Error: ', '')
    // chrome, safari
    } else if (message.indexOf('Uncaught Error: ') === 0) {
      message = message.replace('Uncaught Error: ', '')
    }
    // 解析错误信息，取得错误代码和错误内容
    const msgArr: Array<string> = message.split(ERROR_MSG_SPLICER)
    id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '')
    message = msgArr[1]
    ret = new ApplicationError(id, [], message)
  } else if (typeof error.toString === 'function') {
    ret = new ApplicationError(null, null, error.toString())
  } else {
    ret = new ApplicationError('MAM004E')
  }
  return ret
}

export const ERROR_TYPES = {
  // 非Vue组件的常规错误
  'NORMAL_ERROR': 0,
  // Promise回调函数中的错误
  'PROMISE_UNREJECT_ERROR': 1,
  // 从 Vue 2.2.0 起，Vue组件生命周期钩子里的错误可以被捕获。
  // 从 Vue 2.4.0 起，Vue组件自定义事件句柄内部的错误可以被捕获。
  'VUE_ERROR': 2
}

export default class ErrorHandler {
  /**
   * 捕获系统异常，Vue抛出的异常和Promise异常
   */
  static catchError (): void {
    // Vue异常
    Vue.config.errorHandler = (err: Error, vm: Object, info: Object) => {
      console.debug('The Exception from Vue')
      ErrorHandler.handleError(ERROR_TYPES.VUE_ERROR, err, {
        vm,
        info
      })
    }
    // JavaScript执行期异常
    window.onerror = (err: Error) => {
      console.debug('The Exception from window.onerror')
      ErrorHandler.handleError(ERROR_TYPES.NORMAL_ERROR, err, {})
    }

    // promise异常
    // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
    // Promise Rejection异常处理函数
    const unhandledrejectionHandler = (err: Object | PromiseRejectionEvent) => {
      console.debug('The Exception from promise')
      ErrorHandler.handleError(ERROR_TYPES.PROMISE_UNREJECT_ERROR, err, {})
    }
    // 直接调用unhandledrejectionHandler的场合
    if (window.unhandledrejectionHandler === undefined ||
      window.unhandledrejectionHandler === null) {
      window.onunhandledrejection = unhandledrejectionHandler
    }
    // 触发unhandledrejectionHandler的场合
    window.addEventListener('unhandledrejection', unhandledrejectionHandler)
  }

  /**
   * 处理捕获的异常
   */
  static handleError (
    type: ERROR_TYPES,
    error: string | Object | Error | PromiseRejectionEvent,
    source?: Object): void {
    // 取得异常内容
    const errorObject: ApplicationError = this.parseError(type, error, source)
    if (typeof config.errorHanlder === 'function') {
      config.errorHanlder(errorObject, type, error, source)
    }
  }

  /**
   * 解析异常
   */
  static parseError (
    type: ERROR_TYPES,
    error: string | Object | Error | PromiseRejectionEvent,
    source?: Object): ApplicationError {
    let ret: ?ApplicationError = null
    // 从Vue中抛出异常的场合
    if (type === ERROR_TYPES.VUE_ERROR) {
      ret = parseApplicationError(error)
    } else if (type === ERROR_TYPES.NORMAL_ERROR) {
      if (typeof error === 'string') {
        error = {
          message: error
        }
      }
      ret = parseApplicationError(error)
    // Promise回调函数中抛出的异常
    } else if (type === ERROR_TYPES.PROMISE_UNREJECT_ERROR) {
      ret = parseApplicationError(error.reason)
    } else {
      ret = new ApplicationError('MAM004E')
    }

    // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
    if (type === ERROR_TYPES.VUE_ERROR) {
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.error(error)
    }
    return ret
  }
}
