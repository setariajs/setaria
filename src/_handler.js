/**
 * 事件处理的句柄
 *
 * @namespace _handler
 * @version 1.0
 * @author HanL
 */
var _handler = new function(){
    "use strict";

    /**
     * 事件处理的前处理句柄
     * 每个事件处理执行前会被调用
     *
     * @public
     * @param {Event} evt 事件Event对象
     */
    this.doPreProcess = function(evt){
    };

    /**
     * 在事件处理发生异常时的句柄函数
     *
     * @public
     * @param {Error} e   异常对象
     * @param {Event} evt 事件Event对象
     */
    this.doCatch = function(e, evt){
        e = e.message ? e : new SystemMessage("SESYSM002E");
        // 在画面显示错误
        _ui.showMessage(e, "error");
    };

    /**
     * 事件处理的后处理句柄
     *
     * @public
     * @param {Event} evt 事件Event对象
     */
    this.doFinally = function(evt){
        if (_isNeedPrevent(evt)){
            // 取消事件的默认动作
            evt.preventDefault();
        }
    };

    /**
     * 判断当前事件执行后是否需要继续执行后续处理
     *
     * @private
     * @param  {Event}  evt 事件Event对象
     * @return {boolean} true则需要阻止后续处理
     */
    function _isNeedPrevent(evt){
        var ret = false;
        var domNode = null;

        if (evt && evt.target){
            // 当触发事件的节点类型为Form时，阻止Form提交
            if (evt.target.nodeName === "FORM"){
                ret = true;
            // 当触发事件的节点类型为A（链接），并且节点的href属性为#时，阻止#自动添加到当前Url中
            }else if (evt.target.nodeName === "A" &&
                evt.target.href.lastIndexOf("#") === evt.target.href.length - 1){
                ret = true;
            // // 当触发事件的节点的父节点为A（链接），并且节点的href属性为#时，阻止#自动添加到当前Url中
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
