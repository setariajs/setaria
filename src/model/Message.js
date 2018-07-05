/* @flow */
import config from '../config/index'
import systemMessage from '../config/message'
import util from '../util'

export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error'
}

/**
 * 取得自定义消息对象
 */
function getCustomMessageObject (): ?Object {
  return config.message ? config.message : {}
}

/**
 * 取得系统消息对象和自定义消息对象
 */
function getMessageObject (): Object {
  return util.assign({}, systemMessage, getCustomMessageObject())
}

/**
 * 根据消息ID取得对应的消息
 */
function getMessageById (id: string): ?string {
  return getMessageObject()[id]
}

/**
 * 格式化指定消息
 */
function formatMessage (id: string = '', params: Array<string | number> = []) {
  const message: ?string = getMessageById(id)
  let ret: string = (message === null || message === undefined) ? '' : message
  if (!util.isEmpty(ret) && !util.isEmpty(params)) {
    params.forEach((item: string | number, index: number) => {
      const replaceString: string = `{${index}}`
      // 存在要替换的字符串的场合
      if (ret.indexOf(replaceString) !== -1) {
        const str = (typeof item === 'number') ? item.toString() : item
        ret = ret.split(replaceString).join(str)
      }
    })
  }
  return ret
}

/**
 * 根据消息ID取得对应的消息类型
 */
function getMessageType (id: string): string {
  let ret: string = ''
  const type = id.charAt(id.length - 1)
  switch (type) {
    case 'E':
      ret = 'error'
      break
    case 'W':
      ret = 'warning'
      break
    case 'I':
    default:
      ret = 'info'
  }
  return ret
}

export default class Message {
  id: string;
  params: Array<string | number>;
  type: string;
  message: string;
  constructor (id?: string = '', params?: Array<string | number> = [], message?: string = '') {
    this.id = id
    this.type = getMessageType(id)
    this.params = params
    this.message = formatMessage(this.id, this.params)
    if (util.isEmpty(this.message) && !util.isEmpty(message)) {
      this.message = message
    }
  }

  /**
   * 取得消息内容
   */
  getMessage (): string {
    return this.message
  }

  toString (): string {
    return this.message
  }
}
