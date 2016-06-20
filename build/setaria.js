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
/**
 * 公共数据保存模块
 *
 * @namespace
 * @version 1.0
 */
var _globalParam = new function(){

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
    var _GP_KEY = "___global_param__";

    /**
     * 取得数据存储对象
     *
     * @private
     * @return {Object} 数据存储对象
     */
    function _getCacheObject(){
        var sessValueString = _store.getItem(_GP_KEY) || "{}";
        return JSON.parse(sessValueString);
    }

    /**
     * 往数据存储对象中设值
     *
     * @private
     * @param {Anything} value 值
     */
    function _setCacheObject(value){
        _store.setItem(_GP_KEY, JSON.stringify(value));
    }

    /**
     * 从数据存储对象中删除指定的值，当key没有指定时，清空数据存储对象
     *
     * @private
     * @param  {string} key 删除的值
     */
    function _removeCacheObject(key){
        if (_util.isEmpty(key)){
            _store.removeItem(_GP_KEY);
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
     * @param {string}    key   键
     * @param {Anything}  值
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
     * @param  {string}    key 键
     * @return {Anything}  值
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
     * @param {string}   key   键
     * @param {Anything} value 保存的值
     */
    function set(key, value){
        _set(key, value);
    }
    this.set = set;

    /**
     * 根据键取得公共数据
     *
     * @public
     * @param  {string}   key   键
     * @return {Anything} value 保存的值
     */
    function get(key){
        return _get(key);
    }
    this.get = get;

    /**
     * 删除指定的值
     *
     * @public
     * @param  {string} key 键
     */
    function clear(key){
        _clear(key);
    }
    this.clear = clear;
};
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
     * @param  {string}   selector  JQuery的选择器
     * @param  {Function} handler   事件触发后的回调函数
     * @param  {*}        data      传递回调函数的值
     */
    var _bindEvent = function(eventName, selector, handler, data){
        // 如果事件已经绑定，先解绑
        $(document).off(eventName, selector);
        // 绑定事件
        $(document).on(eventName, selector, data, function(evt){
            _action.doAction(handler, evt);
        });
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
        if (!_util.isEmpty(id)){
            id = (id.indexOf("#") === 0) ? id : "#" + id;
            _bindEvent(eventName, id, handler);
        }
    }
    this.bindEventById = bindEventById;

    /**
     * 使用DOM Name进行DOM事件绑定
     *
     * @public
     * @param  {string}   name       DOM Name
     * @param  {string}   eventName  事件名称
     * @param  {Action}   handler    处理Action实体
     */
    function bindEventByName(name, eventName, handler){
        if (!_util.isEmpty(name)){
            _bindEvent(eventName, "[name='" + name + "']", handler);
        }
    }
    this.bindEventByName = bindEventByName;
};
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
/**
 * 消息管理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _message = new function(){

    /**
     * 使用参数填充自定义的消息模版
     *
     * @inner
     * @param  {string} template 定义在消息定义模块的消息模版
     * @param  {Array}  parameters 参数数组
     * @return {string} 消息字符串
     */
    var _format = function(template, parameters){
        if (!_util.isEmpty(parameters)){
            for (var i = 0; i < parameters.length; i++){
                template = template.split("\{" + i + "\}").join(parameters[i]);
            }
        }
        return template;
    };

    /**
     * 取得一般消息
     *
     * @public
     * @param  {string}  id 消息ID
     * @param  {Array}   parameters 参数数组
     * @return {String}  消息字符串
     */
    function getMessage(id, parameters){
        var template = _messages[id];
        if (!template){
            return "没有找到指定的消息. (id=" + id + ", parameters=" + parameters + ")";
        }
        return _format(template, parameters);
    }
    this.getMessage = getMessage;


    /**
     * 取得系统消息
     *
     * @public
     * @param  {string}  id 系统消息ID
     * @param  {Array}   parameters 参数数组
     * @return {string}  系统消息字符串
     */
    function getSystemMessage(id, parameters){
        var template = _sysmessages[id];
        if (!template){
            return "message not found. (id=" + id + ", parameters=" + parameters + ")";
        }
        return _format(template, parameters);
    }
    this.getSystemMessage = getSystemMessage;
};
/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
 var _setaria = new function(){

    /**
     * 启动函数
     *
     * @public
     */
    var start = function(){
        // 更新引用文件的缓存
        // this.appendTokenOnImportFile();
        // 加载viewModel
        // 默认ViewModel的配置文件
        var defaultViewModelConfigFile = _config.VIEWMODEL_CONFIG_FILE;
        // 初期化ViewModelController
        window._viewModelController = new ViewModelController(defaultViewModelConfigFile);
        // 跳转页面
        this.dispatcher();
    };
    this.start = start;

    /**
     * 添加token至引用的script文件
     *
     * @protected
     */
    // var appendTokenOnImportFile = function(){
    //     var token = _config.createCacheTokenForHTML();
    //     // css
    //     $("link").each(function(){
    //         var cssHref = this.getAttribute("href");
    //         if (this.getAttribute("type") === "text/css"){
    //             this.setAttribute("href", cssHref + "?" + token);
    //         }
    //     });
    //     // script
    //     $.each(document.scripts, function(){
    //         var srcAttr = this.getAttribute("src");
    //         if (!_util.isEmpty(srcAttr)){
    //             this.setAttribute("src", srcAttr + "?" + token);
    //         }
    //     });
    // };
    // this.appendTokenOnImportFile = appendTokenOnImportFile;

    /**
     * Customize Dispatcher
     *
     * @public
     * @override
     * @return {[type]} [description]
     */
    var dispatcher = function(){
        this.defaultDispatcher();
    };
    this.dispatcher = dispatcher;

    /**
     * Dispatcher
     *
     * @protected
     */
    var defaultDispatcher = function(){
        // 取得url中的Hash参数
        var targetPageParams = _url.getHashParams();
        // 如果存在页面跳转定义
        if (!_util.isEmpty(targetPageParams)){
            _ui.forwardTo.apply(_ui, targetPageParams);
        }else{
            _ui.forwardTo(_config.WELCOME_PAGE);
        }
    };
    this.defaultDispatcher = defaultDispatcher;
 };
/**
 * URL模块
 * 用于处理Url相关逻辑
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _url = new function(){

    var _SPLIT_CHAR = "/";

    /**
     * 取得Url中的Hash参数
     *
     * @public
     * @return {Array} Hash参数数组
     */
    var getHashParams = function(){
        var ret = null;
        var hash = window.location.hash;

        // hash不为空并且第一个字符为#
        if (!_util.isEmpty(hash) && hash.indexOf("#") === 0){
            // 去掉#
            hash = hash.substring(1);
            ret = hash.split(_SPLIT_CHAR);
        }

        return ret;
    };
    this.getHashParams = getHashParams;

    /**
     * 取得当前页面ID
     *
     * @public
     * @return {String} 页面ID
     */
    var getPageId = function(){
        var ret = "";
        var params = this.getHashParams();

        if (params.length > 0){
            ret = params[0];
        }

        return ret;
    };
    this.getPageId = getPageId;

    /**
     * 设定Url中的参数
     *
     * @public
     * @param {string} uri      uri
     * @param {Object} paramObj 参数对象
     */
    var setUrlParameter = function(uri, paramObj){
        var ret = uri;
        var separator = "";

        if (!_util.isEmpty(uri)){
            separator = uri.indexOf("?") !== -1 ? "&" : "?";
            ret += separator + $.param(paramObj);
        }

        return ret;
    };
    this.setUrlParameter = setUrlParameter;

    /**
     * 取得Url中的参数
     * 如果不指定参数名称则取得所有参数
     *
     * @public
     * @param  {String} paramName 参数名称
     * @return {Object} 包含url参数的对象
     */
    var getUrlParameter = function(paramName){
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
    this.getUrlParameter = getUrlParameter;

    /**
     * Url跳转
     *
     * @public
     * @param  {String}  url       目标Url
     * @param  {boolean} isReplace true的时候，重定向，false的时候，画面跳转
     */
    var redirectTo = function(url, isReplace){
        if (isReplace){
            window.location.replace(url);
        }else{
            window.location.href = url;
        }
    };
    this.redirectTo = redirectTo;

    /**
     * 跳转至指定的错误页面
     *
     * @public
     * @param  {string} page 错误页面名称
     */
    var redirectToErrorPage = function(page){
        this.redirectTo(_config.HTML_ROOT_DIR +
            _config.HTML_ERROR_DIR +
            page +
            ".html", true);
    };
    this.redirectToErrorPage = redirectToErrorPage;

    /**
     * 清除Url中的参数
     *
     * @public
     */
    var clearUrlParameter = function(){
        var search = window.location.search;
        var href = window.location.href;
        href = href.replace(search, "");
        window.history.replaceState(null, null, href);
    };
    this.clearUrlParameter = clearUrlParameter;
};
/**
 * 共通函数模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _util = new function(){
    "use strict";

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var _MAX_SAFE_INTEGER = 9007199254740991;

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
    var _reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
        _reUnescapedHtml = /[&<>"'`]/g,
        _reHasEscapedHtml = RegExp(_reEscapedHtml.source),
        _reHasUnescapedHtml = RegExp(_reUnescapedHtml.source);


    var _hasOwnProperty = Object.prototype.hasOwnProperty;

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
     * 检查输入值是否是对象
     *
     * @private
     * @param   {Anything} 检查的值
     * @returns {boolean}  如果是对象返回true,否则返回false
     */
    function _isObjectLike(value) {
        return !!value && typeof value === "object";
    }

    /**
     * 检查输入值是否是合法的数组的length属性
     *
     * @private
     * @param  {Anything}  value 检查的值
     * @return {boolean}   如果是合法的数组的Length属性，返回true，否则返回false
     */
    function _isLength(value) {
        return typeof value == "number" &&
            value > -1 &&
            value % 1 === 0 &&
            value <= _MAX_SAFE_INTEGER;
    }

    /**
     * 把值转换为字符串，如果值为空，则返回空字符串
     *
     * @private
     * @param  {Anything} value 检查的值
     * @return {string}   字符串
     */
    function _toString(value) {
        return value === null ? "" : (value + "");
    }

    /**
     * 把输入值转换成对象
     *
     * @private
     * @param   {Anything} 输入值
     * @returns {Object}   转换出的对象
     */
    function _toObject(value) {
        return isObject(value) ? value : Object(value);
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function _baseGet(object, path, pathKey) {
          if (object === null || object === undefined) {
            return;
          }
          if (pathKey !== undefined && pathKey in _toObject(object)) {
            path = [pathKey];
          }
          var index = 0,
              length = path.length;

          while (object !== null && index < length) {
            object = object[path[index++]];
          }
          return (index && index == length) ? object : undefined;
    }

    /**
     * 属性字符串转换成数组.
     *
     * @private
     * @param   {Anything} 属性字符串
     * @returns {Array}    属性数组
     */
    function _toPath(value) {
          if (isArray(value)) {
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
     * @param   {Anything} value 输入值
     * @returns {string}   转换的字符串
     */
    function _baseToString(value) {
        return value === null ? '' : (value + '');
    }

    /**
     * 取得指定对象中指定函数
     *
     * @private
     * @param   {string}   key 函数名
     * @returns {Function} 函数
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
     * @param   {Anything} value 输入值
     * @returns {boolean}  如果输入值拥有length属性，返回true，否则返回false
     */
    function _isArrayLike(value) {
        return value !== null && _isLength(_getLength(value));
    }

    /**
     * 检查输入值是否为空，无法判断基本类型（整数，布尔）
     *
     * @public
     * @param  {Array|Object|string}  value 检查的值
     * @return {Boolean}  当值为空时返回true，否则返回false
     */
    function isEmpty(value){
        if (value === null || value === undefined) {
            return true;
        }
        if (_isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
              (_isObjectLike(value) && isFunction(value.splice)))) {
            return !value.length;
        }
        return !keys(value).length;
    }
    this.isEmpty = isEmpty;

    /**
     * 判断值的类型是否为字符串
     *
     * _util.isString('abc');
     * // => true
     *
     * _util.isString(1);
     * // => false
     *
     * @param  {Anything}  value 检查的值
     * @return {boolean}   当值的类型为字符串时返回true，否则返回false
     */
    function isString(value){
        return typeof value == 'string' ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object String]");
    }
    this.isString = isString;

    /**
     * 检查值的类型是否为数字
     *
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
     * @param  {Anything}  value 检查的值
     * @return {Boolean}   当值为数字时返回true，否则返回false
     */
    function isNumber(value){
        return typeof value == 'number' ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object Number]");
    }
    this.isNumber = isNumber;

    /**
     * 检查值的类型是否为布尔值
     *
     * _util.isBoolean(false);
     * // => true
     *
     * _util.isBoolean(null);
     * // => false
     *
     * @public
     * @param  {Anything}  value 检查的值
     * @return {Boolean}   当值的类型为布尔时返回true，否则返回false
     */
    function isBoolean(value){
        return value === true ||
            value === false ||
            (_isObjectLike(value) &&
                Object.prototype.toString.call(value) == "[object Boolean]");
    }
    this.isBoolean = isBoolean;

    /**
     * 检查值的类型是否为数组
     *
     * @public
     * @param  {Anything}  value 检查的值
     * @return {Boolean}   当值的类型为数组时返回true，否则返回false
     */
    function isArray(value){
        return _isObjectLike(value) &&
            _isLength(value.length) &&
            Object.prototype.toString.call(value) == "[object Array]";
    }
    this.isArray = isArray;

    /**
     * 检查值的类型是否为对象
     * 数组，函数，正则表达式，new Number和new String的情况会返回true
     *
     * @public
     * @param  {Anything}  value 检查的值
     * @return {Boolean}   当值的类型为对象时返回true，否则返回false
     */
    function isObject(value){
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
    }
    this.isObject = isObject;

    /**
     * 检查值的类型是否为函数
     *
     * @public
     * @param  {Anything}  value 检查的值
     * @return {Boolean}   当值的类型为函数时返回true，否则返回false
     */
    function isFunction(value){
        return isObject(value) &&
            Object.prototype.toString.call(value) == "[object Function]";
    }
    this.isFunction = isFunction;

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified， else `false`.
     * @example
     *
     * _util.isArguments(function() { return arguments; }());
     * // => true
     *
     * _util.isArguments([1， 2, 3]);
     * // => false
     */
    function isArguments(value) {
          return _isObjectLike(value) && _isArrayLike(value) &&
            _hasOwnProperty.call(value, 'callee') && !_propertyIsEnumerable.call(value, 'callee');
    }
    this.isArguments = isArguments;

    /**
     * 检查指定对象中是否存在指定的键值
     *
     * _util.has(object, 'a');
     *
     * @public
     * @param  {Object}  object 检查的对象
     * @param  {String}  key   查找的键值
     * @return {Boolean} 当对象中存在指定键值时返回true,否则返回false
     */
    function has(object, key){
        return _hasOwnProperty.call(object, key);
    }
    this.has = has;

    /**
     * 从对象中取出指定的键值，如果对应的键值不存在，则返回默认值
     *
     * @public
     * @param  {Object}         object       取值对象
     * @param  {Array | string} path         指定的键值
     * @param  {Anything}       defaultValue 默认值
     * @return {[type]}         在对象中所对应的值
     */
    function get(object, path, defaultValue){
        var result = object === null ? undefined : _baseGet(object, _toPath(path), (path + ''));
        return result === undefined ? defaultValue : result;
    }
    this.get = get;

    /**
     * 取得指定对象中存在的key
     *
     * @public
     * @param  {Object} object 处理的对象
     * @return {Array}  键值数组
     */
    function keys(object){
        return isObject(object) ? Object.keys(object) : [];
    }
    this.keys = keys;

    /**
     * 转换日期对象到指定格式字符串
     *
     * @public
     * @param  {Date}   dateObj
     * @param  {string} fmt     输出日期格式
     * @return {string} 指定格式字符串
     */
    function dateFormat(dateObj, fmt){ //author: meizz
        var o = {
            "M+": dateObj.getMonth() + 1,
            "d+": dateObj.getDate(),
            "h+": dateObj.getHours(),
            "m+": dateObj.getMinutes(),
            "s+": dateObj.getSeconds(),
            "q+": Math.floor((dateObj.getMonth() + 3) / 3),
            "S": dateObj.getMilliseconds()
        };
        if (/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]): (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return fmt;
    }
    this.dateFormat = dateFormat;

    /**
     * 对特殊字符进行转义
     * "&", "<", ">", '"', "'", 和 "`"
     *
     * @param  {string} value 欲转义的字符串
     * @return {string}       转义后的字符串
     */
    function escape(value){
        value = _baseToString(value);
        return (value && _reHasUnescapedHtml.test(value)) ?
            value.replace(_reUnescapedHtml, _escapeHtmlChar) :
            value;
    }
    this.escape = escape;

    /**
     * 读取本地配置文件
     *
     * @param  {string} filePath 配置文件路径
     */
    function getFileContent(filePath, dataType){
        var ret = null;
        var context = new HTTPContext();
        context.url = filePath + "?_=" + _config.createCacheTokenForHTML();
        context.method = "GET";
        context.dataType = dataType ? dataType : "text";
        context.success = function(res){
            ret = res;
        };
        _http.doSync(context);
        return ret;
    }
    this.getFileContent = getFileContent;
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
 * @class
 * @param {String} messageId 消息ID
 * @param {Array} parameters 参数数组
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
	 * @return {string} 消息内容
	 */
	function toString(){
		return this.message;
	}
	this.toString = toString;
};
/**
 * 系统级别消息处理类
 *
 * @class
 * @param {String} messageId  系统消息ID
 * @param {Array}  parameters 参数数组
 *
 * @version 1.0
 * @author HanL
 */
var SystemMessage = function(messageId, parameters){

	/**
	 * 系统消息ID
	 */
	this.messageId = messageId;

	/**
	 * 系统消息内容
	 */
	this.message = _message.getSystemMessage(messageId, parameters);

	/**
	 * 返回系统消息内容
	 *
	 * @return {String} 系统消息内容
	 */
	function toString(){
		return this.message;
	}
	this.toString = toString;
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
	 * @return {String} 校验消息内容
	 */
	function toString(){
		return this.message;
	}
	this.toString = toString;
};
/**
 * 业务画面管理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var ViewModelController = function(configFilePath, completeHandler){

    // 初期化ViewModel配置对象
    var viewModelConfigs = null;

    // 业务画面缓存对象
    var viewModelCacheObject = {};

    var loadScript = function(config, srcPath, handler){
        var filePath = _config.SRC_ROOT_DIR + srcPath + ".js";
        var viewModelClass = srcPath.substring(srcPath.lastIndexOf("/") + 1);
        if (!_util.isFunction(window[viewModelClass])){
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.src = filePath + "?" + _config.createCacheTokenForHTML();
            node.addEventListener("load", function(){
                handler.call(null, window[viewModelClass]);
            }.bind(this), false);
            node.async = true;
            document.querySelector("head").appendChild(node);
        }else{
            handler.call(null, window[viewModelClass]);
        }
    };
    this.loadScript = loadScript;

    /**
     * 取得指定业务画面的配置信息
     *
     * @private
     */
    var initialViewModelConfig = function(){
        var config = null;
        // 画面ID对应的VM Class名
        var viewModelClassName = "";
        // 取得VM Class定义
        var ViewModelClass = null;
        viewModelConfigs = _util.getFileContent(configFilePath, "json");
        // if (!_util.isEmpty(viewModelConfigs)){
        //     for (var key in viewModelConfigs){
        //         config = viewModelConfigs[key];
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
    };
    this.initialViewModelConfig = initialViewModelConfig;
    this.initialViewModelConfig();

    /**
     * 跳转至指定画面
     *
     * @public
     * @param  {string} pageId 业务画面ID
     */
    var forwardTo = function(pageId){
        var config = viewModelConfigs[pageId];
        var param = arguments;
        // 如果VM配置对象存在
        if (config){
            // 取得业务画面的HTML，并在指定区域更新
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
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
                            // 执行vm初期化函数
                            _action.doAction(viewModel.init.bind(viewModel));
                            // 把VM Class实例存入缓存
                            viewModelCacheObject[pageId] = viewModel;
                        }
                    });
                }
            }.bind(this));

        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [pageId]), "error");
        }
    };
    this.forwardTo = forwardTo;

    /**
     * 回退至指定画面
     *
     * @public
     * @param  {string} pageId 业务画面ID
     */
    var backTo = function(pageId){
        var config = viewModelConfigs[pageId];

        if (!_util.isEmpty(config)){
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                // 取得缓存的VM
                if (viewModelCacheObject[pageId]){
                    viewModelCacheObject[pageId].init();
                }
            });
        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [pageId]), "error");
        }
    };
    this.backTo = backTo;

    /**
     * 取得模版的路径
     *
     * @private
     * @param  {string} template vm配置文件中定义的模版名
     * @return {string} 模版的路径
     */
    var getTemplatePath = function(template){
        var ret = "";
        if (!_util.isEmpty(template)){
            ret = _config.HTML_ROOT_DIR + template;
        }
        return ret;
    };
    this.getTemplatePath = getTemplatePath;
};
