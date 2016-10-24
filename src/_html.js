/**
 * HTML基本功能处理模块
 *
 * @namespace _html
 * @version 1.0
 * @author HanL
 */
var _html = new function(){
    "use strict";

    /**
     * 根据DOM节点ID取得对应的JQuery的DOM对象
     *
     * @private
     * @param  {string} id DOM ID
     * @return {Object} JQuery的DOM对象
     */
    function _byId(id){
        id = id.indexOf("#") === 0 ? id : "#" + id;
        return $(id);
    }

    /**
     * 把对应的事件绑定到指定DOM节点
     *
     * @private
     * @param  {string}   eventName 事件名称
     * @param  {Object}   selector  JQuery的选择器
     * @param  {Function} handler   事件触发后的回调函数
     */
    function _bindEvent(eventName, selector, handler){
        // 绑定事件
        selector.on(eventName, function(evt){
            _action.doAction(handler, evt);
        });
    }

    /**
     * 移除指定DOM节点上对应的事件处理函数
     *
     * @private
     * @param  {string}   eventName 事件名称
     * @param  {Object}   selector  JQuery的选择器
     */
    function _unBindEvent(eventName, selector){
        selector.off(eventName);
    }

    /**
     * 判断指定的DOM节点是否为Form控件
     *
     * @private
     * @param  {string}  id DOM ID
     * @return {boolean} 如果是Form控件，则返回true
     */
    function _isFormDOM(id){
        return _byId(id).prop("tagName") === "FORM";
    }

    /**
     * 取得Form内可使用控件的值
     *
     * @private
     * @param  {string} formId 表单控件ID
     * @return {Array}  表单内项目数组
     */
    function _serializeObject(formId){
        var ret = {};

        var serializeArray = _byId(formId).serializeArray();
        $.each(serializeArray, function(){
            // 对应的键值已存在的场合
            if (!_util.isEmpty(ret[this.name])){
                // 用数据存储在Form内具有相同name的控件的值
                // 如果值不是数组的场合
                if (!_util.isArray(ret[this.name])){
                    // 转换值为数组
                    ret[this.name] = [ret[this.name]];
                }
                // 存值
                ret[this.name].push(this.value || '');
            // 对应的键值不存在的场合
            } else {
                ret[this.name] = this.value || '';
            }
        });

        return ret;
    }

    /**
     * 根据DOM ID取得指定DOM的值
     *
     * @public
     * @param  {string}            id DOM ID
     * @return {(Object | string)} 指定DOM的值
     */
    this.getValue = function(id){
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
    };

    /**
     * 根据控件name属性值取得控件的值
     *
     * @todo 未实现
     *
     * @public
     * @param  {string} name 节点name属性值
     * @return {(Object | string)} 控件的值
     */
    this.getFormItemValueByName = function(name){

    };

    /**
     * 对指定DOM的进行设值处理
     *
     * @public
     * @param {string}            id   DOM ID
     * @param {(Object | string)} data 更新值
     */
    this.setValue = function(id, data){
        var domNode = _byId(id);
        // 如果DOM是form时
        if (domNode.is("form") && _util.isObject(data)){
            for (var key in data){
                this.setFormItemValueByName(key, data[key], domNode[0]);
            }
        // 当DOM为自定义控件时
        }else if (!_util.isEmpty(domNode.attr("data-widget-type"))){
            this._setWidgetValue(id, domNode.attr("data-widget-type"));
        // DOM为其他控件时
        }else{
            domNode.val(data);
        }
    };

    this._getWidgetValue = function(id, widgetType){
        var instance = Widget.prototype.createWidgetInstance(id, widgetType);
        return instance.getValue();
    };

    this._setWidgetValue = function(id, widgetType, value){
        var instance = Widget.prototype.createWidgetInstance(id, widgetType);
        instance.setValue(value);
    };

    /**
     * 设置Form表单内控件的值
     *
     * @public
     * @param {string}  name       控件name属性值
     * @param {string}  value      控件的值
     * @param {Element} parentNode 父节点
     */
    this.setFormItemValueByName = function(name, value, parentNode){
        var selector = null;
        if (parentNode){
            selector = $(parentNode).find("[name='" + name + "']");
        }else{
            selector = $("[name='" + name + "']");
        }
        if (selector.is(":checkbox") ||
            selector.is(":radio")){
            selector.each(function(){
                if (this.val() === value){
                    this.prop("checked", true);
                }else{
                    this.prop("checked", false);
                }
            });
        }else{
            selector.val(value);
        }
    };

    /**
     * 根据domId取得DOM
     *
     * @public
     * @param  {string} domId DOM节点id
     * @return {DOMObject} DOM节点对象
     */
    this.byId = function(domId){
        var domObj = _byId(domId);
        return domObj.length > 0 ? domObj[0] : null;
    };

    this._validate = function(dom){
        var ret = null;
        // require check
        if (dom.validity.valueMissing){
            ret = "valueMissing";
        }else if (dom.validity.patternMismatch){
            ret = "patternMismatch";
        }

        return ret;
    };

    /**
     * 对指定的控件进行校验
     *
     * @todo 未实现
     *
     * @public
     * @param  {string}           id      DOM ID
     * @param  {Function}         handler 校验处理后的回调函数
     * @return {(boolean | void)}
     */
    this.validate = function(id, handler){
        var ret = true;
        var that = this;

        _byId(id).find(":invalid").each(function(){
            var dom = this;
            var validityState = that._validate(dom);
            var error = {
                "dom": dom,
                "validityState": validityState
            };
            $(dom).on("focus.validate", function(){
                // 移除出错样式
                _ui.removeValidationStyle(dom);
            });
            if (!_util.isEmpty(validityState)){
                if (_util.isFunction(handler)){
                    if (!handler(error)){
                        _ui._showErrorMessage(error);
                    }
                }else{
                    _ui._showErrorMessage(error);
                }
                ret = false;
                // 只对第一个出错的项目进行处理
                return false;
            }
        });

        return ret;
    };

    /**
     * 根据DOM ID使对应的DOM节点显示
     *
     * @public
     * @param {string} id DOM ID
     */
    this.show = function(id){
        _byId(id).show();
    };

    /**
     * 根据DOM ID使对应的DOM节点隐藏
     *
     * @public
     * @param {string} id DOM ID
     */
    this.hide = function(id){
        _byId(id).hide();
    };

    /**
     * 根据DOM ID使对应的DOM节点变成可用状态
     *
     * @public
     * @param {string} id DOM ID
     */
    this.enable = function(id){
        var selector = _byId(id);
        // DOM节点为Form节点的场合
        if (selector.is("form")){
            selector = $("#" + id + " :input");
        }
        selector.prop("disabled", false);
    };

    /**
     * 根据DOM ID使对应的DOM节点变成不可用状态
     *
     * @public
     * @param {string} id DOM ID
     */
    this.disable = function(id){
        var selector = _byId(id);
        // DOM节点为Form节点的场合
        if (selector.is("form")){
            selector = $("#" + id + " :input");
        }
        selector.prop("disabled", true);
    };

    /**
     * 删除对应的DOM节点
     *
     * @param  {string} id DOM的ID
     */
    this.removeDomNodeById = function(id){
        _byId(id).remove();
    };

    /**
     * 删除对应的DOM节点
     *
     * @param  {Element} node DOM对象
     */
    this.removeDomNode = function(node){
        var id = node.getAttribute("id");
        if (!_util.isEmpty(id)){
            _byId(id).remove();
        }else{
            $(node).remove();
        }
    };

    /**
     * 使用DOM ID进行DOM事件绑定
     *
     * @public
     * @param  {string}     id          DOM ID
     * @param  {string}     eventName   事件名称
     * @param  {Function}   handler     事件处理函数
     */
    this.bindEventById = function(id, eventName, handler){
        _bindEvent(eventName, _byId(id), handler);
    };

    /**
     * 使用DOM Name进行DOM事件绑定
     *
     * @public
     * @param  {string}    name       DOM Name
     * @param  {string}    eventName  事件名称
     * @param  {Function}  handler    事件处理函数
     */
    this.bindEventByName = function(name, eventName, handler){
        _bindEvent(eventName, $("[name='" + name + "']"), handler);
    };

    /**
     * 解除指定DOM节点的事件处理
     *
     * @public
     * @param  {string}    name       DOM Name
     * @param  {string}    eventName  事件名称
     */
    this.unBindEventById = function(id, eventName){
        _unBindEvent(eventName, _byId(id));
    };
};
