/* @flow */
import ServiceError from './ServiceError'

export function createClientCustomBusinessApiErrorMessage (code, message) {
  return `${code}: ${message}`
}

export default class CustomBusinessApiError extends ServiceError {
  requestId: string;
  oddNumber: string;
  code: string;
  constructor (code?: string = '', message?: string = '', reason: Object = {},
    requestId?: string = '', oddNumber?: string = '') {
    super(null, reason, null, createClientCustomBusinessApiErrorMessage(code, message))
    this.requestId = requestId
    this.oddNumber = oddNumber
    this.code = code
  }
}
