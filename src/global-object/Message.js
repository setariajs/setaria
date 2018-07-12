/* @flow */
import config from '../core/config'
import { isEmpty } from '../util/lang'

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
    if (isEmpty(this.message) && !isEmpty(message)) {
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

/**
 * 根据消息ID取得对应的消息
 */
function getMessageById (id: string): ?string {
  const message = config.message || {}
  return message[id]
}

/**
 * 格式化指定消息
 */
function formatMessage (id: string = '', params: Array<string | number> = []) {
  const message: ?string = getMessageById(id)
  let ret: string = (message === null || message === undefined) ? '' : message
  if (!isEmpty(ret) && !isEmpty(params)) {
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
