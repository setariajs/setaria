import Message, { MESSAGE_TYPE } from '@/model/Message';

export default class ApplicationError extends Error {
  constructor(id, params, message) {
    const msg = new Message(id, params, message).getMessage();
    super(msg);
    this.id = id;
    this.params = params;
    this.type = MESSAGE_TYPE.ERROR;
    this.message = msg;
  }
}
