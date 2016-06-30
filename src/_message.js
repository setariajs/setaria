/**
 * 消息管理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _message = new function(){

    /**
     * 消息缓存
     *
     * @private
     * @type {Object}
     */
    var message = null;

    /**
     * 系统消息缓存
     *
     * @private
     * @type {Object}
     */
    var systemMessage = null;

    /**
     * 根据指定消息ID取得消息内容
     *
     * @private
     * @param  {string} id 消息ID
     * @return {string} 消息内容
     */
    var _getMessage = function(id){
        if (_util.isEmpty(message)){
            message = _util.getFileContent(_config.MESSAGE_FILE, "json");
        }
        return message[id];
    };

    /**
     * 根据指定系统消息ID取得系统消息内容
     *
     * @private
     * @param  {string} id 系统消息ID
     * @return {string} 系统消息内容
     */
    var _getSysMessage = function(id){
        if (_util.isEmpty(systemMessage)){
            systemMessage = _util.getFileContent(_config.SYSMESSAGE_FILE, "json");
        }
        return systemMessage[id];
    };

    /**
     * 使用参数填充自定义的消息模版
     *
     * @inner
     * @param  {string} template 定义在消息定义模块的消息模版
     * @param  {Array}  parameters 参数数组
     * @return {string} 消息字符串
     */
    var _format = function(template, parameters){
        if (!_util.isEmpty(parameters)){
            for (var i = 0; i < parameters.length; i++){
                template = template.split("\{" + i + "\}").join(parameters[i]);
            }
        }
        return template;
    };

    /**
     * 取得一般消息
     *
     * @public
     * @param  {string}  id 消息ID
     * @param  {Array}   parameters 参数数组
     * @return {String}  消息字符串
     */
    function getMessage(id, parameters){
        var template = _getMessage(id);
        if (!template){
            return "没有找到指定的消息. (id=" + id + ", parameters=" + parameters + ")";
        }
        return _format(template, parameters);
    }
    this.getMessage = getMessage;


    /**
     * 取得系统消息
     *
     * @public
     * @param  {string}  id 系统消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  系统消息字符串
     */
    function getSystemMessage(id, parameters){
        var template = _getSysMessage(id);
        if (!template){
            return "message not found. (id=" + id + ", parameters=" + parameters + ")";
        }
        return _format(template, parameters);
    }
    this.getSystemMessage = getSystemMessage;
};
