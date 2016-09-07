/**
 * 系统设定信息模块。
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _config = new function(){

    /**
     * 取得本地配置文件时所使用的缓存值
     *
     * @const
     * @return {Function} 缓存值
     */
    this.createCacheToken = function(){
        return this.APP_REVISION ? this.APP_REVISION : Math.floor(Math.random() * 100000000000000);
    };

    /**
     * 取得当前的移动操作系统名称
     * Windows Phone, Android, iOS
     *
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
