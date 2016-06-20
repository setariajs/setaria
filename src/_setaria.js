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
     * 添加token至引用的script文件
     *
     * @protected
     */
    // var appendTokenOnImportFile = function(){
    //     var token = _config.createCacheTokenForHTML();
    //     // css
    //     $("link").each(function(){
    //         var cssHref = this.getAttribute("href");
    //         if (this.getAttribute("type") === "text/css"){
    //             this.setAttribute("href", cssHref + "?" + token);
    //         }
    //     });
    //     // script
    //     $.each(document.scripts, function(){
    //         var srcAttr = this.getAttribute("src");
    //         if (!_util.isEmpty(srcAttr)){
    //             this.setAttribute("src", srcAttr + "?" + token);
    //         }
    //     });
    // };
    // this.appendTokenOnImportFile = appendTokenOnImportFile;

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
     * Dispatcher
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
