/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
 var _setaria = new function(){
    "use strict";

    /**
     * 取得Setaria配置信息
     *
     * @private
     *
     * @param  {string}  contextRoot
     * @return {Boolean} 配置信息取得成功的场合，返回true
     */
    function _loadConfig(contextRoot){
        var ret = false;
        $("script").each(function(){
            // 配置文件路径
            var dataConfig = $(this).attr("data-setaria-config");
            // 配置文件内容
            var configContent = null;

            if (!_util.isEmpty(dataConfig)){
                // 把当前路径信息写入配置对象
                _config.SHELL_ROOT = contextRoot;
                // 取得配置文件内容
                configContent = _util.getFileContent(dataConfig, "json");

                // 无法取得配置文件的场合
                if (_util.isEmpty(configContent) ||
                        (!_util.isEmpty(configContent.textStatus) &&
                            configContent.textStatus === "error")){
                    _ui.showMessage("无法读取客户端系统配置文件。", "error");
                }else{
                    // 复制配置信息
                    $.each(configContent, function(key, value){
                        _config[key] = value;
                    });
                    ret = true;
                }
                // 退出循环
                return false;
            }
        });
        return ret;
    }

    /**
     * 取得当前路径
     *
     * @private
     * @return {string}
     */
    function _getContextRoot(){
        var ret = window.location.pathname;
        var pathLength = null;
        var pathArr = null;
        // 取得配置文件绝对路径
        if (ret !== "/"){
            ret = ret.substring(1);
            pathArr = ret.split("/");
            if (pathArr.length > 1){
                // 路径最后为文件的场合
                if (pathArr[pathArr.length - 1].indexOf(".")){
                    // 删除最后
                    pathArr.pop();
                }
            }
            ret = "/";
            for (var i = 0; i < pathArr.length; i++){
                ret += pathArr[i] + "/";
            }
        }
        return ret;
    }

    /**
     * 启动函数
     *
     * @param {Function} hanlder
     * @public
     */
    this.start = function(handler){
        // 取得当前路径
        var contextRoot = _getContextRoot();
        // 取得配置信息
        var loadConfigResult = _loadConfig(contextRoot);
        // 当成功加载配置文件时
        if (loadConfigResult){
            // 更新引用文件的缓存
            // this.appendTokenOnImportFile();
            // 加载viewModel
            // 默认ViewModel的配置文件
            var defaultViewModelConfigFile = _config.VIEWMODEL_CONFIG_FILE;
            // 初期化ViewModelController
            window._viewModelController = new ViewModelController(defaultViewModelConfigFile);
            // 绑定Hash Change事件
            this.bindHashChange();
            if (_util.isFunction(handler)){
                handler();
            }
            // 跳转页面
            this.dispatcher(window._viewModelController);
        }
    };

    /**
     * 绑定window的hashchange事件
     *
     * @public
     */
    this.bindHashChange = function(){
        $(window).on("hashchange", this.doHashChange);
    };

    /**
     * window的hashchange事件处理
     *
     * @public
     */
    this.doHashChange = function(){
        // TODO 点击了浏览器的回退按钮的场合，如何进行判断，是否引入history?
    };

    /**
     * Customize Dispatcher
     *
     * @public
     * @param  {ViewModelController} vmController 当前VMController实例
     */
    var dispatcher = function(vmController){
        this.defaultDispatcher(vmController);
    };
    this.dispatcher = dispatcher;

    /**
     * 默认跳转逻辑
     *
     * @public
     * @param  {ViewModelController} vmController 当前VMController实例
     */
    this.defaultDispatcher = function(vmController){
        // 当前的Hash值
        var hash = window.location.hash;
        // ViewModel的映射路径
        var path = null;
        // ViewModel的参数
        var param = null;
        // 目标跳转画面的信息
        var viewModelParams = [];

        // 如果存在页面跳转定义
        if (!_util.isEmpty(hash) && hash !== "#"){
            // 根据Hash值取得已配置的View的Url映射路径
            path = vmController.getViewPathFromHash(hash);
            // 没有找到对应的View
            if (_util.isEmpty(path)){
                // 跳转至首页
                _ui.forwardTo(_config.WELCOME_PAGE);
            }else{
                // 组装目标跳转画面的信息
                viewModelParams[0] = path;
                // 取得path后的字符作为参数传给ViewModel
                param = hash.substring(hash.indexOf(path) + path.length);
                viewModelParams[1] = param;
                // 画面跳转
                _ui.forwardTo.apply(_ui, viewModelParams);
            }
        }else{
            // 跳转至首页
            _ui.forwardTo(_config.WELCOME_PAGE);
        }
    };
 };
