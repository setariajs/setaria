/**
 * log输出模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _log = new function(){
    /**
     * 输出debug级别的log
     *
     * @public
     * @param {Anything} obj 输出的对象
     */
    function debug(obj){
        if (_config.DEBUG_MODE === "true"){
            console.log(obj);
        }
    }
    this.debug = debug;

    /**
     * 输出error级别的log
     *
     * @public
     * @param {Anything} exception 异常对象
     */
    function error(exception){
        var msgId = exception.messageId;
        msgId = _util.isEmpty(msgId) ? "" : msgId + " ";
        console.error(msgId + exception);
    }
    this.error = error;
};
