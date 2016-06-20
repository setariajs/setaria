/**
 * 系统设定信息模块。
 *
 * @namespace
 * @version 1.0
 * @author HanL
 */
var _config = new function(){

    /**
     * 系统名称
     *
     * @const
     * @type {string}
     */
    this.APP_NAME = "";

    /**
     * 系统ID
     *
     * @const
     * @type {string}
     */
    this.APP_ID = "";

    /**
     * 系统欢迎页面
     *
     * @const
     * @type {string}
     */
    this.WELCOME_PAGE = "main";

    /**
     * 系统版本号
     *
     * @const
     * @type {string}
     */
    this.APP_REVISION = "1.0.0";

    /**
     * 异步HTTP通信的过期时间
     *
     * @const
     * @type {number}
     */
    this.DEFAULT_TIMEOUT = 20000;

    /**
     * 系统的Context Root
     *
     * @const
     * @type {String}
     */
   this.CONTEXT_ROOT = "/em_web/";

    /**
     * 访问的Service地址
     *
     * @const
     * @type {string}
     */
    this.SERVICE_URL = "WS/";

    /**
     * HTML页面文件保存目录
     *
     * @const
     * @type {string}
     */
    this.HTML_ROOT_DIR = "html/";

    /**
     * JavaScript文件保存目录
     *
     * @const
     * @type {String}
     */
    this.SRC_ROOT_DIR = "js/";

    /**
     * 系统业务画面显示区域
     *
     * @const
     * @type {string}
     */
    this.MAIN_AREA_ID = "_sys_container";

    /**
     * 系统首页页面ID
     *
     * @const
     * @type {String}
     */
    this.INDEX_PAGE_ID = "index";

    /**
     * 模式窗口控件ID
     *
     * @const
     * @type {String}
     */
    this.MODAL_AREA_ID = "_area_message_dialog";

    /**
     * 系统加载提示控件ID
     *
     * @const
     * @type {String}
     */
    this.LOADING_ID = "_loading";

    /**
     * 画面配置文件路径
     *
     * @const
     * @type {String}
     */
    this.VIEWMODEL_CONFIG_FILE = "./jslib/setaria/js/custom/viewModel_config.json";

    /**
     * 访问服务所使用的令牌的键值
     *
     * @const
     * @type {String}
     */
    this.SERVICE_ACCESS_TOKEN_KEY = "Token";

    /**
     * 表格每页行数
     *
     * @const
     * @type {Number}
     */
    this.TABLE_PAGE_LENGTH = 10;

    /**
     * 取得本地配置文件时所使用的缓存值
     *
     * @const
     * @return {Function} 缓存值
     */
    this.createCacheTokenForHTML = function(){
        return this.APP_REVISION;
    };
};
