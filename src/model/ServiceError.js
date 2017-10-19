/* @flow */
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
  constructor (id?: string = '', reason: Object, params?: Array<string | number> = [], message?: string = '') {
    super(id, params, message)
    dispatchUnHandlerRejectEvent(this)
  }
}
