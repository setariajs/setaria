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
