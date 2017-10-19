/* @flow */
import Vue from 'vue'
import config from '../config/index'
import util from '../util'
import ApplicationError, { ERROR_PREFIX, ERROR_MSG_SPLICER } from './ApplicationError'

function isSetariaError (error: string | Object | Error | PromiseRejectionEvent): boolean {
  let ret: boolean = false
  if (error instanceof Object && error !== null &&
    error !== undefined && error.id !== null &&
    error.id !== undefined) {
    ret = true
  } else if (typeof error === 'string') {
    ret = error.indexOf(ERROR_PREFIX) !== -1
  }
  return ret
}

function parseSetariaError (error: string | Object): ApplicationError {
  let id: string = ''
  let message: ?string = ''
  if (typeof error === 'string') {
    // 删除浏览器添加的错误信息前缀
    // firefox
    if (error.indexOf('Error: ') === 0) {
      error = error.replace('Error: ', '')
    // chrome, safari
    } else if (error.indexOf('Uncaught Error: ') === 0) {
      error = error.replace('Uncaught Error: ', '')
    }
    // 解析错误信息，取得错误代码和错误内容
    const msgArr: Array<string> = error.split(ERROR_MSG_SPLICER)
    id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '')
    message = msgArr[1]
    return new ApplicationError(id, [], message)
  } else {
    return new ApplicationError(error.id, [], error.noIdMessage)
  }
}

export default class ErrorHandler {
  /**
   * 捕获系统异常，Vue抛出的异常和Promise异常
   */
  static catchError (): void {
    // Vue异常
    Vue.config.errorHandler = (err: Error, vm: Object) => {
      ErrorHandler.handleError(err, vm)
    }
    // JavaScript执行期异常
    window.onerror = (err: Error) => {
      ErrorHandler.handleError(err)
    }
    // promise异常
    // 目前最新版的Firefox浏览器不支持PromiseRejectionEvent
    window.addEventListener('unhandledrejection', (err: Object) => {
      ErrorHandler.handleError(err)
    })
  }

  /**
   * 处理捕获的异常
   */
  static handleError (error: string | Object | Error | PromiseRejectionEvent, source?: Object): void {
    // 取得错误内容
    const errorObject: ApplicationError = this.parseError(error, source)
    if (typeof config.errorHanlder === 'function') {
      config.errorHanlder(errorObject, error)
    }
  }

  /**
   * 解析异常
   */
  static parseError (error: string | Object | Error | PromiseRejectionEvent, source?: Object): ApplicationError {
    let ret: ?ApplicationError = null
    const isErrorFromVue: boolean = source instanceof Object
    // 自定义异常对象的场合
    if (isSetariaError(error)) {
      ret = parseSetariaError(error)
    // 没有捕获Promise中抛出的异常
    // 当在不支持PromiseRejectionEvent的浏览器中，通过PromiseRejectionEvent判断会报错
    } else if (error.type === 'unhandledrejection' && typeof error === 'object') {
      const { id, message, noIdMessage }: Object = error.reason
      // ApplicationError
      if (noIdMessage !== null && noIdMessage !== undefined) {
        ret = new ApplicationError(id, [], noIdMessage)
      // Error
      } else if (message !== null && message !== undefined) {
        ret = new ApplicationError('', [], message)
      } else {
        ret = new ApplicationError('MAM004E')
      }
    // 组件渲染或组件事件函数执行时抛出异常的场合
    // 执行期异常的场合
    } else if (isErrorFromVue && error instanceof Error) {
      if (util.isProdunctionEnv()) {
        ret = new ApplicationError('MAM004E')
      } else {
        const message: string = error.message
        ret = new ApplicationError('', [], message)
      }
    // // 来源：未知
    // } else if (error instanceof Object
    //   && Object.prototype.hasOwnProperty.call(error, 'message')) {
    //   ret = new ApplicationError(null, null, error.message)
    // 在事件函数中抛出ApplicationError的场合
    // 没有捕获的错误。（来源：事件函数中的运行期错误）
    } else if (typeof error === 'string') {
      if (error.indexOf('Uncaught Error: ') === 0) {
        ret = new ApplicationError('', [], error.replace('Uncaught Error: ', ''))
      } else {
        ret = new ApplicationError('', [], error)
      }
    } else {
      ret = new ApplicationError('MAM004E')
    }

    // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
    if (isErrorFromVue) {
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.error(error)
    }
    return ret
  }
}
