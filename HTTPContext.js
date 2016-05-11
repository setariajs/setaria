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
