/**
 * 复杂UI功能模块
 *
 * @namespace _ui
 * @version 1.0
 * @author HanL
 */
var _ui = new function(){
    "use strict";

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
    function _byId(id){
        id = id.indexOf("#") === 0 ? id : "#" + id;
        return $(id);
    }

    /**
     * 显示模式化确认窗口
     *
     * @public
     * @param  {Object} param 模式化窗口设置参数
     */
    this.showDialog = function(param){
        alert("Dialog -> title :: " + param.title + ", message :: " + param.message);
    };

    /**
     * 切换mask的显示／隐藏
     *
     * @public
     * @param {Boolean} isDisp 是否显示标志位
     */
    this.toggleProcessing = function(isDisp){
        var loadingNode = $("#" + _config.LOADING_ID);
        if (isDisp){
            loadingNode.show();
        }else{
            loadingNode.hide();
        }
    };

    /**
     * 在画面中显示指定的消息
     *
     * @public
     * @param  {(Array | Message | string)} messageObject 指定的消息
     * @param  {string}                     type          消息类型, info[正常] || error[错误]
     * @param  {Function}                   handler       关闭按钮点击时的回调函数
     */
    this.showMessage = function(messageObject, type, handler){
        var messageArr = [];
        var messageId = "";
        var messageContent = "";
        var doneCallback = null;
        if (!_util.isEmpty(messageObject)){
            // 指定的消息是数组的场合
            if (_util.isArray(messageObject)){
                $.each(messageObject, function(index, item){
                    // messageId = item.messageId || item.id || "";
                    messageArr.push(!!item.message ? item.message : item);
                    messageArr.push(HTML_TAG_BREAK);
                });
            // 指定的消息是对象的场合
            }else if (_util.isObject(messageObject)){
                messageId = messageObject.messageId || "";
                messageArr.push(_util.isObject(messageObject) ? messageObject.message : messageObject);
            // 其他类型的场合，转换为字符串
            }else{
                messageArr.push(messageObject + "");
            }
            if (_util.isFunction(handler)){
                doneCallback = function(){
                    handler();
                };
            }
            // 在画面显示消息
            this.showDialog({
                "title": type !== "error" ? "消息" : "错误",
                "type": type,
                "message": messageArr.join("<br/>"),
                "doneText": "关闭",
                "doneCallback": doneCallback,
                "doneOnly": true
            });
        }
    };

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
    this.showModalDialog = function(title, message, handler, cancelText, doneText){
        title = _util.isEmpty(title) ? "确认窗口" : title;
        doneOnly = _util.isEmpty(doneText) && !_util.isEmpty(cancelText);
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
        this.showDialog({
            "title": title,
            "message": message,
            "doneText": doneText,
            "cancelText": cancelText,
            "doneCallback": doneCallback,
            "cancelCallback": cancelCallback,
            "doneOnly": doneOnly
        });
    };

    /**
     * 跳转到指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    this.forwardTo = function(pageId){
        _viewModelController.forwardTo.apply(_viewModelController, arguments);
    };

    /**
     * 返回至指定画面
     *
     * @public
     * @param  {string} pageId 跳转画面ID
     */
    this.backTo = function(pageId){
        _viewModelController.backTo.apply(_viewModelController, arguments);
    };

    /**
     * 取得业务画面的HTML，并在指定区域更新
     *
     * @public
     * @param  {string} viewModelTemplateUrl 模版的路径
     * @param  {Object} handler              页面加载完成的回调函数
     */
    this.updateHTML = function(viewModelTemplateUrl, handler){
        // 对应画面的HTML文件
        var viewModelTemplateHTML = null;

        // 取得HTML文件中的内容
        if (!_util.isEmpty(viewModelTemplateUrl)){
            viewModelTemplateHTML = _util.getFileContent(viewModelTemplateUrl, "html");
            // 无法加载指定Html文件的场合
            if (_util.isObject(viewModelTemplateHTML)){
                if (viewModelTemplateHTML.textStatus === "error"){
                    _ui.showMessage(new SystemMessage("SESYSM001E"), "error");
                }
            }else{
                // 在指定区域刷新取得的HTML文本
                $("#" + _config.MAIN_AREA_ID).html(viewModelTemplateHTML);
            }
        }
        // 调用回调函数
        handler();
    };

    /**
     * 更新画面标题
     *
     * @public
     * @param  {string} title 标题内容
     */
    this.updateDocumentTitle = function(title){
        title = _util.isEmpty(title) ? "" : title;
        if (!_util.isEmpty(title)){
            document.title = title;
        }
    };
};
