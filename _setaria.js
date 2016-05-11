/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
$(function(w){
    "use strict";
    return function(){
        // 默认ViewModel的配置文件
        var defaultViewModelConfigFile = "./jslib/setaria/js/custom/viewModel_config.json";
        // 初期化ViewModelController
        w._viewModelController = new ViewModelController(defaultViewModelConfigFile);

        // 从URL取得参数
        // var params = new URLSearchParams(window.location.search.substring(1));

        // 跳转至定义首页
        // _ui.forwardTo(_config.INDEX_PAGE_ID, params.get("pageId"));

        _ui.forwardTo(_config.WELCOME_PAGE);
    };
}(window));
