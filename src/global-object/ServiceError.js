/* @flow */
import { isFirefox } from '../util/dom'
import { pathOr } from '../util/lang'
import ApplicationError from './ApplicationError'

function dispatchUnHandlerRejectEvent (reason: Object) {
  const event = document.createEvent('Event')
  event.initEvent(
    'unhandledrejection', // Define that the event name is 'unhandledrejection'
    false, // PromiseRejectionEvent is not bubbleable
    true // PromiseRejectionEvent is cancelable
  )
  /**
   * Note: these properties should not be enumerable, which is the default setting
   */
  const properties = {
    reason: {
      value: reason,
      writable: false
    }
  }
  Object.defineProperties(event, properties)
  window.dispatchEvent(event)
}

export default class ServiceError extends ApplicationError {
  _name: string;
  detail: Object;
  type: string;
  constructor (id?: string = '', reason: Object = {},
    params?: Array<string | number> = [], message?: string = '') {
    super(id, params, message)
    this._name = 'ServiceError'
    this.type = 'ServiceError'
    this.detail = reason
    // 在Firefox下只要不是已经明确设置不显示异常，否则抛出'unhandledrejection'事件
    if (isFirefox() && pathOr(true, ['config', 'isShowError'], reason) !== false) {
      dispatchUnHandlerRejectEvent(this)
    }
  }
}
