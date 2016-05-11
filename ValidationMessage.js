/**
 * 输入值校验消息处理类
 *
 * @class
 * @param {string} elementId  节点ID
 * @param {string} messageId  消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var ValidationMessage = function(elementId, messageId, parameters){

	/**
	 * 节点ID
	 *
	 * @type {string}
	 * @public
	 */
	this.elementId = elementId;

	/**
	 * 校验消息ID
	 *
	 * @type {string}
	 * @public
	 */
	this.messageId = messageId;

	/**
	 * 校验消息内容
	 *
	 * @type {string}
	 * @public
	 */
	this.message = _message.getMessage(messageId, parameters);

	/**
	 * 返回校验消息内容
	 *
	 * @return {String} 校验消息内容
	 */
	function toString(){
		return this.message;
	}
	this.toString = toString;
};
