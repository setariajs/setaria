// Setaria框架_ui模块扩展
// 此js文件的引入必须在setaria.min.js文件之后
/**
 * 显示模式化确认窗口
 *
 * @override
 * @param  {Object} param 模式化窗口设置参数
 */
_ui.showDialog = function(param){
    var dialogWidget = $("#" + _config.MODAL_AREA_ID);
    var dialogTitle = $("#_area_message_title");
    var dialogText = $("#_area_message_text");
    var errorStyle = "alert-error";
    var okButtonId = "_area_message_dialog_ok_button";
    var cancelButtonId = "_area_message_dialog_cancel_button";
    if (!(dialogWidget.data('bs.modal') || {}).isShown){
        var modalParam = {
            "show": true
        };
        // 设定标题
        dialogTitle.html(param.title);
        // 设定内容
        dialogText.html(param.message);
        // 设定类型
        param.type = param.type ? param.type : "info";
        dialogTitle.removeClass(errorStyle);
        dialogText.removeClass(errorStyle);
        if (param.type === "error"){
            dialogTitle.addClass(errorStyle);
            dialogText.addClass(errorStyle);
            _html.hide(okButtonId);
        }else{
            _html.show(okButtonId);
        }
        if (param.cancelOnly === false){
            // 绑定确认按钮事件
            $("#" + okButtonId).one("click", function(){
                dialogWidget.modal("hide");
                if (param.doneCallback){
                    dialogWidget.one("hidden.bs.modal", {
                        "closeMode": true
                    },function(event){
                        if (event.data.closeMode){
                            param.doneCallback.call(param);
                        }
                    });
                }
            });
        }else{
            // 隐藏确认按钮
            _html.hide(okButtonId);
        }

        if (param.cancelCallback){
            modalParam.keyboard = false;
            modalParam.backdrop = "static";
        }
        // 设定取消按钮的Label
        _html.byId(cancelButtonId).innerText = param.cancelText;
        // 绑定关闭按钮事件
        $("#" + cancelButtonId).one("click", function(){
            dialogWidget.modal("hide");
            if (param.cancelCallback){
                dialogWidget.one("hidden.bs.modal", {
                    "closeMode": false
                },function(event){
                    if (!event.data.closeMode){
                        param.cancelCallback.call(param);
                    }
                });
            }
        });
        dialogWidget.modal(modalParam);
    }
};
/**
 * 使指定控件不可用
 *
 * @public
 * @param  {string} domId 控件ID
 */
_ui.disable = function(domId){
    $(_byId(domId)).addClass("disabled");
};

/**
 * 使指定控件可用
 *
 * @public
 * @param  {string} domId 控件ID
 */
_ui.enable = function(domId){
    $(_byId(domId)).removeClass("disabled");
};
