/**
 * View画面管理模块
 *
 * @class
 * @version 1.0
 * @author HanL
 */
var ViewModelController = function(configFilePath, completeHandler){

    // 初期化ViewModel配置对象
    var _viewModelConfigs = null;

    // 业务画面缓存对象
    var _viewModelCacheObject = {};

    // 最近一次使用的ViewModel对象
    this._currentViewModelInfo = null;

    /**
     * 取得ViewModelConfig
     *
     * @private
     */
    function _initialViewModelConfig(){
        var config = null;
        // 画面ID对应的VM Class名
        var viewModelClassName = "";
        // 取得VM Class定义
        var ViewModelClass = null;
        // 取得指定的ViewModelConfig
        _viewModelConfigs = _util.getFileContent(configFilePath, "json");
        // 在系统启动时预加载所有配置的ViewModel
        // if (!_util.isEmpty(_viewModelConfigs)){
        //     for (var key in _viewModelConfigs){
        //         config = _viewModelConfigs[key];
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
    }
    _initialViewModelConfig();

    this.initialHandler = function(func){
        func.call(null);
    };
    this.unInitialHandler = function(func){
        func.call(null);
    };

    /**
     * 执行指定ViewModel的加载动作
     *
     * @param  {string}    viewModelConfig viewModel配置
     * @param  {ViewModel} viewModel       viewModel实例
     */
    this._execViewModelInitial = function(viewModelConfig, viewModel, path, param){
        // 输出日志
        _log.debug("ViewModel [ " + viewModelConfig.viewModelClass + " ] init.");
        if (_util.isFunction(this.initialHandler)){
            this.initialHandler(function(){
                // 执行ViewModel的加载函数(加载函数必须存在)
                _action.doAction(viewModel.init.bind(viewModel));
            }, viewModelConfig, path, param);
        }
    };

    /**
     * 执行指定ViewModel的卸载动作
     *
     * @param  {string}    viewModelConfig viewModel配置
     * @param  {ViewModel} viewModel       viewModel实例
     */
    this._execViewModelUnInitial = function(viewModelConfig, viewModel, path){
        // 输出日志
        _log.debug("ViewModel [ " + viewModelConfig.viewModelClass + " ] unInit.");
        if (_util.isFunction(this.unInitialHandler)){
            this.unInitialHandler(function(){
                // 执行ViewModel的卸载函数
                if (_util.isFunction(viewModel.unInit)){
                    _action.doAction(viewModel.unInit.bind(viewModel));
                }
            }, viewModelConfig, path);
        }
    };

    /**
     * 取得并加载指定的ViewModelClass
     *
     * @public
     * @param  {Object}   config  View配置信息对象
     * @param  {string}   srcPath ViewModel脚本文件路径
     * @param  {Function} handler 加载成功后的回调函数
     */
    this.loadScript = function(config, srcPath, handler){
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

    /**
     * 根据View的Url路径映射取得对应的View配置信息
     *
     * @public
     * @param  {string} path     Url路径映射
     * @return {Object} 画面配置
     */
    this.getViewConfigByPath = function(path){
        var ret = _viewModelConfigs[path];
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

    /**
     * 根据Hash值取得View配置文件中最接近的Url映射路径
     *
     * 例：
     * 传入的hash为#a/b/c，配置文件中存在 a 和 a/b两个Url映射路径的场合
     * 函数返回 a/b
     *
     * @public
     * @param  {string} hash url hash值
     * @return {string} 映射路径
     */
    this.getViewPathFromHash = function(hash){
        var ret = "";

        if (!_util.isEmpty(hash)){
            // 删除hash头部的#
            if (hash.indexOf("#") === 0){
                hash = hash.substring(1);
            }

            for (var path in _viewModelConfigs){
                // 找到匹配的路径的并且此路径比之前找到的路径更为接近的场合
                if (hash.indexOf(path) === 0 &&
                        path.length > ret.length){
                    ret = path;
                }
            }
        }

        return ret;
    };

    /**
     * 跳转至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    this.forwardTo = function(path){
        // 当前ViewModelController的配置
        var config = this.getViewConfigByPath(path);
        // 传递的参数
        var param = arguments;
        // 当前ViewModelController实例对象
        var that = this;

        // 对正在使用的ViewModel进行卸载操作
        this._execViewModelUnInitial(_util.get(this._currentViewModelInfo, "config", {}),
            _util.get(this._currentViewModelInfo, "instance", ""),
            _util.get(this._currentViewModelInfo, "path", ""));

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
                        // 加载指定ViewModel
                        that._execViewModelInitial(config, viewModel, path, param);
                        // 把VM Class实例存入缓存
                        _viewModelCacheObject[path] = viewModel;
                        // 存储当前使用的ViewModel实例
                        that._currentViewModelInfo = {
                            "instance": viewModel,
                            "config": config,
                            "path": path
                        };
                    }
                });
            }
        }.bind(this));
    };

    /**
     * 回退至指定画面
     *
     * @public
     * @param  {string} path Url路径映射
     */
    this.backTo = function(path){
        // ViewModel配置信息
        var config = this.getViewConfigByPath(path);
        // 传递的参数
        var param = arguments;
        // 当前ViewModelController实例对象
        var that = this;

        // 对正在使用的ViewModel进行卸载操作
        this._execViewModelUnInitial(_util.get(this._currentViewModelInfo, "config", {}),
            _util.get(this._currentViewModelInfo, "instance", ""),
            _util.get(this._currentViewModelInfo, "path", ""));

        if (!_util.isEmpty(config)){
            // 渲染制定画面对应的模版
            _ui.updateHTML(this.getTemplatePath(config.template), function(){
                // 指定画面对应的ViewModel实例
                var viewModel = _viewModelCacheObject[path];
                // 更新画面标题
                _ui.updateDocumentTitle(config.title);
                // 取得缓存的VM
                if (viewModel){
                    var viewModelCacheObj = viewModel.cache;
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
                                viewModel.cache = viewModelCacheObj;
                                // 加载指定ViewModel
                                that._execViewModelInitial(config, viewModel, path, param);
                                // 把VM Class实例存入缓存
                                _viewModelCacheObject[path] = viewModel;
                                // 存储当前使用的ViewModel实例
                                that._currentViewModelInfo = {
                                    "instance": viewModel,
                                    "config": config,
                                    "path": path
                                };
                            }
                        });
                    }
                }
            }.bind(this));
        }else{
            // 抛出错误SESYSM001E
            _ui.showMessage(new SystemMessage("SESYSM001E", [path]), "error");
        }
    };

    /**
     * 取得View模版的完整路径
     *
     * @public
     * @param  {string} template vm配置文件中定义的模版名
     * @return {string} 模版的路径
     */
    this.getTemplatePath = function(template){
        var ret = "";
        if (!_util.isEmpty(template)){
            ret = _config.HTML_ROOT_DIR + template;
        }
        return ret;
    };

    /**
     * 取得View配置信息
     *
     * @public
     * @return {Object} View配置信息
     */
    this.getViewModelConfig = function(){
        return _viewModelConfigs;
    };

    this.getCurrentViewModelInfo = function(){
        return this._currentViewModelInfo;
    };
};
