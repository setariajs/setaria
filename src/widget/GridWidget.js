/**
 * 表格自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var GridWidget = function(id, data, value){
    Widget.call(this, "GridWidget", id, data, value);

    /**
     * 默认行高度
     *
     * @const
     * @type {Integer}
     */
    this.ROW_HEIGHT = 37;

    /**
     * 默认显示行数
     *
     * @const
     * @type {Integer}
     */
    this.DEFAULT_ROW_COUNT = 10;

    /**
     * 生成控件HTML字符串
     *
     * data: {
     *     "rowCount": 10   //default is 10
     * }
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        // 包含Title行
        var retHTML = '<div class="table-responsive"';
        var rowCount = !!this.data && _util.isNumber(this.data.rowCount) ? this.data.rowCount + 1 : this.DEFAULT_ROW_COUNT + 1;
        var tableHeight = this.ROW_HEIGHT * rowCount + 1;

        if (this.value.length >= rowCount){
            // 包含Table Border
            retHTML += ' style="height:' + tableHeight + 'px;"';
        }
        retHTML +=  '><table' +
            ' id="' + this.id + '"' +
            ' class="table table-bordered grid-widget grid-nowrap grid-widget-hover"' +
            '>';
        if (!_util.isEmpty(this.value)){
            retHTML = retHTML +
                this.createTHeadHTML(this.value.splice(0, 1)[0]) +
                this.createTBodyHTML(this.value) +
                '</table></div>';
        }
        return retHTML;
    };
    this.prepareHTML = prepareHTML;

    /**
     * 设置控件的值
     *
     * @public
     * @param {Object} value 设置的值
     */
    var setValue = function(value){
        if (this.dom){
            $(this.dom.querySelector("table > thead")).replaceWith(this.createTHeadHTML(value[0]));
            if (value.length > 1){
                $(this.dom.querySelector("table > tbody")).replaceWith(this.createTBodyHTML(value.splice(1)));
            }
        }
    };
    this.setValue = setValue;

    /**
     * 设置指定行的数据
     *
     * @public
     * @param {Integer} rowIndex 行号
     * @param {Object}  value    值
     */
    var setRowValue = function(rowIndex, value){
        if (rowIndex === 0){
            $(this.dom.querySelector("table > thead").rows[0]).replaceWith(this.createRowHTML(value, "head"));
        }else{
            $(this.dom.querySelector("table > tbody").rows[rowIndex - 1]).replaceWith(this.createRowHTML(value, "body"));
        }
    };
    this.setRowValue = setRowValue;

    /**
     * 设置指定单元格的数据
     *
     * @public
     * @param {Integer} rowIndex 行号
     * @param {Integer} colIndex 列号
     * @param {Object}  value    值
     */
    var setCellValue = function(rowIndex, colIndex, value){
        if (rowIndex === 0){
            $(this.dom.querySelector("table > thead").rows[0].children[colIndex]).replaceWith(this.createCellHTML(value, "th"));
        }else{
            $(this.dom.querySelector("table > tbody").rows[rowIndex - 1].children[colIndex]).replaceWith(this.createCellHTML(value, "td"));
        }
    };
    this.setCellValue = setCellValue;

    /**
     * 取得控件的值
     *
     * @public
     * @return {Object} 值
     */
    var getValue = function(){
        var ret = [];
        if (this.dom){
            for (var i = 0; i < this.dom.rows.length; i++){
                ret.push(this.getRowValue(i));
            }
        }
        return ret;
    };
    this.getValue = getValue;

    /**
     * 取得指定行的数据
     *
     * @public
     * @param  {Integer} rowIndex 行号
     * @return {Object}  值
     */
    var getRowValue = function(rowIndex){
        var ret = [];
            for (var i = 0; i < this.dom.rows[rowIndex].children.length; i++){
                ret.push(this.getCellValue(rowIndex, i));
            }
        return ret;
    };
    this.getRowValue = getRowValue;

    /**
     * 取得指定单元格的数据
     *
     * @public
     * @param  {Integer} rowIndex 行号
     * @param  {Integer} colIndex 列号
     * @return {Object}  值
     */
    var getCellValue = function(rowIndex, colIndex){
        var ret = null;
            var cell = this.dom.rows[rowIndex].children[colIndex];
            var cellType = cell.getAttribute("data-cell-type");
            var widgetType = "";
            if (cellType === "widget"){
                if (cell.children.length > 0){
                    widgetType = cell.children[0].getAttribute("data-widget-type");
                    var widgetClass = window[widgetType];
                    ret = new widgetClass().find(cell.children[0].getAttribute("id")).getValue();
                }
            }else{
                ret = cell.innerHTML;
            }
        return ret;
    };
    this.getCellValue = getCellValue;
};
GridWidget.prototype = Object.create(Widget.prototype);
GridWidget.prototype.construtor = GridWidget;
/**
 * 创建控件Header
 *
 * @param  {Object} value 值
 * @return {string} 控件HTML
 */
GridWidget.prototype.createTHeadHTML = function(value){
    var retHTML = '<thead>';
    if (value){
        retHTML += this.createRowHTML(value, "head");
    }
    return retHTML + '</thead>';
};
/**
 * 创建控件Body
 *
 * @param  {Object} value 值
 * @return {string} 控件HTML
 */
GridWidget.prototype.createTBodyHTML = function(value){
    var retHTML = '<tbody>';
    if (value){
        for (var i = 0; i < value.length; i++){
            retHTML += this.createRowHTML(value[i], "body");
        }
    }
    return retHTML + '</tbody>';
};
/**
 * 创建Body的行
 *
 * @param  {Object} value 值
 * @return {string} 控件行HTML
 */
GridWidget.prototype.createRowHTML = function(value, cellType){
    var trHTML = '<tr>';
    for (var i = 0; i < value.length; i++){

        var cell = value[i];
        if (cellType === "body"){
            trHTML += this.createCellHTML(cell, "td");
        }else{
            trHTML += this.createCellHTML(cell, "th");
        }
    }
    return trHTML + '</tr>';
};
/**
 * 创建Header的单元格HTML
 *
 * @param  {Object} cellObject 单元格数据
 * @return {string} 单元格HTML
 */
GridWidget.prototype.createCellHTML = function(cellObject, domType){
    var cellType = _util.isObject(cellObject) ? cellObject.type : "text";
    var cellHTML = '<' + domType + ' data-cell-type="' + cellType + '" ';
    var cellValue = "";

    cellHTML += ' style="height:' + this.ROW_HEIGHT + 'px" ';
    if (cellType === "widget"){
        cellValue = cellObject.value.createHTML();
    }else{
        cellValue = _util.isObject(cellObject) ? cellObject.value : cellObject;
        if (_util.isNumber(cellValue)){
            cellHTML += ' class="number-cell"';
        }
    }

    return cellHTML + '>' + cellValue + '</' + domType + '>';
};
