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
