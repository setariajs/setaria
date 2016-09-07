/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
 var _setaria = new function(){

    /**
     * 取得配置信息
     *
     * @private
     */
    var _loadConfig = function(){
        var ret = false;
        $("script").each(function(){
            var dataConfig = $(this).attr("data-setaria-config");

            if (!_util.isEmpty(dataConfig)){
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
    };

    /**
     * 启动函数
     *
     * @public
     */
    var start = function(){
        // 取得配置信息
        var loadConfigResult = _loadConfig();
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
            // 跳转页面
            this.dispatcher(window._viewModelController);
        }
    };
    this.start = start;

    /**
     * 绑定window的hashchange事件
     */
    var bindHashChange = function(){
        $(window).on("hashchange", this.doHashChange);
    };
    this.bindHashChange = bindHashChange;

    /**
     * window的hashchange事件处理
     */
    var doHashChange = function(){
        // TODO 点击了浏览器的回退按钮的场合，如何进行判断，是否引入history?
    };
    this.doHashChange = doHashChange;

    /**
     * Customize Dispatcher
     *
     * @public
     * @override
     * @return {[type]} [description]
     */
    var dispatcher = function(vmController){
        this.defaultDispatcher(vmController);
    };
    this.dispatcher = dispatcher;

    /**
     * Default Dispatcher
     *
     * @protected
     */
    var defaultDispatcher = function(vmController){
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
            // 根据Hash值取得已配置的ViewModel的映射地址
            path = vmController.getViewModelPathFromHash(hash);
            // 没有找到对应的ViewModel
            if (_util.isEmpty(path)){
                // 显示错误消息
                _ui.showMessage(new SystemMessage("SESYSM001E"), "error");
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
    this.defaultDispatcher = defaultDispatcher;
 };
