import util from '../util'
import Message, { MESSAGE_TYPE } from './Message'

export const ERROR_PREFIX = 'Setaria Error'
export const ERROR_MSG_SPLICER = ':'

export default class ApplicationError extends Error {
  constructor (id, params, message) {
    let msg = message
    if (util.isEmpty(message)) {
      msg = new Message(id, params, message).getMessage()
      msg = `${ERROR_PREFIX}[${id}]${ERROR_MSG_SPLICER}${msg}`
    }
    super(msg)
    this.id = id
    this.params = params
    this.type = MESSAGE_TYPE.ERROR
    this.message = msg
  }
}
