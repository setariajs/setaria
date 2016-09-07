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
        // JS脚本路径
        var filePath = _config.SRC_ROOT_DIR + srcPath + ".js";
        // 脚本文件名必须与ViewModelClass类名一致
        // TODO 需要考虑更好的方案
        var viewModelClass = srcPath.substring(srcPath.lastIndexOf("/") + 1);
        // ViewModelClass没有被加载过的场合
        if (!_util.isFunction(window[viewModelClass])){
            // 构建Script标签加载脚本
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.charset = "utf-8";
            node.src = filePath + "?_=" + _config.createCacheToken();
            // 绑定脚本加载完成事件
            node.addEventListener("load", function(){
                handler.call(null, window[viewModelClass]);
            }.bind(this), false);
            // 使用异步加载防止阻塞浏览器进程
            node.async = true;
            // 把脚本添加到document中
            document.querySelector("head").appendChild(node);
        // ViewModelClass加载过的场合
        }else{
            handler.call(null, window[viewModelClass]);
        }
    };
    this.loadScript = loadScript;

    /**
     * 取得ViewModelConfig
     *
     * @private
     */
    var initialViewModelConfig = function(){
        var config = null;
        // 画面ID对应的VM Class名
        var viewModelClassName = "";
        // 取得VM Class定义
        var ViewModelClass = null;
        // 取得指定的ViewModelConfig
        viewModelConfigs = _util.getFileContent(configFilePath, "json");
        // 在系统启动时预加载所有配置的ViewModel
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
     * 根据ViewModel路径映射取得对应的ViewModel和模版视图
     *
     * @private
     * @param  {string} path     Url路径映射
     * @return {Object} 画面配置
     */
    var getViewConfigByPath = function(path){
        var ret = viewModelConfigs[path];
        // 指定画面只有HTML的场合，可以不在配置文件中对指定画面进行配置
        if (_util.isEmpty(ret)){
            ret = {
                "template": path + ".html"
            };
        }else if (_util.isEmpty(ret.template)){
            ret.template = path + ".html";
        }
        return ret;
    };
    this.getViewConfigByPath = getViewConfigByPath;

    /**
     * 根据Hash值查询配置文件取得最接近的映射路径
     *
     * 例：
     * 传入的hash为#a/b/c，配置文件中存在 a 和 a/b两个映射路径的场合
     * 返回 a/b
     *
     * @public
     * @param  {string} hash url hash值
     * @return {string} 映射路径
     */
    var getViewModelPathFromHash = function(hash){
        var ret = "";

        if (!_util.isEmpty(hash)){
            // 删除hash头部的#
            if (hash.indexOf("#") === 0){
                hash = hash.substring(1);
            }

            for (var path in viewModelConfigs){
                // 找到匹配的路径的并且此路径比之前找到的路径更为接近的场合
                if (hash.indexOf(path) === 0 &&
                        path.length > ret.length){
                    ret = path;
                }
            }
        }

        return ret;
    };
    this.getViewModelPathFromHash = getViewModelPathFromHash;

    /**
     * 跳转至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    var forwardTo = function(path){
        var config = this.getViewConfigByPath(path);
        var param = arguments;

        // 取得业务画面的HTML，并在指定区域更新
        _ui.updateHTML(this.getTemplatePath(config.template), function(){
            // 更新画面标题
            _ui.updateDocumentTitle(config.title);
            // 存在ViewModel的场合
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
                        // 输出日志
                        _log.debug("ViewModel [ " + config.viewModelClass + " ] init.");
                        // 执行vm初期化函数
                        _action.doAction(viewModel.init.bind(viewModel));
                        // 把VM Class实例存入缓存
                        viewModelCacheObject[path] = viewModel;
                    }
                });
            }
        }.bind(this));
    };
    this.forwardTo = forwardTo;

    /**
     * 回退至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    var backTo = function(path){
        var config = this.getViewConfigByPath(path);

        if (!_util.isEmpty(config)){
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                // 更新画面标题
                _ui.updateDocumentTitle(config.title);
                // 取得缓存的VM
                if (viewModelCacheObject[path]){
                    viewModelCacheObject[path].init();
                }
            });
        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [path]), "error");
        }
    };
    this.backTo = backTo;

    /**
     * 取得模版的完整路径
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
