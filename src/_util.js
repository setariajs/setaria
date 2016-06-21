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
        context.url = filePath + "?_=" + _config.createCacheToken();
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
