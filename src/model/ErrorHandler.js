import Vue from 'vue'
import config from '../config/index'
import util from '../util'
import ApplicationError, { ERROR_PREFIX, ERROR_MSG_SPLICER } from './ApplicationError'

function isSetariaError (error) {
  let ret = false
  if (util.isObject(error) && !util.isEmpty(error.id)) {
    ret = true
  } else if (util.isString(error)) {
    ret = error.indexOf(ERROR_PREFIX) !== -1
  }
  return ret
}

function parseSetariaError (error) {
  let msg = error
  if (util.isObject(error)) {
    msg = error.message
  }
  // 删除浏览器添加的错误信息前缀
  msg = msg.replace('Uncaught Error: ', '')
  // 解析错误信息，取得错误代码和错误内容
  const msgArr = msg.split(ERROR_MSG_SPLICER)
  const id = msgArr[0].replace(ERROR_PREFIX, '').replace('[', '').replace(']', '')
  const message = msgArr[1]
  return new ApplicationError(id, null, message)
}

export default class ErrorHandler {
  /**
   * 捕获系统异常，Vue抛出的异常和Promise异常
   */
  static catchError () {
    Vue.config.errorHandler = (err, vm) => {
      ErrorHandler.handleError(err, vm)
    }
    window.onerror = (err) => {
      ErrorHandler.handleError(err)
    }
    window.onunhandledrejection = (err) => {
      ErrorHandler.handleError(err)
    }
  }

  /**
   * 处理捕获的异常
   * @param  {String|Object} error  异常
   * @param  {Object}        source 触发异常的示例
   */
  static handleError (error, source) {
    // 取得错误内容
    const errorObject = ErrorHandler.parseError(error, source)
    if (util.isFunction(config.errorHanlder)) {
      config.errorHanlder(errorObject, error)
    }
  }

  /**
   * 解析异常
   * @param  {[type]} error  [description]
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  static parseError (error, source) {
    let ret = null
    const isErrorFromVue = source instanceof Object
    // 自定义异常对象的场合
    if (isSetariaError(error)) {
      ret = parseSetariaError(error)
    // Promise中没有捕获的错误
    // 当在不支持PromiseRejectionEvent的浏览器中，通过PromiseRejectionEvent判断会报错
    } else if (!util.isEmpty(error.reason)) {
      ret = error.reason
    // 执行期异常的场合
    } else if (error instanceof Error) {
      if (util.isProdunctionEnv()) {
        ret = new ApplicationError('MAM004E')
      } else {
        ret = error
      }
    // 来源：组件渲染
    } else if (isErrorFromVue) {
      if (util.isProdunctionEnv()) {
        ret = new ApplicationError('MAM004E')
      } else {
        ret = error
      }
    // // 来源：未知
    // } else if (error instanceof Object
    //   && Object.prototype.hasOwnProperty.call(error, 'message')) {
    //   ret = new ApplicationError(null, null, error.message)
    // 在事件函数中抛出ApplicationError的场合
    // 没有捕获的错误。（来源：事件函数中的运行期错误）
    } else if (util.isString(error)) {
      if (error.indexOf('Uncaught Error: ') === 0) {
        ret = error.replace('Uncaught Error: ', '')
      }
      ret = new ApplicationError(null, null, ret)
    }
    if (ret === null || ret === undefined ||
      (!util.isEmpty(ret) && util.isEmpty(ret.message))) {
      ret = new ApplicationError('MAM004E')
    }

    // 实现了Vue.config.errorHandler接口的场合，Vue不会在控制台显示错误。
    // if (isErrorFromVue) {
    //   /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    //   console.error(error)
    // }
    return ret
  }
}
