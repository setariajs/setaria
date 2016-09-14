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
     * @public
     * @param  {Date}   dateObj
     * @param  {string} fmt      输出日期格式
     * @return {string} 指定格式字符串
     */
    this.dateFormat = function(dateObj, fmt){ //author: meizz
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
