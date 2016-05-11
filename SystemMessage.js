/**
 * 系统级别消息处理类
 *
 * @class
 * @param {String} messageId  系统消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var SystemMessage = function(messageId, parameters){

	/**
	 * 系统消息ID
	 */
	this.messageId = messageId;

	/**
	 * 系统消息内容
	 */
	this.message = _message.getSystemMessage(messageId, parameters);

	/**
	 * 返回系统消息内容
	 *
	 * @return {String} 系统消息内容
	 */
	function toString(){
		return this.message;
	}
	this.toString = toString;
};
