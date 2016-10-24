/**
 * 自定义控件基类
 *
 * @widget
 * @param {string} id 控件ID
 */
var Widget = function(widgetType, id, data, value){
    // 控件ID
    this.id = id;
    // 控件的值
    this.value = value;
    // 控件的自定义属性值
    this.data = data;
    // 控件的类型
    this.widgetType = widgetType;
    // 更新dom节点对象
    this.updateDom();
};

/**
 * 控件放置位置类型
 *
 * @enum {POS}
 * @type {Object}
 */
Widget.POS = {
    "BEFORE": "before",
    "AFTER": "after",
    "FIRST": "first",
    "LAST": "last"
};

/**
 * 默认样式
 *
 * @public
 * @type {string}
 */
Widget.prototype.baseClass = "";

/**
 * 控件Html文本
 *
 * @public
 * @type {string}
 */
Widget.prototype.templateString = "";

/**
 * 生成控件Html文本
 *
 * @public
 * @return {string} 控件Html文本
 */
Widget.prototype.prepareHTML = function(){
    return this.templateHtml;
};

/**
 * 根据输入值组装控件Html文本
 * @param  {Object} param 参数
 * @return {string} Html文本
 */
Widget.prototype.buildTemplateString = function(param){
    var ret = "";
    var KEY_PREFIX = "{{";
    var KEY_SUFFIX = "}}";
    if (!_util.isEmpty(param) && !_util.isEmpty(this.templateString)){
        for (var key in param){

        }
    }
    return ret;
};

/**
 * 生成控件HTML字符串
 *
 * @abstract
 * @return   {string} 控件HTML字符串
 */
Widget.prototype.createHTML = function(){
    var widgetHTML = this.prepareHTML();
    var findHTML = 'id="' + this.id + '"';
    var replaceHTMLArray = [];
    replaceHTMLArray.push('data-widget-type="' + this.widgetType + '"');
    var ret =  widgetHTML.replace(findHTML, findHTML +
        ' ' + replaceHTMLArray.join(' '));
    return ret;
};

/**
 * 更新节点对象
 *
 * @private
 */
Widget.prototype.updateDom = function(){
    // 控件在画面上对应的节点对象
    this.dom = document.getElementById(this.id);
};

/**
 * 取得DOM
 *
 * @public
 * @return {Element} 控件在画面上对应的节点对象
 */
Widget.prototype.getDom = function(){
    return this.dom;
};

/**
 * 设置控件的值
 *
 * @public
 * @param {string} value 设置的值
 * @return {Widget}
 */
Widget.prototype.setValue = function(value){
    // 如果存在既存的dom则直接设置dom的值
    if (this.dom){
        this.dom.value = value;
    }
    return this;
};

/**
 * 取得控件的当前值
 *
 * @public
 * @return {string} 控件当前值
 */
Widget.prototype.getValue = function(){
    var ret = null;
    if (this.dom){
        ret = this.dom.value;
    }
    return ret;
};

/**
 * 把控件放置到指定节点
 *
 * @public
 * @param  {Element}  targetNode 放置节点
 * @param  {emnu}     position   放置的位置
 * @return {Widget}
 */
Widget.prototype.placeTo = function(targetNode, position){
    var _widgetNode = $(this.createHTML());
    targetNode = $(targetNode);
    // 把生成控件渲染到画面
    switch(position){
        // 放置在目标节点前
        case Widget.POS.BEFORE:
            targetNode.before(_widgetNode);
            break;
        // 放置在目标节点后
        case Widget.POS.AFTER:
            targetNode.after(_widgetNode);
            break;
        // 放置在目标节点内部开头
        case Widget.POS.FIRST:
            targetNode.prepend(_widgetNode);
            break;
        // 放置在目标节点内部结尾
        default:
            targetNode.append(_widgetNode);
    }
    // 更新控件节点对象
    this.updateDom();
    // 绑定控件自定义事件
    this.bindWidgetEvent();
    return this;
};

/**
 * 使用当前控件替换指定节点对象
 *
 * @public
 * @param  {Element}  targetNode 放置节点
 * @return {Widget}
 */
Widget.prototype.replaceTo = function(targetNode){
    // 替换控件节点对象
    $(targetNode).replaceWith(this.createHTML());
    // 更新控件节点对象
    this.updateDom();
    // 绑定控件自定义事件
    this.bindWidgetEvent();
    return this;
};

/**
 * 控制控件的使用可否
 *
 * @public
 * @param  {Boolean}  value true：有效 false：无效
 * @return {Widget}
 */
Widget.prototype.disable = function(value){
    this.disable = value;
    var doDisable = function(node, value) {
        if (node){
            node.disabled = value;
            if (node.children){
                var child = node.children;
                if (child.length > 0) {
                    for (var i = 0; i < child.length; i++) {
                        doDisable(child[i], value);
                    }
                }
            }
        }
    };
    doDisable(this.dom, value);
};

/**
 * 通过CSS式样设置控件的显示方式
 *
 * @public
 * @param  {Element}  display 显示式样
 * @return {Widget}
 */
Widget.prototype.display = function(display){
    this.dom.style.display = display;
};

/**
 * 取得控件的CSS式样
 *
 * @public
 * @return {Widget的CSS Style}
 */
Widget.prototype.getStyle = function(){
    return this.dom.style;
};

/**
 * 绑定控件事件
 *
 * @public
 * @param {string}   eventName    事件名称
 * @param {Function} callbackFunc 事件触发时的回调函数
 */
Widget.prototype.addEventListener = function(eventName, callbackFunc){
    this.dom.addEventListener(eventName, function(evt){
        _action.doAction(callbackFunc, evt);
    }, true);
    return this;
};

/**
 * 触发控件自定义事件
 *
 * @private
 * @param  {Event} event 事件对象
 */
Widget.prototype.dispatchEvent = function(event){
    this.dom.dispatchEvent(event);
};

/**
 * 根据控件ID取得指定控件
 *
 * @public
 * @param  {string} id 控件ID
 */
Widget.prototype.find = function(id){
    this.id = id;
    this.updateDom();
    return this;
};

/**
 * 控件内部事件绑定函数
 *
 * @private
 */
Widget.prototype.bindWidgetEvent = function(){
};
