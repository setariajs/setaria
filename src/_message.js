/**
 * 消息管理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _message = new function(){

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
        var template = _messages[id];
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
        var template = _sysmessages[id];
        if (!template){
            return "message not found. (id=" + id + ", parameters=" + parameters + ")";
        }
        return _format(template, parameters);
    }
    this.getSystemMessage = getSystemMessage;
};
