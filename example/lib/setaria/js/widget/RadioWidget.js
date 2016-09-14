/**
 * 单选按钮自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var RadioWidget = function(id, data, value){
    Widget.call(this, "RadioWidget", id, data, value);
    // 控件默认样式
    this.baseClass = "radio-inline";

    var TAG_TYPE = "radio";

    /**
     * 生成控件HTML字符串
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        var ret = "<div id='" + this.id + "'>";
        if (this.data){
            // 根据输入值创建单选按钮
            for(var i = 0; i < this.data.length; i++){
                var item = this.data[i];
                ret = ret +
                    "<label class='" + this.baseClass + "'>";
                ret = ret +
                    "<input name='" + this.id +
                    "' type='" + TAG_TYPE +
                    "' value='" + item.value +
                    "'/>" + item.label;
                ret = ret + "</label>";
            }
        }
        ret += "</div>";
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
        if (!_util.isNumber(value) && _util.isEmpty(value)){
            value = "";
        }
        this.value = value;
        // 如果存在既存的dom则直接设置dom的值
        if (this.dom){
            var radioWidgets = this.dom.querySelectorAll("[name=" + this.id + "]");
            for (var i = 0; i < radioWidgets.length; i++){
                var widget = radioWidgets[i];
                // 选中对应的单选按钮
                if (widget.value === value + ""){
                    widget.checked = true;
                }else{
                    widget.checked = false;
                }
            }
        }
        return this;
    };
    this.setValue = setValue;

    /**
     * 取得控件的当前值
     *
     * @public
     * @return {string} 控件当前值
     */
    var getValue = function(){
        var ret = null;
        if (this.dom){
            var radioWidgets = this.dom.querySelectorAll("[name=" + this.id + "]");
            for (var i = 0; i < radioWidgets.length; i++){
                var widget = radioWidgets[i];
                // 选中对应的单选按钮
                if (widget.checked){
                    ret = widget.value;
                    break;
                }
            }
        }
        return ret;
    };
    this.getValue = getValue;
};
RadioWidget.prototype = Object.create(Widget.prototype);
RadioWidget.prototype.construtor = RadioWidget;
