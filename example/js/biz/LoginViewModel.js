/**
 * 登录画面
 *
 * @ViewModel
 *
 * 修改历史
 * REV.         修改时间            修改人               修改内容
 * -------      ---------------    ----------------    ------------------
 */
var LoginViewModel = function(targetPageParams){

    // 默认用户名
    var DEFAULT_LOGINID = "admin";
    // 默认密码
    var DEFAULT_PASSWORD = "1";

    /**
     * 画面加载
     *
     * @public
     */
    var init = function(){
        // 设置浏览器标题
        document.title = _config.APP_NAME;
        // 如果存在缓存数据
        if (!_util.isEmpty(this.cache.loginData)){
            // 设置记住我项目的值
            _html.setValue("rememberMe", this.cache.loginData.rememberMe);
        }
        // 绑定登录表单提交事件
        _html.bindEventById("signinForm", "submit", this.submitLoginFormEvent.bind(this));
    };
    this.init = init;

    /**
     * 登录按钮点击事件处理
     *
     * @event
     */
    var submitLoginFormEvent = function() {
        // 用户填写的表单数据
        var loginData = _html.getValue("signinForm");
        // 如果用户名密码与默认的一致
        if (loginData.loginId === DEFAULT_LOGINID &&
            loginData.password === DEFAULT_PASSWORD){
            // 储存当前页面状态
            this.cache.loginData = loginData;
            // 跳转至仪表板画面并传递登录信息
            _ui.forwardTo("dashboard", loginData);
        }else{
            // 显示错误消息
            _ui.showMessage(new Message("MSG001E"), "error");
        }

    };
    this.submitLoginFormEvent = submitLoginFormEvent;
};
