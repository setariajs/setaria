import MessageConfig from '@/config/message';
import Util from '@/model/Util';

export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

/**
 * 格式化指定消息
 * @param  {String} id     消息ID
 * @param  {Array}  params 消息参数
 * @return {String} 已格式化的消息
 */
function formatMessage(id = '', params) {
  let ret = Util.isEmpty(MessageConfig[id]) ? '' : MessageConfig[id];
  if (!Util.isEmpty(ret) && !Util.isEmpty(params)) {
    params.forEach((item, index) => {
      ret = ret.split(`{${index}}`).join(params[index]);
    });
  }
  return ret;
}

/**
 * 根据消息ID取得对应的消息类型
 * @param  {String} id 消息ID
 * @return {String} 消息类型
 */
function getMessageType(id = null) {
  let ret = '';
  const type = id !== null ? id.charAt(id.length - 1) : '';
  switch (type) {
    case 'E':
      ret = 'error';
      break;
    case 'W':
      ret = 'warning';
      break;
    case 'I':
      ret = 'info';
      break;
    default:
      ret = 'error';
  }
  return ret;
}

export default class Message {
  constructor(id, params, message) {
    this.id = id;
    this.type = getMessageType(id);
    this.params = params;
    this.message = formatMessage(this.id, this.params);
    if (Util.isEmpty(this.message) && !Util.isEmpty(message)) {
      this.message = message;
    }
  }

  getMessage() {
    return this.message;
  }

  toString() {
    return this.message;
  }
}
