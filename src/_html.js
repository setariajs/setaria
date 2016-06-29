/**
 * HTML基本功能处理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _html = new function(){

    /**
     * 根据DOM节点ID取得对应的JQuery的DOM对象
     *
     * @private
     * @param  {string} id DOM ID
     * @return {Object} JQuery的DOM对象
     */
    var _byId = function(id){
        id = id.indexOf("#") === 0 ? id : "#" + id;
        return $(id);
    };

    /**
     * 把对应的事件绑定到指定DOM节点
     *
     * @private
     * @param  {string}   eventName 事件名称
     * @param  {Object}   selector  JQuery的选择器
     * @param  {Function} handler   事件触发后的回调函数
     */
    var _bindEvent = function(eventName, selector, handler){
        // 绑定事件
        selector.on(eventName, function(evt){
            _action.doAction(handler, evt);
        });
    };

    /**
     * 移除指定DOM节点上对应的事件处理函数
     *
     * @private
     * @param  {string}   eventName 事件名称
     * @param  {Object}   selector  JQuery的选择器
     */
    var _unBindEvent = function(eventName, selector){
        selector.off(eventName);
    };

    /**
     * 判断指定的DOM节点是否为Form控件
     *
     * @private
     * @param  {string}  id DOM ID
     * @return {boolean} 如果是Form控件，则返回true
     */
    var _isFormDOM = function(id){
        return _byId(id).prop("tagName") === "FORM";
    };

    /**
     * 取得Form内可使用控件的值
     *
     * @private
     * @param  {string} formId 表单控件ID
     * @return {Array}  表单内项目数组
     */
    var _serializeObject = function(formId){
        var ret = {};

        var serializeArray = _byId(formId).serializeArray();
        $.each(serializeArray, function(){
            if (!!ret[this.name]){
                if (!ret[this.name].push){
                    ret[this.name] = [ret[this.name]];
                }
                ret[this.name].push(this.value || '');
            } else {
                ret[this.name] = this.value || '';
            }
        });

        return ret;
    };


    /**
     * 对指定DOM的进行取值处理
     *
     * @public
     * @param  {string}            id DOM ID
     * @return {(Object | string)} 指定DOM的值
     */
    function getValue(id){
        var ret = null;
        if (!_util.isEmpty(id)){
            // Form控件的场合
            if(_isFormDOM(id)){
                ret = _serializeObject(id);
            // 其他场合
            }else {
                ret = _util.escape(_byId(id).val());
            }
        }
        return ret;
    }
    this.getValue = getValue;

    /**
     * 对指定DOM的进行设值处理
     *
     * @public
     * @param {string}            id   DOM ID
     * @param {(Object | string)} data 更新值
     */
    function setValue(id, data){
        _byId(id).val(data);
    }
    this.setValue = setValue;

    /**
     * 根据domId取得DOM
     *
     * @param  {string} domId DOM节点id
     * @return {DOMObject}
     */
    function byId(domId){
    	var domObj = _byId(domId);
    	return domObj.length > 0 ? domObj[0] : null;
    }
    this.byId = byId;

    /**
     * 对指定的控件进行校验
     *
     * TODO 未完成
     *
     * @public
     * @param  {string}           id      DOM ID
     * @param  {Function}         handler 校验处理后的回调函数
     * @return {(boolean | void)}
     */
    function validate(id, handler){
        var ret = true;

        return ret;
    }
    this.validate = validate;

    /**
     * 根据DOM ID使对应的DOM节点显示
     *
     * @public
     * @param {String} id DOM ID
     */
    function show(id){
        _byId(id).show();
    }
    this.show = show;

    /**
     * 根据DOM ID使对应的DOM节点隐藏
     *
     * @public
     * @param {String} id DOM ID
     */
    function hide(id){
        _byId(id).hide();
    }
    this.hide = hide;

    /**
     * 根据DOM ID使对应的DOM节点变成可用状态
     *
     * @public
     * @param {String} id DOM ID
     */
    function enable(id){
        _byId(id).prop("disabled", false);
    }
    this.enable = enable;

    /**
     * 根据DOM ID使对应的DOM节点变成不可用状态
     *
     * @public
     * @param {String} id DOM ID
     */
    function disable(id){
        _byId(id).prop("disabled", true);
    }
    this.disable = disable;

    /**
     * 删除对应的DOM节点
     *
     * @param  {string} id DOM的ID
     */
    function removeDomNodeById(id){
        _byId(id).remove();
    }
    this.removeDomNodeById = removeDomNodeById;

    /**
     * 删除对应的DOM节点
     *
     * @param  {Element} node DOM对象
     */
    function removeDomNode(node){
        var id = node.getAttribute("id");
        if (!_util.isEmpty(id)){
            _byId(id).remove();
        }else{
            $(node).remove();
        }
    }
    this.removeDomNode = removeDomNode;

    /**
     * 使用DOM ID进行DOM事件绑定
     *
     * @public
     * @param  {string}     id          DOM ID
     * @param  {string}     eventName   事件名称
     * @param  {Function}   handler     事件处理函数
     */
    function bindEventById(id, eventName, handler){
        _bindEvent(eventName, _byId(id), handler);
    }
    this.bindEventById = bindEventById;

    /**
     * 使用DOM Name进行DOM事件绑定
     *
     * @public
     * @param  {string}    name       DOM Name
     * @param  {string}    eventName  事件名称
     * @param  {Function}  handler    事件处理函数
     */
    function bindEventByName(name, eventName, handler){
        _bindEvent(eventName, $("[name='" + name + "']"), handler);
    }
    this.bindEventByName = bindEventByName;

    /**
     * 解除指定DOM节点的事件处理
     *
     * @public
     * @param  {string}    name       DOM Name
     * @param  {string}    eventName  事件名称
     */
    function unBindEventById(id, eventName){
        _unBindEvent(eventName, _byId(id));
    }
    this.unBindEventById = unBindEventById;
};
