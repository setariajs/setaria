/**
 * 文本框自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var TextWidget = function(id, data, value){
    Widget.call(this, "TextWidget", id, data, value);
    // 控件默认样式
    this.baseClass = "form-control";
    // 控件Html文本
    this.templateString = '<input type="text" id="{{id}}" class="{{styleClass}}" value="{{value}}"/>';

    /**
     * 生成控件HTML字符串
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        var ret = '<input type="' + TAG_TYPE +
            '" id="' + this.id +
            '" class="' + this.baseClass;
        if (!_util.isEmpty(this.value)){
            ret = ret + '" value="' + this.value;
        }
        ret += '"/>';
        return ret;
    };
    this.prepareHTML = prepareHTML;
};
TextWidget.prototype = Object.create(Widget.prototype);
TextWidget.prototype.construtor = TextWidget;
