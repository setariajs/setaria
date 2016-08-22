/**
 * 业务画面管理模块
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var ViewModelController = function(configFilePath, completeHandler){

    // 初期化ViewModel配置对象
    var viewModelConfigs = null;

    // 业务画面缓存对象
    var viewModelCacheObject = {};

    var loadScript = function(config, srcPath, handler){
        var filePath = _config.SRC_ROOT_DIR + srcPath + ".js";
        var viewModelClass = srcPath.substring(srcPath.lastIndexOf("/") + 1);
        if (!_util.isFunction(window[viewModelClass])){
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.src = filePath + "?_=" + _config.createCacheToken();
            node.addEventListener("load", function(){
                handler.call(null, window[viewModelClass]);
            }.bind(this), false);
            node.async = true;
            document.querySelector("head").appendChild(node);
        }else{
            handler.call(null, window[viewModelClass]);
        }
    };
    this.loadScript = loadScript;

    /**
     * 取得指定业务画面的配置信息
     *
     * @private
     */
    var initialViewModelConfig = function(){
        var config = null;
        // 画面ID对应的VM Class名
        var viewModelClassName = "";
        // 取得VM Class定义
        var ViewModelClass = null;
        viewModelConfigs = _util.getFileContent(configFilePath, "json");
        // if (!_util.isEmpty(viewModelConfigs)){
        //     for (var key in viewModelConfigs){
        //         config = viewModelConfigs[key];
        //         // 画面ID对应的VM Class名
        //         viewModelClassName = config.viewModelClass;
        //         if (!_util.isEmpty(viewModelClassName)){
        //             // 取得VM Class定义
        //             ViewModelClass = null;
        //             if (!window[viewModelClassName]){

        //             }
        //             this.initialViewModelClass(config, viewModelClassName);
        //         }
        //     }
        // }
    };
    this.initialViewModelConfig = initialViewModelConfig;
    this.initialViewModelConfig();

    /**
     * 跳转至指定画面
     *
     * @public
     * @param  {string} pageId 业务画面ID
     */
    var forwardTo = function(pageId){
        var config = viewModelConfigs[pageId];
        var param = arguments;
        // 如果VM配置对象存在
        if (config){
            // 取得业务画面的HTML，并在指定区域更新
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                if (!_util.isEmpty(config.viewModelClass)){
                    // load class file
                    this.loadScript(config, config.viewModelClass, function(VMClass){
                        // 如果对应的VM Class名存在
                        if (_util.isFunction(VMClass)){
                            // 把传递参数帮定制
                            var Class = VMClass.bind.apply(VMClass, param);
                            // 实例化VM Class
                            var viewModel = new Class();
                            // 初期化VM的内部缓存
                            viewModel.cache = {};
                            // 执行vm初期化函数
                            _action.doAction(viewModel.init.bind(viewModel));
                            // 把VM Class实例存入缓存
                            viewModelCacheObject[pageId] = viewModel;
                        }
                    });
                }
            }.bind(this));

        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [pageId]), "error");
        }
    };
    this.forwardTo = forwardTo;

    /**
     * 回退至指定画面
     *
     * @public
     * @param  {string} pageId 业务画面ID
     */
    var backTo = function(pageId){
        var config = viewModelConfigs[pageId];

        if (!_util.isEmpty(config)){
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                // 取得缓存的VM
                if (viewModelCacheObject[pageId]){
                    viewModelCacheObject[pageId].init();
                }
            });
        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [pageId]), "error");
        }
    };
    this.backTo = backTo;

    /**
     * 取得模版的路径
     *
     * @public
     * @param  {string} template vm配置文件中定义的模版名
     * @return {string} 模版的路径
     */
    var getTemplatePath = function(template){
        var ret = "";
        if (!_util.isEmpty(template)){
            ret = _config.HTML_ROOT_DIR + template;
        }
        return ret;
    };
    this.getTemplatePath = getTemplatePath;

    /**
     * 取得ViewModel配置信息
     * @return {Object} ViewModel配置信息
     */
    var getViewModelConfig = function(){
        return viewModelConfigs;
    };
    this.getViewModelConfig = getViewModelConfig;
};
