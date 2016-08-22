/**
 * 仪表板画面
 *
 * @ViewModel
 *
 * 修改历史
 * REV.         修改时间            修改人               修改内容
 * -------      ---------------    ----------------    ------------------
 */
var DashBoardViewModel = function(loginData){

    /**
     * 画面加载
     *
     * @public
     */
    var init = function(){
        // 设置系统名称
        _html.byId("systemBrand").innerHTML = _config.APP_NAME;
        // 设置登录用户名称
        _html.byId("loginUserName").innerHTML = loginData.loginId;

        // 修改页面刷新区域
        _config.MAIN_AREA_ID = "_page_container";

        // 绑定登出系统按钮点击事件
        _html.bindEventById("logoutSystem", "click", this.logoutSystem);
    };
    this.init = init;

    /**
     * 退出系统按钮点击事件处理
     *
     * @event
     */
    var logoutSystem = function(){
        // 切换页面刷新区域
        _config.MAIN_AREA_ID = "_sys_container";
        // 清除Hash值
        _url.clearHash();
        // 回退至登录画面
        _ui.backTo("login");
    };
    this.logoutSystem = logoutSystem;
};
