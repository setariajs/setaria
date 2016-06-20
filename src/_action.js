/**
 * Action控制模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _action = new function(){

    /**
     * 执行事件处理函数
     *
     * @public
     */
    function doAction(func, evt){
        var process = function(){
            try {
                // 执行事件处理函数的前处理
                if (_handler.doPreProcess) {
                    _handler.doPreProcess(evt);
                }
                // 执行事件处理函数
                func.call(null, evt);
            } catch (e) {
                // 错误信息输出到控制台
                _log.error(e.stack ? e.stack : e);
                // 执行事件处理函数的异常处理
                if (_handler.doCatch) {
                    _handler.doCatch(e, evt);
                }
            } finally {
                // 执行事件处理函数的后处理
                if (_handler.doFinally) {
                    _handler.doFinally(evt);
                }
            }
        };
        process.apply(this);
    }
    this.doAction = doAction;
};
