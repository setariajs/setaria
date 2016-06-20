/**
 * HTTP基础通信模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _http = new function(){

    /**
     * 执行Ajax请求
     *
     * @private
     * @param {HTTPContext} context Ajax请求的选项
     */
    var _doXhr = function(context){
        if (!_util.isEmpty(context)){
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
    };

    /**
     * 默认ajax通信失败处理函数
     *
     * @private
     * @param  {jqXHR}  jqXHR       JQueryXHR对象
     * @param  {string} textStatus  通信状态值("timeout", "error", "abort", "parsererror")
     * @param  {string} errorThrown 异常对象
     */
    var _defaultErrorHandler = function(jqXHR, textStatus, errorThrown){
        var errorMsg;
        var msgList = [];
        if (textStatus === "timeout"){
            errorMsg = new SystemMessage("SESYSM005E");
        }else{
            errorMsg = jqXHR.statusText;
        }
        msgList.push(errorMsg);
        _ui.showMessage(msgList, "error");
    };

    /**
     * 执行异步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    function doAsync(context){
        if (!_util.isEmpty(context)){
            // 使用异步调用
            context.async = true;
            _doXhr(context);
        }
    }
    this.doAsync = doAsync;

    /**
     * 执行同步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    function doSync(context){
        if (!_util.isEmpty(context)){
            // 同步模式
            context.async = false;
            _doXhr(context);
        }
    }
    this.doSync = doSync;
};
