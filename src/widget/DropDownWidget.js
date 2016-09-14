/**
 * 下拉列表自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var DropDownWidget = function(id, data, value){
    Widget.call(this, "DropDownWidget", id, data, value);
    // 控件默认样式
    this.baseClass = "form-control";

    /**
     * 生成控件HTML字符串
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        var ret = '<select id="' + this.id +
            '" class="' + this.baseClass + '">';

        if (this.data){
            // 根据输入值创建下拉列表选项
            for(var i = 0; i < this.data.length; i++){
                var item = this.data[i];
                ret = ret +
                    '<option value="' +
                    item.value + '"';
                if (this.value === item.value){
                    ret = ret + ' selected="selected';
                }
                ret = ret +
                    '">' +
                    item.label +
                    '</option>';
            }
        }
        ret += "</select>";
        return ret;
    };
    this.prepareHTML = prepareHTML;
};
DropDownWidget.prototype = Object.create(Widget.prototype);
DropDownWidget.prototype.construtor = DropDownWidget;
