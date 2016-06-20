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
        e = e.message ? e : new SystemMessage("SESYSM003E");
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
    	// 阻止FORM提交事件
    	if (evt && evt.target &&
                (evt.target.nodeName === "FORM" ||
                    (evt.target.nodeName === "A" &&
                        evt.target.href.lastIndexOf("#") === evt.target.href.length - 1))){
    		evt.preventDefault();
    	}
    }
    this.doFinally = doFinally;
};
