/**
 * HTTP基础通信模块
 *
 * @namespace _http
 * @version 1.0
 * @author HanL
 */
var _http = new function(){
    "use strict";

    /**
     * 执行Ajax请求
     *
     * @private
     * @param {HTTPContext} context Ajax请求的选项
     */
    function _doXhr(context){
        if (!_util.isEmpty(context)){
            // 超时时间(ms)
            var defaultTimeout = _config.DEFAULT_TIMEOUT || 20000;
            // 设值超时时间
            context.timeout = _util.get(context, "timeout", _config.DEFAULT_TIMEOUT);
            // ajax通信失败时的处理
            if (_util.isFunction(context.error)){
                // 如果定义了失败时的回调函数
                context.error = context.error;
            }else{
                // 使用默认ajax通信失败处理
                context.error = _defaultErrorHandler;
            }
            // 开始ajax通信
            return $.ajax(context);
        }
    }

    /**
     * 默认ajax通信失败处理函数
     *
     * @private
     * @param  {jqXHR}  jqXHR       JQueryXHR对象
     * @param  {string} textStatus  通信状态值("timeout", "error", "abort", "parsererror")
     * @param  {string} errorThrown 异常对象
     */
    function _defaultErrorHandler(jqXHR, textStatus, errorThrown){
        var errorMsg;
        var msgList = [];
        if (textStatus === "timeout"){
            errorMsg = new SystemMessage("SESYSM005E");
        }else{
            errorMsg = jqXHR.statusText;
        }
        msgList.push(errorMsg);
        _ui.showMessage(msgList, "error");
    }

    /**
     * 执行异步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doAsync = function(context){
        if (!_util.isEmpty(context)){
            // 使用异步调用
            context.async = true;
            _doXhr(context);
        }
    };

    /**
     * 执行同步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doSync = function(context){
        if (!_util.isEmpty(context)){
            // 同步模式
            context.async = false;
            _doXhr(context);
        }
    };
};
