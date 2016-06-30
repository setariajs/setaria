/**
 * 事件处理的句柄
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _handler = new function(){

    /**
     * 事件处理的前处理句柄
     * 每个事件处理执行前会被调用
     *
     * @public
     * @param {Object} evt 事件Event对象
     */
    function doPreProcess(evt){
    }
    this.doPreProcess = doPreProcess;

    /**
     * 在事件处理发生异常时的句柄函数
     *
     * @public
     * @param {Object} e   异常对象
     * @param {Object} evt 事件Event对象
     */
    function doCatch(e, evt){
        e = e.message ? e : new SystemMessage("SESYSM002E");
        // 在画面显示错误
        _ui.showMessage(e, "error");
    }
    this.doCatch = doCatch;

    /**
     * 事件处理的后处理句柄
     *
     * @public
     * @param {Object} evt 事件Event对象
     */
    function doFinally(evt){
        if (isNeedPrevent(evt)){
            // 取消事件的默认动作
            evt.preventDefault();
        }
    }
    this.doFinally = doFinally;

    /**
     * 判断当前事件执行后是否需要继续执行后续处理
     *
     * @param  {Object}  evt 事件Event对象
     * @return {boolean} true则需要阻止后续处理
     */
    function isNeedPrevent(evt){
        var ret = false;
        var domNode = null;

        if (evt && evt.target){
            if (evt.target.nodeName === "FORM"){
                ret = true;
            }else if (evt.target.nodeName === "A" &&
                evt.target.lastIndexOf("#") === evt.target.href.length - 1){
                ret = true;
            }else if ($(evt.target).parents("a").length > 0){
                domNode = $(evt.target).parents("a")[0];
                if (domNode.href.lastIndexOf("#") === domNode.href.length - 1){
                    ret = true;
                }
            }
        }

        return ret;
    }
};
