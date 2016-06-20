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
