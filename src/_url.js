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

    this.getCurrentIndex = function(){
        return _index;
    };

    this.forward = function(url){
        _index++;
        while(_urlHistory.length > 0){
            // 退回到之前的url后再forward的场合，删除从退至的url到顶部之间的url
            if (_urlHistory[0].index >= _index){
                // 删除数组最前面的元素
                _log.debug(_urlHistory[0].url);
                _urlHistory.shift();
            }else{
                break;
            }
        }

        _log.debug("add " + url + " to history!");
        // 将url添加至数组前方
        _urlHistory.unshift({
            "index": _index,
            "url": url
        });

        _log.debug(_urlHistory.length);
    };

    this.back = function(url){
        var ret = 0;
        var i = 0;
        if (!_util.isEmpty(_urlHistory)){
            for (i = 0; i < _urlHistory.length; i++){
                // 因为在回退时不会删除_urlHistory中的值，所以当进行连续两次回退操作时，
                // 第二次的查找的开始位置是基于当前_index的值，也就是从第一次回退到的位置开始查找
                if (_urlHistory[i].index <= _index){
                    ret++;
                    if (_urlHistory[i].url === url){
                        // 回退index
                        _index = _urlHistory[i].index - 1;
                        break;
                    }
                }
            }
            // if (ret !== _urlHistory.length){
                ret = -ret;
            // }else{
                // ret = 0;
            // }
        }
        return ret;
    };

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
