/**
 * 系统设定信息模块。
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _config = new function(){

    this.SYSMESSAGE_FILE = "src/custom/sysmessage.json";

    /**
     * 取得本地配置文件时所使用的缓存值
     *
     * @const
     * @return {Function} 缓存值
     */
    this.createCacheToken = function(){
        return this.APP_REVISION ? this.APP_REVISION : Math.floor(Math.random() * 100000000000000);
    };
};