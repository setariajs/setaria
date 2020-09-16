/* @flow */
import { ERROR_PREFIX, MESSAGE_TYPE } from '../shared/constants'
import { encodeErrorMessage } from '../util/core'

export default class AbstractError extends Error {
  _name: string;
  type: string;
  errorCode: String;
  errorMessage: string;
  constructor (errorCode?: string = '', errorMessage?: string = '', className?: string = '') {
    const encodeMessage = encodeErrorMessage(ERROR_PREFIX, errorCode, errorMessage)
    super(encodeMessage)
    this._name = className || 'AbstractError'
    this.type = MESSAGE_TYPE.ERROR
    this.errorCode = errorCode
    this.errorMessage = errorMessage
  }
}
