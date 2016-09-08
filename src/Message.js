/**
 * 消息定义类
 *
 * @example
 * var msg = new Message("MSG001", [""])
 *
 * @class
 * @param {string} messageId  消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var Message = function(messageId, parameters){

    /**
     * 消息ID
     *
     * @type {string}
     * @public
     */
    this.messageId = messageId;

    /**
     * 消息内容
     *
     * @type {string}
     * @public
     */
    this.message = _message.getMessage(messageId, parameters);

    /**
     * 返回消息内容
     *
     * @public
     * @return {string} 消息内容
     */
    this.toString = function(){
        return this.message;
    };
};
