/**
 * 菜单自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var MenuWidget = function(id, data, value){
    Widget.call(this, "MenuWidget", id, data, value);

    /**
     * 缩进字符
     *
     * @const
     * @private
     * @type {string}
     */
    var INDENT = "&nbsp;&nbsp;&nbsp;&nbsp;";

    /**
     * 取得菜单文字的缩进字符
     *
     * @private
     * @param  {int}    deep 菜单层级
     * @return {string} 菜单文字的缩进字符
     */
    var getIndentByDeep = function(deep){
        var ret = "";
        for (var i = 0; i < deep; i++){
            ret += INDENT;
        }
        return ret;
    };

    /**
     * 绑定菜单项目点击事件
     *
     * @private
     */
    var bindWidgetEvent = function(){
        var dom = this.getDom();
        if (dom){
            // 绑定菜单子选项事件
            var menuOptions = dom.querySelectorAll("[role=click-menu]");
            for (var i = 0; i < menuOptions.length; i++){
                menuOptions[i].addEventListener("click", this.onMenuClick.bind(this));
            }
            // 绑定菜单父选项事件
            var menuParents = dom.querySelectorAll("[role=expand-menu]");
            for (var j = 0; j < menuParents.length; j++){
                menuParents[j].addEventListener("click", this.onMenuParentClick.bind(this));
            }
        }
    };
    this.bindWidgetEvent = bindWidgetEvent;

    /**
     * 创建菜单子选项
     *
     * @private
     * @param  {string} menuId   菜单ID
     * @param  {string} menuName 菜单显示值
     * @return {string} 菜单子选项的HTML文本
     */
    var createChildHtml = function(menuId, menuName, menuHref){
        return '<li><a href="' + menuHref +
                    '" role="click-menu" ' +
                    'id="' + menuId + '">' +
                    menuName + '</a></li>';
    };

    /**
     * 创建菜单父选项
     *
     * @private
     * @param  {string} menuId    菜单ID
     * @param  {string} menuName  菜单显示值
     * @param  {string} childHtml 菜单父选项内包含的子菜单的HTML文本
     * @return {string} 菜单父选项的HTML文本
     */
    var createParentHtml = function(menuId, menuName, childHtml){
        return '<li class="menu-parent">' +
                    '<a href="#" data-toggle="collapse" ' +
                    'aria-expanded="false" ' +
                    'role="expand-menu"' +
                    'class="menu-widget-option-toggle collapsed" ' +
                    'data-target="#' + menuId + '">' +
                    menuName +
                    '</a>' +
                    '<ul class="nav collapse" ' +
                    'id="' + menuId + '">' +
                    childHtml +
                    '</ul>' +
                '</li>';
    };

    /**
     * 从菜单数据源中取得指定的菜单项目对象
     *
     * @private
     * @param  {string} childrenId 子菜单项目ID
     * @param  {Array}  list       菜单数据源
     * @return {Object} 子菜单项目对象
     */
    var getChildrenByList = function(childrenId, list){
        var ret = null;

        for (var i = 0; i < list.length; i++){
            if (childrenId === list[i].menuId){
                ret = list[i];
                break;
            }
        }

        return ret;
    };

    /**
     * 创建菜单项目
     *
     * @private
     * @param  {Object} obj      菜单项目数据
     * @param  {Array}  list     菜单项目列表
     * @param  {string} parentId 当前菜单的父菜单的ID
     * @return {string} 菜单项目的HTML文本
     */
    var createMenuOptionHtml = function(obj, list, parentId, deep){
        var ret = "";
        // 当菜单名称为空时默认显示菜单ID
        var menuName = _util.isEmpty(obj.menuName) ? obj.menuId : obj.menuName;
        var menuHref = _util.isEmpty(obj.menuHref) ? "#" : obj.menuHref;
        // 添加缩进字符
        menuName = getIndentByDeep(deep) + menuName;
        parentId = _util.isEmpty(parentId) ? "root" : parentId;
        if (_util.isEmpty(obj.children)){
            // create child html
            ret = createChildHtml(obj.menuId, menuName, menuHref);
        }else{
            // create parent html
            var children = obj.children;
            var childHtml = "";
            deep++;
            for (var i = 0; i < children.length; i++){
                childHtml += createMenuOptionHtml(getChildrenByList(children[i], list), list, obj.menuId, deep);
            }

            var menuId = parentId + "-" + obj.menuId;
            ret = createParentHtml(menuId, menuName, childHtml);
        }
        return ret;
    };

    /**
     * 遍历菜单数据源查找并标识被其他节点引用的菜单项目
     *
     * @private
     * @param  {Array}  list 菜单数据源
     * @return {Array}  遍历后的菜单数据源
     */
    var tidyList = function(list){
        for (var i = 0; i < list.length; i++){
            // 当前的节点为父节点，并且没有被其他节点引用时
            if (!_util.isEmpty(list[i].children)){
                // 处理父节点拥有的子节点
                for (var j = 0; j < list[i].children.length; j++){
                    // 遍历列表标识节点为被引用节点
                    for (var k = 0; k < list.length; k++){
                        if (list[k].menuId === list[i].children[j] &&
                                list[k].isRefMenu !== true){
                            list[k].isRefMenu = true;
                        }
                    }
                }
            }
        }
        return list;
    };

    /**
     * 生成控件HTML字符串
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        var ret = '<ul class="nav menu-widget" id="' + this.id + '">';

        var deep = 0;

        if (this.data){
            tidyList(data);
            for (var i = 0; i < data.length; i++){
                if (data[i].isRefMenu !== true){
                    ret += createMenuOptionHtml(data[i], data, null, deep);
                }
            }
        }

        ret += '</ul>';
        return ret;
    };
    this.prepareHTML = prepareHTML;

    /**
     * 设置控件的值
     *
     * @public
     * @param {string} value 设置的值
     */
    var setValue = function(value){
        var targetMenuItem = null;
        this.value = value;
        // 如果存在既存的dom则直接设置dom的值
        if (this.dom){
            if (!_util.isEmpty(value)){
                targetMenuItem = this.dom.querySelector("#" + value);
                // 如果找到对应的菜单项目
                if (!!targetMenuItem){
                    // 展开此菜单项目所属的父菜单
                    this.expandParentMenu(targetMenuItem);
                    // 选中此菜单项目
                    this.selectMenuItem(targetMenuItem);
                }
            }
        }
        return this;
    };
    this.setValue = setValue;

    var expandParentMenu = function(child){
        var menuGroup = child.closest(".collapse");
        var menuGroupId = null;
        var parentMenu = null;
        if (!!menuGroup){
            // TODO 使用了bootstrap libs，考虑是否移除对bootstrap的依赖
            $(menuGroup).collapse("show");
        }
    };
    this.expandParentMenu = expandParentMenu;

    var deSelectMenuItem = function(){
        // 移除之前被选中的菜单项目的样式
        var selectedMenu = this.dom.querySelector(".menu-select");
        if (!!selectedMenu){
            selectedMenu.classList.remove("menu-select");
        }
    };
    this.deSelectMenuItem = deSelectMenuItem;

    var selectMenuItem = function(item){
        this.deSelectMenuItem();
        if (!!item){
            // 设置被选中的菜单项目的样式
            item.classList.add("menu-select");
        }

    };
    this.selectMenuItem = selectMenuItem;

    /**
     * 菜单子项目点击事件处理
     *
     * @private
     * @param  {Event}  evt 事件对象
     */
    var onMenuClick = function(evt){
        // 触发控件menuClick事件
        var e = new CustomEvent('menuClick', {
            "detail": {
                "menuId": evt.target.getAttribute("id")
            }
        });
        // 设置被选中的菜单项目的样式
        this.selectMenuItem(evt.target);
        this.dispatchEvent(e);
        // 阻止href='#'执行
        evt.preventDefault();
    };
    this.onMenuClick = onMenuClick;

    /**
     * 菜单父项目点击事件处理
     *
     * @private
     * @param  {Event}  evt 事件对象
     */
    var onMenuParentClick = function(evt){
        var dom = this.getDom();
        var allParentMenu = dom.querySelectorAll("[aria-expanded=true]");

        // 阻止href="#"更改URL
        if (evt && evt.target &&
                (evt.target.nodeName === "A" &&
                    evt.target.href.lastIndexOf("#") === evt.target.href.length - 1)){
            evt.preventDefault();
        }
        this.deSelectMenuItem();
    };
    this.onMenuParentClick = onMenuParentClick;
};
MenuWidget.prototype = Object.create(Widget.prototype);
MenuWidget.prototype.construtor = MenuWidget;
