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
            context.timeout = _util.get(context, "timeout", defaultTimeout);
            var beforeSend = context.beforeSend;
            // 显示overlay
            if (!_util.isFunction(beforeSend)){
                context.beforeSend = function(xhr) {
                    // 显示Mask
                    _ui.toggleProcessing(true);
                };
            }
            // ajax通信失败时的处理
            if (_util.isFunction(context.error)){
                // 如果定义了失败时的回调函数
                context.error = context.error;
            }else{
                // 使用默认ajax通信失败处理
                context.error = _defaultErrorHandler;
            }
            context.complete = function() {
                // 隐藏显示的mask
                _ui.toggleProcessing(false);
            };
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
        // 显示网络错误
        _ui.showMessage([new SystemMessage("SESYSM006E")], "error");
        _log.error(_util.isEmpty(textStatus) ? textStatus : errorThrown);
    }

    /**
     * 执行异步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doAsync = function(context){
        // 使用异步调用
        context.async = true;
        return _doXhr(context);
    };

    /**
     * 执行同步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doSync = function(context){
        // 同步模式
        context.async = false;
        return _doXhr(context);
    };
};
