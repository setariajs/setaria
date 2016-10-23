/**
 * Action控制模块
 *
 * @namespace _action
 * @version 1.0
 * @author HanL
 */
var _action = new function(){
    "use strict";

    /**
     * 执行事件处理函数
     *
     * @public
     * @param {Function} func 回调函数
     * @param {Event}    evt  事件对象
     */
    this.doAction = function(func, evt){
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
    };
};
/**
 * 系统设定信息模块。
 *
 * @namespace _config
 * @version 1.0
 * @author HanL
 */
var _config = new function(){
    "use strict";

    /**
     * 取得本地配置文件时所使用的缓存值
     *
     * @public
     * @return {Function} 缓存值
     */
    this.createCacheToken = function(){
        return this.APP_REVISION ? this.APP_REVISION : Math.floor(Math.random() * 100000000000000);
    };

    /**
     * 取得当前的移动操作系统名称
     * Windows Phone, Android, iOS
     *
     * @public
     * @return {string} 移动操作系统名称
     */
    this.getMobileOperatingSystem = function(){
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var ret = "unknown";

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            ret = "Windows Phone";
        }else if (/android/i.test(userAgent)) {
            ret = "Android";
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        }else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            ret = "iOS";
        }

        return ret;
    };
};
/**
 * Cookie管理模块。
 *
 * @namespace _cookie
 * @version 1.0
 * @author HanL
 */
var _cookie = new function() {
    "use strict";

    /**
     * 读取一个cookie。如果cookie不存在返回null。
     *
     * @public
     * @param  {string} sKey 读取的cookie名
     * @return {string} cookie的值
     */
    this.getItem = function(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    };

    /**
     * 设置Cookie
     *
     * @public
     * @param  {string}  sKey     要创建或覆盖的cookie的名字
     * @param  {string}  sValue   cookie的值
     * @param  {string}  vEnd     最大年龄的秒数 (一年为31536e3， 永不过期的cookie为Infinity) ，
     *                            或者过期时间的GMTString格式或Date对象;
     *                            如果没有定义则会在会话结束时过期
     *                            (number – 有限的或 Infinity – string, Date object or null)。
     * @param  {string}  sPath    例如 '/', '/mydir'。 如果没有定义，默认为当前文档位置的路径。(string or null)。
     *                            路径必须为绝对路径
     * @param  {string}  sDomain  例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com'。
     *                            如果没有定义，默认为当前文档位置的路径的域名部分。
     * @param  {boolean} bSecure  cookie只会被https传输。
     * @return {boolean} 添加成功时返回true
     */
    this.setItem = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    };

    /**
     * 删除一个cookie。
     *
     * @public
     * @param  {string}  sKey    要移除的cookie名
     * @param  {string}  sPath   例如 '/', '/mydir'。 如果没有定义，默认为当前文档位置的路径。(string or null)。
     *                           路径必须为绝对路径（参见 RFC 2965）。
     * @param  {string}  sDomain 例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com'。
     *                           如果没有定义，默认为当前文档位置的路径的域名部分。
     * @return {boolean} true为删除成功，当对应的cookie不存在时返回false
     */
    this.removeItem = function(sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    };

    /**
     * 检查一个cookie是否存在
     *
     * @public
     * @param  {string}  sKey 要检查的cookie名
     * @return {boolean} 存在检查的cookie名时，返回true
     */
    this.hasItem = function(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };
};
/**
 * 公共数据保存模块
 *
 * @namespace _globalParam
 * @version 1.0
 */
var _globalParam = new function(){
    "use strict";

    /**
     * 数据持有对象
     * 使用localStorage进行数据存储
     *
     * @private
     * @type {Object}
     */
    var _store = window.localStorage;

    /**
     * 数据存储标识ID
     *
     * @private
     * @type {String}
     */
    var GP_KEY = "___global_param__";

    /**
     * 取得数据存储对象
     *
     * @private
     * @return {Object} 数据存储对象
     */
    function _getCacheObject(){
        var sessValueString = _store.getItem(GP_KEY) || "{}";
        return JSON.parse(sessValueString);
    }

    /**
     * 往数据存储对象中设值
     *
     * @private
     * @param {*} value 值
     */
    function _setCacheObject(value){
        _store.setItem(GP_KEY, JSON.stringify(value));
    }

    /**
     * 从数据存储对象中删除指定的值，当key没有指定时，清空数据存储对象
     *
     * @private
     * @param  {string} key 删除的值
     */
    function _removeCacheObject(key){
        if (_util.isEmpty(key)){
            _store.removeItem(GP_KEY);
        }else{
            var sessValue = _getCacheObject();
            delete sessValue[key];
            _setCacheObject(sessValue);
        }
    }

    /**
     * 设值内部实现函数
     *
     * @private
     * @param {string} key   键
     * @param {*}      值
     */
    function _set(key, value){
        var sessionValue = _getCacheObject();
        value = value ? value : "";
        sessionValue[key] = value;
        _setCacheObject(sessionValue);
    }

    /**
     * 取值内部实现函数
     *
     * @private
     * @param  {string} key 键
     * @return {*}      值
     */
    function _get(key){
        var sessionValue = _getCacheObject();
        return sessionValue[key];
    }

    /**
     * 删除指定的键值，当key没有输入时则删除全部
     *
     * @private
     * @param  {string} key 欲删除的值
     */
    function _clear(key){
        _removeCacheObject(key);
    }

    /**
     * 保存公共数据
     *
     * @public
     * @param {string}  key   键
     * @param {*}       value 保存的值
     */
    this.set = function(key, value){
        _set(key, value);
    };

    /**
     * 根据键取得公共数据
     *
     * @public
     * @param  {string} key   键
     * @return {*}      value 保存的值
     */
    this.get = function(key){
        return _get(key);
    };

    /**
     * 删除指定的值
     *
     * @public
     * @param  {string} key 键
     */
    this.clear = function(key){
        _clear(key);
    };
};
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
            var key = null;
            for (key in data){
                this.setFormItemValueByName(key, data[key], domNode[0]);
            }
        // DOM为其他控件时
        }else{
            domNode.val(data);
        }
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
        var errorMsg;
        var msgList = [];
        if (textStatus === "timeout"){
            errorMsg = new SystemMessage("SESYSM005E");
        }else{
            errorMsg = jqXHR.statusText;
        }
        msgList.push(errorMsg);
        _ui.showMessage(msgList, "error");
    }

    /**
     * 执行异步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doAsync = function(context){
        if (!_util.isEmpty(context)){
            // 使用异步调用
            context.async = true;
            _doXhr(context);
        }
    };

    /**
     * 执行同步ajax通信
     *
     * @public
     * @param  {HTTPContext} context HTTP通信设定对象
     */
    this.doSync = function(context){
        if (!_util.isEmpty(context)){
            // 同步模式
            context.async = false;
            _doXhr(context);
        }
    };
};
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
        if (_config.DEBUG_MODE === "true"){
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
/**
 * 消息管理模块
 *
 * @namespace _message
 * @version 1.0
 * @author HanL
 */
var _message = new function(){
    "use strict";

    /**
     * 无法取得业务消息文件。
     *
     * @const
     * @type {string}
     */
    var MESSAGE_FILE_NOT_EXIST_MSG = "无法取得业务消息文件。";

    /**
     * 无法取得系统消息文件。
     *
     * @const
     * @type {string}
     */
    var SYS_MESSAGE_FILE_NOT_EXIST_MSG = "无法取得系统消息文件。";

    /**
     * 业务消息缓存
     *
     * @private
     * @type {Object}
     */
    var _messageObject = null;

    /**
     * 系统消息缓存
     *
     * @private
     * @type {Object}
     */
    var _systemMessageObject = null;

    /**
     * 根据指定消息ID取得消息内容
     *
     * @private
     * @param  {string}  id 消息ID
     * @param  {Boolean} isSystemMessage true为取系统公共消息,false为取系统业务消息
     * @return {string}  消息内容
     */
    function _getMessage(id, isSystemMessage){
        var ret = null;
        // 消息文件路径
        var filePath = (isSystemMessage === true) ? _config.SYSMESSAGE_FILE :
            _config.MESSAGE_FILE;
        var messageContent = null;
        // 取得系统公共消息的场合
        if (isSystemMessage === true){
            // 第一次取得系统公共消息的场合
            if (_util.isEmpty(_systemMessageObject)){
                _systemMessageObject = _util.getFileContent(filePath, "json");
            }
            messageContent = _systemMessageObject;
        // 取得系统业务消息的场合
        }else{
            // 第一次取得系统业务消息的场合
            if (_util.isEmpty(_messageObject)){
                _messageObject = _util.getFileContent(filePath, "json");
            }
            messageContent = _messageObject;
        }
        // 无法取得消息文件的场合
        if (_util.isObject(messageContent) &&
                messageContent.textStatus === "error"){
            if (isSystemMessage === true){
                ret = SYS_MESSAGE_FILE_NOT_EXIST_MSG;
            }else{
                ret = MESSAGE_FILE_NOT_EXIST_MSG;
            }
        }else{
            ret = messageContent[id];
            if (_util.isEmpty(ret)){
                ret = '没有找到指定的消息。 (id=' + id + ')';
            }
        }
        return ret;
    }

    /**
     * 使用参数填充自定义的消息模版
     *
     * @private
     * @param  {string} template 定义在消息定义模块的消息模版
     * @param  {Array}  parameters 参数数组
     * @return {string} 消息字符串
     */
    function _format(template, parameters){
        if (!_util.isEmpty(parameters)){
            for (var i = 0; i < parameters.length; i++){
                template = template.split("\{" + i + "\}").join(parameters[i]);
            }
        }
        return template;
    }

    /**
     * 取得一般消息
     *
     * @public
     * @param  {string}  id 消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  消息字符串
     */
    this.getMessage = function(id, parameters){
        return _format(_getMessage(id, false), parameters);
    };

    /**
     * 取得系统消息
     *
     * @public
     * @param  {string}  id 系统消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  系统消息字符串
     */
    this.getSystemMessage = function(id, parameters){
        return _format(_getMessage(id, true), parameters);
    };
};
/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
 var _setaria = new function(){
    "use strict";

    /**
     * 取得Setaria配置信息
     *
     * @private
     * @return {Boolean} 配置信息取得成功的场合，返回true
     */
    function _loadConfig(){
        var ret = false;
        $("script").each(function(){
            // 配置文件路径
            var dataConfig = $(this).attr("data-setaria-config");
            // 配置文件内容
            var configContent = null;

            if (!_util.isEmpty(dataConfig)){
                // 取得配置文件内容
                configContent = _util.getFileContent(dataConfig, "json");

                // 无法取得配置文件的场合
                if (_util.isEmpty(configContent) ||
                        (!_util.isEmpty(configContent.textStatus) &&
                            configContent.textStatus === "error")){
                    _ui.showMessage("无法读取客户端系统配置文件。", "error");
                }else{
                    // 复制配置信息
                    $.each(configContent, function(key, value){
                        _config[key] = value;
                    });
                    ret = true;
                }
                // 退出循环
                return false;
            }
        });
        return ret;
    }

    /**
     * 启动函数
     *
     * @param {Function} hanlder
     * @public
     */
    this.start = function(handler){
        // 取得配置信息
        var loadConfigResult = _loadConfig();
        // 当成功加载配置文件时
        if (loadConfigResult){
            // 更新引用文件的缓存
            // this.appendTokenOnImportFile();
            // 加载viewModel
            // 默认ViewModel的配置文件
            var defaultViewModelConfigFile = _config.VIEWMODEL_CONFIG_FILE;
            // 初期化ViewModelController
            window._viewModelController = new ViewModelController(defaultViewModelConfigFile);
            // 绑定Hash Change事件
            this.bindHashChange();
            if (_util.isFunction(handler)){
                handler();
            }
            // 跳转页面
            this.dispatcher(window._viewModelController);
        }
    };

    /**
     * 绑定window的hashchange事件
     *
     * @public
     */
    this.bindHashChange = function(){
        $(window).on("hashchange", this.doHashChange);
    };

    /**
     * window的hashchange事件处理
     *
     * @public
     */
    this.doHashChange = function(){
        // TODO 点击了浏览器的回退按钮的场合，如何进行判断，是否引入history?
    };

    /**
     * Customize Dispatcher
     *
     * @public
     * @param  {ViewModelController} vmController 当前VMController实例
     */
    var dispatcher = function(vmController){
        this.defaultDispatcher(vmController);
    };
    this.dispatcher = dispatcher;

    /**
     * 默认跳转逻辑
     *
     * @public
     * @param  {ViewModelController} vmController 当前VMController实例
     */
    this.defaultDispatcher = function(vmController){
        // 当前的Hash值
        var hash = window.location.hash;
        // ViewModel的映射路径
        var path = null;
        // ViewModel的参数
        var param = null;
        // 目标跳转画面的信息
        var viewModelParams = [];

        // 如果存在页面跳转定义
        if (!_util.isEmpty(hash) && hash !== "#"){
            // 根据Hash值取得已配置的View的Url映射路径
            path = vmController.getViewPathFromHash(hash);
            // 没有找到对应的View
            if (_util.isEmpty(path)){
                // 跳转至首页
                _ui.forwardTo(_config.WELCOME_PAGE);
            }else{
                // 组装目标跳转画面的信息
                viewModelParams[0] = path;
                // 取得path后的字符作为参数传给ViewModel
                param = hash.substring(hash.indexOf(path) + path.length);
                viewModelParams[1] = param;
                // 画面跳转
                _ui.forwardTo.apply(_ui, viewModelParams);
            }
        }else{
            // 跳转至首页
            _ui.forwardTo(_config.WELCOME_PAGE);
        }
    };
 };
/**
 * 复杂UI功能模块
 *
 * @namespace _ui
 * @version 1.0
 * @author HanL
 */
var _ui = new function(){
    "use strict";

    /**
     * HTML换行Tag
     *
     * @private
     * @const
     * @type {string}
     */
    var HTML_TAG_BREAK = "<br\>";

    /**
     * 当前mask的状态
     *
     * @private
     * @type {boolean}
     */
    var _processingStatus = false;

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
     * 显示模式化确认窗口
     *
     * @public
     * @param  {Object} param 模式化窗口设置参数
     */
    this.showDialog = function(param){
        alert("Dialog -> title :: " + param.title + ", message :: " + param.message);
    };

    /**
     * 切换mask的显示／隐藏
     *
     * @public
     * @param {Boolean} isDisp 是否显示标志位
     */
    this.toggleProcessing = function(isDisp){
        var loadingNode = $("#" + _config.LOADING_ID);
        if (isDisp){
            loadingNode.show();
        }else{
            loadingNode.hide();
        }
    };

    /**
     * 在画面中显示指定的消息
     *
     * @public
     * @param  {(Array | Message | string)} messageObject 指定的消息
     * @param  {string}                     type          消息类型, info[正常] || error[错误]
     * @param  {Function}                   handler       关闭按钮点击时的回调函数
     */
    this.showMessage = function(messageObject, type, handler){
        var messageArr = [];
        var messageId = "";
        var messageContent = "";
        var doneCallback = null;
        if (!_util.isEmpty(messageObject)){
            // 指定的消息是数组的场合
            if (_util.isArray(messageObject)){
                $.each(messageObject, function(index, item){
                    // messageId = item.messageId || item.id || "";
                    messageArr.push(!!item.message ? item.message : item);
                    messageArr.push(HTML_TAG_BREAK);
                });
            // 指定的消息是对象的场合
            }else if (_util.isObject(messageObject)){
                messageId = messageObject.messageId || "";
                messageArr.push(_util.isObject(messageObject) ? messageObject.message : messageObject);
            // 其他类型的场合，转换为字符串
            }else{
                messageArr.push(messageObject + "");
            }
            if (_util.isFunction(handler)){
                doneCallback = function(){
                    handler();
                };
            }
            // 在画面显示消息
            this.showDialog({
                "title": type !== "error" ? "消息" : "错误",
                "type": type,
                "message": messageArr.join("<br/>"),
                "doneText": "关闭",
                "doneCallback": doneCallback,
                "doneOnly": true
            });
        }
    };

    /**
     * 显示模态窗口
     *
     * @public
     * @param  {string}   title      窗口的标题
     * @param  {string}   message    窗口的内容
     * @param  {Function} handler    确认和取消按钮点击后的回调函数
     * @param  {string}   cancelText 取消按钮的显示文字，默认为［取消］
     * @param  {string}   doneText   确认按钮的显示文字，默认为［确认］
     */
    this.showModalDialog = function(title, message, handler, cancelText, doneText){
        title = _util.isEmpty(title) ? "确认窗口" : title;
        doneOnly = _util.isEmpty(doneText) && !_util.isEmpty(cancelText);
        doneText = doneText || "确认";
        cancelText = cancelText || "取消";
        // 确认按钮点击后的回调函数
        var doneCallback = function(){
            handler(true);
        };
        // 取消按钮点击后的回调函数
        var cancelCallback = function(){
            handler(false);
        };
        // 显示模态窗口
        this.showDialog({
            "title": title,
            "message": message,
            "doneText": doneText,
            "cancelText": cancelText,
            "doneCallback": doneCallback,
            "cancelCallback": cancelCallback,
            "doneOnly": doneOnly
        });
    };

    /**
     * 跳转到指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    this.forwardTo = function(pageId){
        _viewModelController.forwardTo.apply(_viewModelController, arguments);
    };

    /**
     * 返回至指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    this.backTo = function(pageId){
        _viewModelController.backTo.apply(_viewModelController, arguments);
    };

    /**
     * 取得业务画面的HTML，并在指定区域更新
     *
     * @public
     * @param  {string} viewModelTemplateUrl 模版的路径
     * @param  {Object} handler              页面加载完成的回调函数
     */
    this.updateHTML = function(viewModelTemplateUrl, handler){
        // 对应画面的HTML文件
        var viewModelTemplateHTML = null;

        // 取得HTML文件中的内容
        if (!_util.isEmpty(viewModelTemplateUrl)){
            viewModelTemplateHTML = _util.getFileContent(viewModelTemplateUrl, "html");
            // 无法加载指定Html文件的场合
            if (_util.isObject(viewModelTemplateHTML)){
                if (viewModelTemplateHTML.textStatus === "error"){
                    _ui.showMessage(new SystemMessage("SESYSM001E"), "error");
                }
            }else{
                // 在指定区域刷新取得的HTML文本
                $("#" + _config.MAIN_AREA_ID).html(viewModelTemplateHTML);
            }
        }
        // 调用回调函数
        handler();
    };

    /**
     * 更新画面标题
     *
     * @public
     * @param  {string} title 标题内容
     */
    this.updateDocumentTitle = function(title){
        title = _util.isEmpty(title) ? "" : title;
        if (!_util.isEmpty(title)){
            document.title = title;
        }
    };
};
/**
 * URL模块
 * 用于处理Url相关逻辑
 *
 * @namespace _url
 * @version 1.0
 * @author HanL
 */
var _url = new function(){
    "use strict";

    /**
     * 用于分割Hash
     *
     * @private
     * @type {string}
     */
    var SPLIT_CHAR = "/";

    /**
     * url历史地址列表
     * 最新的url在数组前面
     *
     * @private
     * @type {Array}
     */
    var _urlHistory = [];

    var _index = 0;

    this.forward = function(url){
        _index++;
        while(_urlHistory.length > 0){
            // 退回到之前的url后再forward的场合，删除从退至的url到顶部之间的url
            if (_urlHistory[0].index >= _index){
                // 删除数组最前面的元素
                _urlHistory.shift();
            }else{
                break;
            }
        }

        // 将url添加至数组前方
        _urlHistory.unshift({
            "index": _index,
            "url": url
        });
    };

    this.back = function(url){
        var ret = 0;
        var i = 0;
        if (!_util.isEmpty(_urlHistory)){
            for (i = 0; i < _urlHistory.length; i++){
                if (_urlHistory[i].url === url){
                    // 回退index
                    _index = _urlHistory[i].index;
                    break;
                }
                ret++;
            }
            if (ret !== _urlHistory.length){
                ret = -(ret + 1);
            }else{
                ret = 0;
            }
        }
        return ret;
    }

    /**
     * 获取当前窗口的完整Url
     *
     * @public
     * @return {string} 当前窗口的完整Url
     */
    this.getCurrentUrl = function(){
        return window.location.href;
    };

    /**
     * 取得Url中的Hash参数
     *
     * @public
     * @return {Array} Hash参数数组
     */
    this.getHashParams = function(){
        var ret = null;
        var hash = window.location.hash;

        // hash不为空并且第一个字符为#
        if (!_util.isEmpty(hash) && hash.indexOf("#") === 0){
            // 去掉#
            hash = hash.substring(1);
            ret = hash.split(SPLIT_CHAR);
        }

        return ret;
    };

    /**
     * 设定Url中的参数
     *
     * @public
     * @param {string} uri      uri
     * @param {Object} paramObj 参数对象
     */
    this.setUrlParameter = function(uri, paramObj){
        var ret = uri;
        var separator = "";
        var hashString = "";
        var hashIndex = 0;

        if (!_util.isEmpty(uri)){
            hashIndex = uri.indexOf("#");
            if (hashIndex !== -1){
                hashString = uri.substring(hashIndex);
                ret = uri.substring(0, hashIndex);
            }
            separator = ret.indexOf("?") !== -1 ? "&" : "?";
            ret += separator + $.param(paramObj);
            if (!_util.isEmpty(hashString)){
                ret += hashString;
            }
        }

        return ret;
    };

    /**
     * 取得Url中的参数
     * 如果不指定参数名称则取得所有参数
     *
     * @public
     * @param  {string} paramName 参数名称
     * @return {Object} 包含url参数的对象
     */
    this.getUrlParameter = function(paramName){
        var ret = {};
        var urlParam = window.location.search.substring(1);
        var urlVariables = urlParam.split('&');
        var paramArr = null;

        for (var i = 0; i < urlVariables.length; i++) {
            // 考虑参数中存在＝的情况
            paramArr = urlVariables[i].split("=");

            if (_util.isEmpty(paramName)){
                ret[paramArr[0]] = paramArr[1];
            }else{
                if (paramArr[0] === paramName) {
                    ret = paramArr[1];
                    break;
                }
            }
        }
        return ret;
    };

    /**
     * Url跳转
     *
     * @public
     * @param  {string}  url       目标Url
     * @param  {boolean} isReplace true的时候，重定向，false的时候，画面跳转
     */
    this.redirectTo = function(url, isReplace){
        if (isReplace){
            window.location.replace(url);
        }else{
            window.location.href = url;
        }
    };

    /**
     * 跳转至指定的错误页面
     *
     * @public
     * @param  {string} page 错误页面名称
     */
    this.redirectToErrorPage = function(page){
        this.redirectTo(_config.HTML_ROOT_DIR +
            _config.HTML_ERROR_DIR +
            page +
            ".html", true);
    };

    /**
     * 清除Url中的参数
     *
     * @public
     */
    this.clearUrlParameter = function(){
        var search = window.location.search;
        var href = window.location.href;
        href = href.replace(search, "");
        window.history.replaceState(null, null, href);
    };

    /**
     * 清除Url中的Hash值
     *
     * @public
     */
    this.clearHash = function(){
        var href = window.location.href;
        if (href.indexOf("#") !== -1){
            href = href.substring(0, href.indexOf("#"));
        }
        window.history.replaceState(null, null, href);
    };
};
/**
 * 公用函数模块
 * 提供了开发中常用的类型判断，字符串处理等函数
 *
 * @namespace _util
 * @version 1.0
 * @author HanL
 */
var _util = new function(){
    "use strict";

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    var _rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

    /** Used to match backslashes in property paths. */
    var _reEscapeChar = /\\(\\)?/g;

    /** 用于HTML转义. */
    var _htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;'
    };

    /** 用于html字符转义判断 */
    var _reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g;
    var _reUnescapedHtml = /[&<>"'`]/g;
    var _reHasEscapedHtml = RegExp(_reEscapedHtml.source);
    var _reHasUnescapedHtml = RegExp(_reUnescapedHtml.source);

    /* 使用Object原型hasOwnProperty函数 */
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    /* 使用Object原型propertyIsEnumerable函数 */
    var _propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

    /**
     * 在escape函数使用，用于替换html特殊字符.
     *
     * @private
     * @param   {string} 欲转义的HTML字符
     * @returns {string} 转义后的字符.
     */
    function _escapeHtmlChar(chr) {
        return _htmlEscapes[chr];
    }

    /**
     * 检查值的原型类是否是对象Object
     *
     * @private
     * @param   {*}        检查的值
     * @returns {Boolean}  如果是对象返回true,否则返回false
     */
    function _isObjectLike(value) {
        return !!value && typeof value === "object";
    }

    /**
     * 检查输入值是否是合法的数组的length属性
     *
     * @private
     * @param  {*}         value 检查的值
     * @return {Boolean}   如果是合法的数组的Length属性，返回true，否则返回false
     */
    function _isLength(value) {
        return typeof value == "number" &&
            value > -1 &&
            value % 1 === 0 &&
            value <= MAX_SAFE_INTEGER;
    }

    /**
     * 把值转换为字符串，如果值为空，则返回空字符串
     *
     * @private
     * @param  {*}        value 检查的值
     * @return {string}   字符串
     */
    function _toString(value) {
        return value === null ? "" : (value + "");
    }

    /**
     * 把输入值转换成对象
     *
     * @private
     * @param   {*}        输入值
     * @returns {Object}   转换出的对象
     */
    function _toObject(value) {
        return _util.isObject(value) ? value : Object(value);
    }

    /**
     * 根据属性名从指定对象中取得对应的值
     *
     * @private
     * @param   {Object} object   查询的对象
     * @param   {Array}  path     属性的路径
     * @param   {string} pathKey  属性的准确描述
     * @returns {*}      Returns  查询到的值
     */
    function _baseGet(object, path, pathKey) {
          if (object === null || object === undefined) {
              return;
          }
          if (pathKey !== undefined && pathKey in _toObject(object)) {
              path = [pathKey];
          }
          var index = 0;
          var length = path.length;

          while (object !== null && index < length) {
              object = object[path[index++]];
          }
          return (index && index == length) ? object : undefined;
    }

    /**
     * 属性字符串转换成数组.
     *
     * @private
     * @param   {*}      属性字符串
     * @returns {Array}  属性数组
     */
    function _toPath(value) {
          if (_util.isArray(value)) {
              return value;
          }
          var result = [];
          _baseToString(value).replace(_rePropName, function(match, number, quote, string) {
                result.push(quote ? string.replace(_reEscapeChar, '$1') : (number || match));
          });
          return result;
    }

    /**
     * 把输入值转换为字符串类型
     *
     * @private
     * @param   {*}       value 输入值
     * @returns {string}  转换的字符串
     */
    function _baseToString(value) {
        return value === null ? '' : (value + '');
    }

    /**
     * 从对象中取得指定属性的值
     * 更多的时候是为了通过简化书写的方式调用不同类型对象内部的相同函数
     * 譬如toString
     *
     * @private
     * @param   {string}  key 函数名
     * @returns {*}       属性的值
     */
    function _baseProperty(key) {
        return function(object) {
            return object === null ? undefined : object[key];
        };
    }

    /**
     * 取得对象的length属性
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     */
    var _getLength = _baseProperty('length');

    /**
     * 检查输入值拥有length属性
     *
     * @private
     * @param   {*}        value 输入值
     * @returns {Boolean}  输入值拥有length属性的场合，返回true
     */
    function _isArrayLike(value) {
        return value !== null && _isLength(_getLength(value));
    }

    /**
     * 检查输入值是否为空，无法判断基本类型（整数，布尔）
     *
     * @public
     * @param  {Array|Object|string}  value 检查的值
     * @return {Boolean}              值为空的场合，返回true
     */
    this.isEmpty = function(value){
        if (value === null || value === undefined) {
            return true;
        }
        if (_isArrayLike(value) && (this.isArray(value) || this.isString(value) || this.isArguments(value) ||
              (_isObjectLike(value) && this.isFunction(value.splice)))) {
            return !value.length;
        }
        return !this.keys(value).length;
    };

    /**
     * 判断值的类型是否为字符串
     *
     * @example
     * _util.isString('abc');
     * // => true
     *
     * _util.isString(1);
     * // => false
     *
     * @param  {*}        value 检查的值
     * @return {Boolean}  值的类型为字符串的场合，返回true
     */
    this.isString = function(value){
        return typeof value == 'string' ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object String]");
    };

    /**
     * 检查值的类型是否为数字
     *
     * @example
     * _util.isNumber(8.4);
     * // => true
     *
     * _util.isNumber(NaN);
     * // => true
     *
     * _util.isNumber('8.4');
     * // => false
     *
     * @public
     * @param  {*}         value 检查的值
     * @return {Boolean}   值为数字的场合，返回true
     */
    this.isNumber = function(value){
        return typeof value == 'number' ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object Number]");
    };

    /**
     * 检查值的类型是否为布尔值
     *
     * @example
     * _util.isBoolean(false);
     * // => true
     *
     * _util.isBoolean(null);
     * // => false
     *
     * @public
     * @param  {*}         value 检查的值
     * @return {Boolean}   值的类型为布尔的场合，返回true
     */
    this.isBoolean = function(value){
        return value === true ||
            value === false ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object Boolean]");
    };

    /**
     * 检查值的类型是否为数组
     *
     * @public
     * @param  {*}        value 检查的值
     * @return {Boolean}  当值的类型为数组时返回true，否则返回false
     */
    this.isArray = function(value){
        return _isObjectLike(value) &&
            _isLength(value.length) &&
            Object.prototype.toString.call(value) == "[object Array]";
    };

    /**
     * 检查值的类型是否为对象
     * 数组，函数，正则表达式，new Number和new String的情况会返回true
     *
     * @public
     * @param  {*}         value 检查的值
     * @return {Boolean}   当值的类型为对象时返回true，否则返回false
     */
    this.isObject = function(value){
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
    };

    /**
     * 检查值的类型是否为函数
     *
     * @public
     * @param  {*}         value 检查的值
     * @return {Boolean}   当值的类型为函数时返回true，否则返回false
     */
    this.isFunction = function(value){
        return this.isObject(value) &&
            Object.prototype.toString.call(value) == "[object Function]";
    };

    /**
     * 检查值的类型是否为arguments对象
     *
     * @example
     * _util.isArguments(function() { return arguments; }());
     * // => true
     *
     * _util.isArguments([1， 2, 3]);
     * // => false
     *
     * @public
     * @param {Object} value 检查的对象
     */
    this.isArguments = function(value) {
          return _isObjectLike(value) && _isArrayLike(value) &&
            _hasOwnProperty.call(value, 'callee') && !_propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * 检查指定对象中是否存在指定的键值
     *
     * @example
     * _util.has(object, 'a');
     *
     * @public
     * @param  {Object}  object 检查的对象
     * @param  {string}  key    查找的键值
     * @return {Boolean} 当对象中存在指定键值时返回true,否则返回false
     */
    this.has = function(object, key){
        return _hasOwnProperty.call(object, key);
    };

    /**
     * 从对象中取出指定的键值，如果对应的键值不存在，则返回默认值
     *
     * @public
     * @param  {Object}         object       取值对象
     * @param  {Array | string} path         指定的键值
     * @param  {*}              defaultValue 默认值
     * @return {*}              在对象中所对应的值
     */
    this.get = function(object, path, defaultValue){
        var result = object === null ? undefined : _baseGet(object, _toPath(path), (path + ''));
        return result === undefined ? defaultValue : result;
    };

    /**
     * 取得指定对象中存在的key
     *
     * @public
     * @param  {Object} object 处理的对象
     * @return {Array}  键值数组
     */
    this.keys = function(object){
        return this.isObject(object) ? Object.keys(object) : [];
    };

    /**
     * 转换日期对象到指定格式字符串
     *
     * @example
     *
     * "yyyy-MM-dd E HH:mm:ss" ==> 2009-03-10 二 20:09:04
     * "yyyy-MM-dd EE hh:mm:ss" ==> 2009-03-10 周二 08:09:04
     * "yyyy-MM-dd EEE hh:mm:ss" ==> 2009-03-10 星期二 08:09:04
     *
     * @public
     * @param  {Date}   dateObj
     * @param  {string} fmt      输出日期格式
     * @return {string} 指定格式字符串
     */
    this.dateFormat = function(dateObj, fmt){
        var o = {
            "M+" : dateObj.getMonth()+1, //月份
            "d+" : dateObj.getDate(), //日
            "h+" : dateObj.getHours()%12 === 0 ? 12 : dateObj.getHours()%12, //小时
            "H+" : dateObj.getHours(), //小时
            "m+" : dateObj.getMinutes(), //分
            "s+" : dateObj.getSeconds(), //秒
            "q+" : Math.floor((dateObj.getMonth()+3)/3), //季度
            "S" : dateObj.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "日",
            "1" : "一",
            "2" : "二",
            "3" : "三",
            "4" : "四",
            "5" : "五",
            "6" : "六"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[dateObj.getDay()]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * 对特殊字符进行转义
     * "&", "<", ">", '"', "'", 和 "`"
     *
     * @param  {string} value 字符串
     * @return {string} 转义后的字符串
     */
    this.escape = function(value){
        value = _baseToString(value);
        return (value && _reHasUnescapedHtml.test(value)) ?
            value.replace(_reUnescapedHtml, _escapeHtmlChar) :
            value;
    };

    /**
     * 读取本地配置文件
     *
     * @param  {string} filePath 配置文件路径
     */
    this.getFileContent = function(filePath, dataType){
        var ret = null;
        var contextPath = window.location.pathname;
        var configContent = null;
        var pathIndex = 0;
        var fileAbsolutePath = window.location.origin;
        var context = new HTTPContext();

        // 取得配置文件绝对路径
        if (!_util.isEmpty(contextPath) &&
            contextPath !== "/"){
            contextPath = contextPath.substring(1);
            if (contextPath.split("/")[0].indexOf(".") === -1){
                pathIndex = contextPath.indexOf("/");
                if (pathIndex !== -1){
                    contextPath = "/" + contextPath.substring(0, pathIndex + 1);
                }
            }else{
                contextPath = "/";
            }
        }
        fileAbsolutePath += contextPath + filePath;

        context.url = fileAbsolutePath + "?_=" + _config.createCacheToken();
        context.method = "GET";
        context.dataType = dataType ? dataType : "text";
        context.error = function(jqXHR, textStatus, errorThrown){
            ret = {
                "jqXHR": jqXHR,
                "textStatus": textStatus,
                "errorThrown": errorThrown
            };
        };
        context.success = function(res){
            ret = res;
        };
        _http.doSync(context);
        return ret;
    };
};
/**
 * HTTP通信参数设定模块
 *
 * @class
 * @param {string}            url         请求的地址
 * @param {string}            method      ajax请求方式(GET, POST等)
 * @param {string}            dataType    预期服务器返回的数据类型
 * @param {string}            contentType 发送信息至服务器时内容编码类型
 * @param {(object | string)} data        发送到服务器的数据
 * @param {Function}          success     ajax通信成功时的回调函数
 * @param {Function}          error       ajax通信失败时的回调函数
 * @param {Function}          complete    ajax通信完成时的回调函数
 * @param {Function}          beforeSend  ajax通信执行前的回调函数
 *
 * @version 1.0
 * @author HanL
 */
var HTTPContext = function(url, method, dataType, contentType, data, success, error, complete, beforeSend){

    /**
     * 请求的地址
     *
     * @public
     * @type {string}
     */
    this.url = url;

    /**
     * ajax请求方式(GET, POST等)
     *
     * 支持HTTP标准请求
     *
     * GET、POST、PUT、DELETE
     *
     * @public
     * @type {string}
     */
    this.method = method;

    /**
     * 预期服务器返回的数据类型
     *
     * @public
     * @type {string}
     */
    this.dataType = dataType;

    /**
     * 发送信息至服务器时内容编码类型
     *
     * @public
     * @type {string}
     */
    this.contentType = contentType;

    /**
     * 发送到服务器的数据
     *
     * @public
     * @type {(object | string)}
     */
    this.data = data;

    /**
     * ajax通信成功时的回调函数
     *
     * @public
     * @type {Function}
     */
    this.success = success;

    /**
     * ajax通信失败时的回调函数
     *
     * @public
     * @type {Function}
     */
    this.error = error;

    /**
     * ajax通信完成时的回调函数
     *
     * @public
     * @type {Function}
     */
    this.complete = complete;

    /**
     * ajax通信执行前的回调函数
     *
     * @public
     * @type {Function}
     */
    this.beforeSend = beforeSend;
};
/**
 * 消息定义类
 *
 * @example
 * var msg = new Message("MSG001", [""])
 *
 * @class
 * @param {string} messageId  消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var Message = function(messageId, parameters){

    /**
     * 消息ID
     *
     * @type {string}
     * @public
     */
    this.messageId = messageId;

    /**
     * 消息内容
     *
     * @type {string}
     * @public
     */
    this.message = _message.getMessage(messageId, parameters);

    /**
     * 返回消息内容
     *
     * @public
     * @return {string} 消息内容
     */
    this.toString = function(){
        return this.message;
    };
};
/**
 * 系统级别消息处理类
 *
 * @class
 * @param {string} messageId  系统消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var SystemMessage = function(messageId, parameters){

    /**
     * 系统消息ID
     *
     * @public
     * @type {string}
     */
    this.messageId = messageId;

    /**
     * 系统消息内容
     *
     * @public
     * @type {string}
     */
    this.message = _message.getSystemMessage(messageId, parameters);

    /**
     * 返回系统消息内容
     *
     * @public
     * @return {String} 系统消息内容
     */
    this.toString = function(){
        return this.message;
    };
};
/**
 * 输入值校验消息处理类
 *
 * @class
 * @param {string} elementId  节点ID
 * @param {string} messageId  消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var ValidationMessage = function(elementId, messageId, parameters){

    /**
     * 节点ID
     *
     * @type {string}
     * @public
     */
    this.elementId = elementId;

    /**
     * 校验消息ID
     *
     * @type {string}
     * @public
     */
    this.messageId = messageId;

    /**
     * 校验消息内容
     *
     * @type {string}
     * @public
     */
    this.message = _message.getMessage(messageId, parameters);

    /**
     * 返回校验消息内容
     *
     * @public
     * @return {String} 校验消息内容
     */
    this.toString = function(){
        return this.message;
    };
};
/**
 * View画面管理模块
 *
 * @class
 * @version 1.0
 * @author HanL
 */
var ViewModelController = function(configFilePath, completeHandler){

    // 初期化ViewModel配置对象
    var _viewModelConfigs = null;

    // 业务画面缓存对象
    var _viewModelCacheObject = {};

    // 最近一次使用的ViewModel对象
    var _currentViewModelInfo = null;

    /**
     * 取得ViewModelConfig
     *
     * @private
     */
    function _initialViewModelConfig(){
        var config = null;
        // 画面ID对应的VM Class名
        var viewModelClassName = "";
        // 取得VM Class定义
        var ViewModelClass = null;
        // 取得指定的ViewModelConfig
        _viewModelConfigs = _util.getFileContent(configFilePath, "json");
        // 在系统启动时预加载所有配置的ViewModel
        // if (!_util.isEmpty(_viewModelConfigs)){
        //     for (var key in _viewModelConfigs){
        //         config = _viewModelConfigs[key];
        //         // 画面ID对应的VM Class名
        //         viewModelClassName = config.viewModelClass;
        //         if (!_util.isEmpty(viewModelClassName)){
        //             // 取得VM Class定义
        //             ViewModelClass = null;
        //             if (!window[viewModelClassName]){

        //             }
        //             this.initialViewModelClass(config, viewModelClassName);
        //         }
        //     }
        // }
    }
    _initialViewModelConfig();

    /**
     * 执行指定ViewModel的加载动作
     *
     * @param  {string}    viewModelName viewModel名称
     * @param  {ViewModel} viewModel     viewModel实例
     */
    function _execViewModelInitial(viewModelName, viewModel){
        // 输出日志
        _log.debug("ViewModel [ " + viewModelName + " ] init.");
        // 执行ViewModel的加载函数(加载函数必须存在)
        _action.doAction(viewModel.init.bind(viewModel));
    }

    /**
     * 执行指定ViewModel的卸载动作
     *
     * @param  {string}    viewModelName viewModel名称
     * @param  {ViewModel} viewModel viewModel实例
     */
    function _execViewModelUnInitial(viewModelName, viewModel){
        // 输出日志
        _log.debug("ViewModel [ " + viewModelName + " ] unInit.");
        // 执行ViewModel的卸载函数
        if (_util.isFunction(viewModel.unInit)){
            _action.doAction(viewModel.unInit.bind(viewModel));
        }
    }

    /**
     * 取得并加载指定的ViewModelClass
     *
     * @public
     * @param  {Object}   config  View配置信息对象
     * @param  {string}   srcPath ViewModel脚本文件路径
     * @param  {Function} handler 加载成功后的回调函数
     */
    this.loadScript = function(config, srcPath, handler){
        // JS脚本路径
        var filePath = _config.SRC_ROOT_DIR + srcPath + ".js";
        // 脚本文件名必须与ViewModelClass类名一致
        // TODO 需要考虑更好的方案
        var viewModelClass = srcPath.substring(srcPath.lastIndexOf("/") + 1);
        // ViewModelClass没有被加载过的场合
        if (!_util.isFunction(window[viewModelClass])){
            // 构建Script标签加载脚本
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.src = filePath + "?_=" + _config.createCacheToken();
            // 绑定脚本加载完成事件
            node.addEventListener("load", function(){
                handler.call(null, window[viewModelClass]);
            }.bind(this), false);
            // 使用异步加载防止阻塞浏览器进程
            node.async = true;
            // 把脚本添加到document中
            document.querySelector("head").appendChild(node);
        // ViewModelClass加载过的场合
        }else{
            handler.call(null, window[viewModelClass]);
        }
    };

    /**
     * 根据View的Url路径映射取得对应的View配置信息
     *
     * @public
     * @param  {string} path     Url路径映射
     * @return {Object} 画面配置
     */
    this.getViewConfigByPath = function(path){
        var ret = _viewModelConfigs[path];
        // 指定画面只有HTML的场合，可以不在配置文件中对指定画面进行配置
        if (_util.isEmpty(ret)){
            ret = {
                "template": path + ".html"
            };
        }else if (_util.isEmpty(ret.template)){
            ret.template = path + ".html";
        }
        return ret;
    };

    /**
     * 根据Hash值取得View配置文件中最接近的Url映射路径
     *
     * 例：
     * 传入的hash为#a/b/c，配置文件中存在 a 和 a/b两个Url映射路径的场合
     * 函数返回 a/b
     *
     * @public
     * @param  {string} hash url hash值
     * @return {string} 映射路径
     */
    this.getViewPathFromHash = function(hash){
        var ret = "";

        if (!_util.isEmpty(hash)){
            // 删除hash头部的#
            if (hash.indexOf("#") === 0){
                hash = hash.substring(1);
            }

            for (var path in _viewModelConfigs){
                // 找到匹配的路径的并且此路径比之前找到的路径更为接近的场合
                if (hash.indexOf(path) === 0 &&
                        path.length > ret.length){
                    ret = path;
                }
            }
        }

        return ret;
    };

    /**
     * 跳转至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    this.forwardTo = function(path){
        // 当前ViewModelController的配置
        var config = this.getViewConfigByPath(path);
        // 传递的参数
        var param = arguments;
        // 当前ViewModelController实例对象
        var that = this;

        // 对正在使用的ViewModel进行卸载操作
        _execViewModelUnInitial(_util.get(this._currentViewModelInfo, "config.viewModelClass", ""),
            _util.get(this._currentViewModelInfo, "instance", ""));

        // 取得业务画面的HTML，并在指定区域更新
        _ui.updateHTML(this.getTemplatePath(config.template), function(){
            // 更新画面标题
            _ui.updateDocumentTitle(config.title);
            // 存在ViewModel的场合
            if (!_util.isEmpty(config.viewModelClass)){
                // load class file
                this.loadScript(config, config.viewModelClass, function(VMClass){
                    // 如果对应的VM Class名存在
                    if (_util.isFunction(VMClass)){
                        // 把传递参数帮定制
                        var Class = VMClass.bind.apply(VMClass, param);
                        // 实例化VM Class
                        var viewModel = new Class();
                        // 初期化VM的内部缓存
                        viewModel.cache = {};
                        // 加载指定ViewModel
                        _execViewModelInitial(config.viewModelClass, viewModel);
                        // 把VM Class实例存入缓存
                        _viewModelCacheObject[path] = viewModel;
                        // 存储当前使用的ViewModel实例
                        that._currentViewModelInfo = {
                            "instance": viewModel,
                            "config": config
                        };
                    }
                });
            }
        }.bind(this));
    };

    /**
     * 回退至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    this.backTo = function(path){
        // ViewModel配置信息
        var config = this.getViewConfigByPath(path);
        // 当前ViewModelController实例对象
        var that = this;

        // 对正在使用的ViewModel进行卸载操作
        _execViewModelUnInitial(_util.get(this._currentViewModelInfo, "config.viewModelClass", ""),
            _util.get(this._currentViewModelInfo, "instance", ""));

        if (!_util.isEmpty(config)){
            // 渲染制定画面对应的模版
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                // 指定画面对应的ViewModel实例
                var viewModel = _viewModelCacheObject[path];
                // 更新画面标题
                _ui.updateDocumentTitle(config.title);
                // 取得缓存的VM
                if (viewModel){
                    // 加载指定ViewModel
                    _execViewModelInitial(config.viewModelClass, viewModel);
                    // 存储当前使用的ViewModel实例
                    that._currentViewModelInfo = {
                        "instance": viewModel,
                        "config": config
                    };
                }
            });
        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [path]), "error");
        }
    };

    /**
     * 取得View模版的完整路径
     *
     * @public
     * @param  {string} template vm配置文件中定义的模版名
     * @return {string} 模版的路径
     */
    this.getTemplatePath = function(template){
        var ret = "";
        if (!_util.isEmpty(template)){
            ret = _config.HTML_ROOT_DIR + template;
        }
        return ret;
    };

    /**
     * 取得View配置信息
     *
     * @public
     * @return {Object} View配置信息
     */
    this.getViewModelConfig = function(){
        return _viewModelConfigs;
    };
};
