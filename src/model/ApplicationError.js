/* @flow */
import util from '../util'
import Message, { MESSAGE_TYPE } from './Message'

export const ERROR_PREFIX = 'Setaria Error'
export const ERROR_MSG_SPLICER = ':'

export default class ApplicationError extends Error {
  _name: string;
  id: string;
  params: Array<string | number>;
  type: string;
  noIdMessage: string;
  message: string;
  constructor (id?: string = '', params?: Array<string | number> = [], message?: string = '') {
    let msg: string = message
    if (util.isEmpty(id)) {
      id = 'unknown'
    }
    if (util.isEmpty(message)) {
      msg = new Message(id, params, message).getMessage()
    }
    const fullMessage = `${ERROR_PREFIX}[${id}]${ERROR_MSG_SPLICER}${msg}`
    super(fullMessage)
    this._name = 'ApplicationError'
    this.id = id
    this.params = params
    this.type = MESSAGE_TYPE.ERROR
    this.noIdMessage = msg
    this.message = fullMessage
  }
}
