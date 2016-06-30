/**
 * 复杂UI功能模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _ui = new function(){
    /**
     * HTML换行Tag
     *
     * @private
     * @const
     * @type {string}
     */
    var HTML_TAG_BREAK = "<br\>";

    /**
     * 当前mask的状态
     *
     * @private
     * @type {boolean}
     */
    var _processingStatus = false;

    /**
     * 根据DOM节点ID取得对应的JQuery的DOM对象
     *
     * @private
     * @param  {string} id DOM ID
     * @return {Object} JQuery的DOM对象
     */
    var _byId = function(id){
        id = id.indexOf("#") === 0 ? id : "#" + id;
        return $(id);
    };

    /**
     * 显示模式化确认窗口
     *
     * @private
     *
     * @param  {Object} param 模式化窗口设置参数
     */
    function _showModalDialog(param){
        alert("Dialog -> title :: " + param.title + ", message :: " + param.message);
    }

    /**
     * 切换mask的显示／隐藏
     *
     * @param {Boolean} isDisp 是否显示标志位
     * @public
     */
    function toggleProcessing(isDisp){
        var loadingNode = $("#" + _config.LOADING_ID);
        if (isDisp){
            loadingNode.show();
        }else{
            loadingNode.hide();
        }
    }
    this.toggleProcessing = toggleProcessing;

    /**
     * 在画面中显示指定的消息
     *
     * @public
     * @param  {(Array | Message | string)} messageObject 指定的消息
     * @param  {string}                     type          消息类型, info 正常 error 错误
     * @param  {Function}                   handler       关闭按钮点击时的回调函数
     */
    function showMessage(messageObject, type, handler){
        var messageArr = [];
        var messageId = "";
        var messageContent = "";
        var cancelCallback = null;
        if (!_util.isEmpty(messageObject)){
            // 指定的消息是数组的场合
            if (_util.isArray(messageObject)){
                $.each(messageObject, function(index, item){
                    // messageId = item.messageId || item.id || "";
                    messageArr.push(!!item.message ? item.message : item);
                    messageArr.push(HTML_TAG_BREAK);
                });
            // 指定的消息是对象的场合
            }else {
                messageId = messageObject.messageId || "";
                messageArr.push(_util.isObject(messageObject) ? messageObject.message : messageObject);
            }
            if (_util.isFunction(handler)){
                cancelCallback = function(){
                    handler();
                };
            }
            // 在画面显示消息
            _showModalDialog({
                "title": type !== "error" ? "消息" : "错误",
                "type": type,
                "message": messageArr.join(""),
                "cancelText": "关闭",
                "cancelCallback": cancelCallback,
                "cancelOnly": true
            });
        }
    }
    this.showMessage = showMessage;

    /**
     * 显示模态窗口
     *
     * @public
     * @param  {string}   title      窗口的标题
     * @param  {string}   message    窗口的内容
     * @param  {Function} handler    确认和取消按钮点击后的回调函数
     * @param  {string}   cancelText 取消按钮的显示文字，默认为［取消］
     * @param  {string}   doneText   确认按钮的显示文字，默认为［确认］
     */
    function showModalDialog(title, message, handler, cancelText, doneText){
        title = _util.isEmpty(title) ? "确认窗口" : title;
        cancelOnly = _util.isEmpty(doneText) && !_util.isEmpty(cancelText);
        doneText = doneText || "确认";
        cancelText = cancelText || "取消";
        // 确认按钮点击后的回调函数
        var doneCallback = function(){
            handler(true);
        };
        // 取消按钮点击后的回调函数
        var cancelCallback = function(){
            handler(false);
        };
        // 显示模态窗口
        _showModalDialog({
            "title": title,
            "message": message,
            "doneText": doneText,
            "cancelText": cancelText,
            "doneCallback": doneCallback,
            "cancelCallback": cancelCallback,
            "cancelOnly": cancelOnly
        });
    }
    this.showModalDialog = showModalDialog;

    /**
     * 跳转到指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    function forwardTo(pageId){
        _viewModelController.forwardTo.apply(_viewModelController, arguments);
    }
    this.forwardTo = forwardTo;

    /**
     * 返回至指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    function backTo(pageId){
        _viewModelController.backTo.apply(_viewModelController, arguments);
    }
    this.backTo = backTo;

    /**
     * 取得业务画面的HTML，并在指定区域更新
     *
     * @private
     * @param  {string} viewModelTemplateUrl 模版的路径
     * @param  {Object} handler              页面加载完成的回调函数
     */
    var updateHTML = function(viewModelTemplateUrl, handler){
        // 对应画面的HTML文件
        var viewModelTemplateHTML = null;

        // 取得HTML文件中的内容
        if (!_util.isEmpty(viewModelTemplateUrl)){
            viewModelTemplateHTML = _util.getFileContent(viewModelTemplateUrl, "html");
            // 在指定区域刷新取得的HTML文本
            $("#" + _config.MAIN_AREA_ID).html(viewModelTemplateHTML);
        }
        // 调用回调函数
        handler();
    };
    this.updateHTML = updateHTML;

    /**
     * 使指定控件不可用
     *
     * @public
     * @param  {string} domId 控件ID
     */
    function disable(domId){
        $(_byId(domId)).addClass("disabled");
    }
    this.disable = disable;

    /**
     * 使指定控件可用
     *
     * @public
     * @param  {string} domId 控件ID
     */
    function enable(domId){
        $(_byId(domId)).removeClass("disabled");
    }
    this.enable = enable;
};
