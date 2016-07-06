/**
 * Cookie管理模块。
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _cookie = new function() {

    /**
     * 读取一个cookie。如果cookie不存在返回null。
     *
     * @public
     * @param  {string} 读取的cookie名
     * @return {string} cookie的值
     */
    var getItem = function(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    };
    this.getItem = getItem;

    /**
     * 设置Cookie
     *
     * @public
     * @param  {string}  sKey     要创建或覆盖的cookie的名字
     * @param  {string}  sValue   cookie的值
     * @param  {string}  vEnd     最大年龄的秒数 (一年为31536e3， 永不过期的cookie为Infinity) ，
     *                            或者过期时间的GMTString格式或Date对象;
     *                            如果没有定义则会在会话结束时过期
     *                            (number – 有限的或 Infinity – string, Date object or null)。
     * @param  {string}  sPath    例如 '/', '/mydir'。 如果没有定义，默认为当前文档位置的路径。(string or null)。
     *                            路径必须为绝对路径
     * @param  {string}  sDomain  例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com'。
     *                            如果没有定义，默认为当前文档位置的路径的域名部分。
     * @param  {boolean} bSecure  cookie只会被https传输。
     * @return {boolean} 添加成功时返回true
     */
    var setItem = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    };
    this.setItem = setItem;

    /**
     * 删除一个cookie。
     *
     * @public
     * @param  {string}  sKey    要移除的cookie名
     * @param  {string}  sPath   例如 '/', '/mydir'。 如果没有定义，默认为当前文档位置的路径。(string or null)。
     *                           路径必须为绝对路径（参见 RFC 2965）。
     * @param  {string}  sDomain 例如 'example.com'， '.example.com' (包括所有子域名), 'subdomain.example.com'。
     *                           如果没有定义，默认为当前文档位置的路径的域名部分。
     * @return {boolean} true为删除成功，当对应的cookie不存在时返回false
     */
    var removeItem = function(sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    };
    this.removeItem = removeItem;

    /**
     * 检查一个cookie是否存在
     *
     * @public
     * @param  {string}  sKey 要检查的cookie名
     * @return {boolean} true为存在，反之不存在
     */
    var hasItem = function(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };
    this.hasItem = hasItem;
};
