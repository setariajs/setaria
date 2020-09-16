/* @flow */
import { ERROR_PREFIX, MESSAGE_TYPE } from '../shared/constants'
import { encodeErrorMessage } from '../util/core'

export default class AbstractError extends Error {
  _name: string;
  type: string;
  errorCode: String;
  errorMessage: string;
  // error display type： 0 silent; 1 message.warn; 2 message.error; 4 notification; 9 page
  showType: number;
  constructor (errorCode?: string = '', errorMessage?: string = '', className?: string = '', showType?: number = 2) {
    const encodeMessage = encodeErrorMessage(ERROR_PREFIX, errorCode, errorMessage, showType)
    super(encodeMessage)
    this._name = className || 'AbstractError'
    this.type = MESSAGE_TYPE.ERROR
    this.showType = showType
    this.errorCode = errorCode
    this.errorMessage = errorMessage
  }
}
