/* @flow */
import { isEmpty } from '../util/lang'
import AbstractError from './AbstractError'
import Message from './Message'

export const ERROR_PREFIX = 'Setaria Error'
export const ERROR_MSG_SPLICER = ':'

export default class ApplicationError extends AbstractError {
  // 前端定义消息messageCode
  messageCode: string;
  // message中的占位数据
  params: Array<string | number>;
  constructor (messageCode?: string = '', params?: Array<string | number> = [], message?: string = '') {
    let msg: string = message
    // 生产环境屏蔽javascript执行期错误
    if (isEmpty(messageCode) && process.env.NODE_ENV === 'production') {
      console.error(msg)
      messageCode = 'SYSMSG-CLIENT-UNKNOWN-ERROR'
      msg = ''
    }
    if (!isEmpty(messageCode) && isEmpty(msg)) {
      msg = new Message(messageCode, params, msg).getMessage() || new Message('SYSMSG-CLIENT-UNKNOWN-ERROR').getMessage()
    }
    // 从window.onerror只能取得字符串类型的错误信息
    super(messageCode, msg, 'ApplicationError')
    this.messageCode = messageCode
    this.params = params
  }
}
