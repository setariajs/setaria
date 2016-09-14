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

        // 绑定菜单按钮点击事件
        _html.bindEventById("systemMenu", "click", this.clickMenu);

        // 绑定登出系统按钮点击事件
        _html.bindEventById("logoutSystem", "click", this.logoutSystem);
    };
    this.init = init;

    /**
     * 菜单项点击事件处理
     *
     * @private
     */
    var clickMenu = function(evt){
        // 点击的菜单项节点
        var target = evt.target;
        // 当前菜单项的目标画面
        var targetViewPath = target.getAttribute("href");
        if (targetViewPath.indexOf("#") === 0){
            // 删除#
            targetViewPath = targetViewPath.substring(1);
            // 如果存在目标画面
            if (!_util.isEmpty(targetViewPath)){
                _ui.forwardTo(targetViewPath);
            }
        }
    };
    this.clickMenu = clickMenu;

    /**
     * 退出系统按钮点击事件处理
     *
     * @event
     */
    var logoutSystem = function(){
        // 切换页面刷新区域
        _config.MAIN_AREA_ID = "_sys_container";
        // 清除Url的Hash值
        _url.clearHash();
        // 回退至登录画面
        _ui.backTo("login");
    };
    this.logoutSystem = logoutSystem;
};
