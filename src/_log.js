/**
 * log输出模块
 *
 * @namespace _log
 * @version 1.0
 * @author HanL
 */
var _log = new function(){
    "use strict";

    /**
     * 输出debug级别的log
     *
     * @public
     * @param {*} obj 输出的对象
     */
    this.debug = function(obj){
        if (_config.DEBUG_MODE === true){
            console.log(obj);
        }
    };

    /**
     * 输出error级别的log
     *
     * @public
     * @param {*} exception 异常对象
     */
    this.error = function(exception){
        var msgId = exception.messageId;
        msgId = _util.isEmpty(msgId) ? "" : msgId + " ";
        console.error(msgId + exception);
    };
};
