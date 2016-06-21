/**
 * 系统处理模块
 *
 * @version 1.0
 * @author HanL
 */
 var _setaria = new function(){

    /**
     * 启动函数
     *
     * @public
     */
    var start = function(){
        // 更新引用文件的缓存
        // this.appendTokenOnImportFile();
        // 加载viewModel
        // 默认ViewModel的配置文件
        var defaultViewModelConfigFile = _config.VIEWMODEL_CONFIG_FILE;
        // 初期化ViewModelController
        window._viewModelController = new ViewModelController(defaultViewModelConfigFile);
        // 跳转页面
        this.dispatcher();
    };
    this.start = start;

    /**
     * Customize Dispatcher
     *
     * @public
     * @override
     * @return {[type]} [description]
     */
    var dispatcher = function(){
        this.defaultDispatcher();
    };
    this.dispatcher = dispatcher;

    /**
     * Default Dispatcher
     *
     * @protected
     */
    var defaultDispatcher = function(){
        // 取得url中的Hash参数
        var targetPageParams = _url.getHashParams();
        // 如果存在页面跳转定义
        if (!_util.isEmpty(targetPageParams)){
            _ui.forwardTo.apply(_ui, targetPageParams);
        }else{
            _ui.forwardTo(_config.WELCOME_PAGE);
        }
    };
    this.defaultDispatcher = defaultDispatcher;
 };
