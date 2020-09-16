/* @flow */
import { isFirefox } from '../util/dom'
import { isEmpty, pathOr } from '../util/lang'
import AbstractError from './AbstractError'
import Message from './Message'

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

export default class ServiceError extends AbstractError {
  // Convenient for back-end Troubleshooting: unique request ID
  requestId: string;
  // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
  showType: number;
  oddNumber: string;
  detail: Object;
  constructor (
    errorCode?: string = '',
    errorMessage?: string = '',
    reason: Object = {},
    params?: Array<string | number> = [],
    requestId?: string = '',
    oddNumber?: string = '',
    showType?: number = 4) {
    let msg = errorMessage
    // 系统自定义消息
    if (errorCode &&
        typeof errorCode === 'string' &&
        isEmpty(errorMessage) &&
        errorCode.indexOf('SYSMSG') === 0) {
      msg = new Message(errorCode).getMessage()
      if (isEmpty(msg)) {
        errorCode = ''
        msg = new Message('SYSMSG-SERVICE-UNKNOWN-ERROR').getMessage()
      }
    }
    super(errorCode, msg, 'ServiceError')
    this.detail = reason
    this.showType = showType
    this.requestId = requestId
    this.oddNumber = oddNumber
    // 在Firefox下只要不是已经明确设置不显示异常，否则抛出'unhandledrejection'事件
    if (isFirefox() && pathOr(true, ['config', 'isShowError'], reason) !== false) {
      dispatchUnHandlerRejectEvent(this)
    }
  }
}
