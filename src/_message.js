/**
 * 消息管理模块
 *
 * @namespace _message
 * @version 1.0
 * @author HanL
 */
var _message = new function(){
    "use strict";

    /**
     * 无法取得业务消息文件。
     *
     * @const
     * @type {string}
     */
    var MESSAGE_FILE_NOT_EXIST_MSG = "无法取得业务消息文件。";

    /**
     * 无法取得系统消息文件。
     *
     * @const
     * @type {string}
     */
    var SYS_MESSAGE_FILE_NOT_EXIST_MSG = "无法取得系统消息文件。";

    /**
     * 业务消息缓存
     *
     * @private
     * @type {Object}
     */
    var _messageObject = null;

    /**
     * 系统消息缓存
     *
     * @private
     * @type {Object}
     */
    var _systemMessageObject = null;

    /**
     * 根据指定消息ID取得消息内容
     *
     * @private
     * @param  {string}  id 消息ID
     * @param  {Boolean} isSystemMessage true为取系统公共消息,false为取系统业务消息
     * @return {string}  消息内容
     */
    function _getMessage(id, isSystemMessage){
        var ret = null;
        // 消息文件路径
        var filePath = (isSystemMessage === true) ? _config.SYSMESSAGE_FILE :
            _config.MESSAGE_FILE;
        var messageContent = null;
        // 取得系统公共消息的场合
        if (isSystemMessage === true){
            // 第一次取得系统公共消息的场合
            if (_util.isEmpty(_systemMessageObject)){
                _systemMessageObject = _util.getFileContent(filePath, "json");
            }
            messageContent = _systemMessageObject;
        // 取得系统业务消息的场合
        }else{
            // 第一次取得系统业务消息的场合
            if (_util.isEmpty(_messageObject)){
                _messageObject = _util.getFileContent(filePath, "json");
            }
            messageContent = _messageObject;
        }
        // 无法取得消息文件的场合
        if (_util.isObject(messageContent) &&
                messageContent.textStatus === "error"){
            if (isSystemMessage === true){
                ret = SYS_MESSAGE_FILE_NOT_EXIST_MSG;
            }else{
                ret = MESSAGE_FILE_NOT_EXIST_MSG;
            }
        }else{
            ret = messageContent[id];
            if (_util.isEmpty(ret)){
                ret = '没有找到指定的消息。 (id=' + id + ')';
            }
        }
        return ret;
    }

    /**
     * 使用参数填充自定义的消息模版
     *
     * @private
     * @param  {string} template 定义在消息定义模块的消息模版
     * @param  {Array}  parameters 参数数组
     * @return {string} 消息字符串
     */
    function _format(template, parameters){
        if (!_util.isEmpty(parameters)){
            for (var i = 0; i < parameters.length; i++){
                template = template.split("\{" + i + "\}").join(parameters[i]);
            }
        }
        return template;
    }

    /**
     * 取得一般消息
     *
     * @public
     * @param  {string}  id 消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  消息字符串
     */
    this.getMessage = function(id, parameters){
        return _format(_getMessage(id, false), parameters);
    };

    /**
     * 取得系统消息
     *
     * @public
     * @param  {string}  id 系统消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  系统消息字符串
     */
    this.getSystemMessage = function(id, parameters){
        return _format(_getMessage(id, true), parameters);
    };
};
