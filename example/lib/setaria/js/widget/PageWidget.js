/**
 * 翻页自定义控件
 *
 * @widget
 * @param {string} id 控件ID
 */
var PageWidget = function(id, data, value){
    Widget.call(this, "PageWidget", id, data, value);

    /**
     * PAGE_NO
     *
     * @private
     * @type {string}
     */
    var PAGE_NO_ATTRIBUTE = "data-page-widget-current-pageno";

    /**
     * 翻页类型
     *
     * @private
     * @enum {PAGE}
     */
    var PAGE = {
        "FIRST": "first",
        "PREV": "prev",
        "NEXT": "next",
        "LAST": "last"
    };

    var dummyDom = $("<div></div>");

    /**
     * 更新当前页号
     *
     * @private
     * @param  {string} pageNo
     */
    var updateCurrentPageNo = function(pageNo){
        if (this.dom){
            this.dom.setAttribute(PAGE_NO_ATTRIBUTE, pageNo);
        }
    };
    this.updateCurrentPageNo = updateCurrentPageNo;

    /**
     * 绑定按钮事件
     *
     * @private
     */
    var bindPageButtonEvent = function(){
        if (this.dom){
            _html.byId("table-page-first-button").addEventListener("click",
                this.onPageChange.bind(this));
            _html.byId("table-page-prev-button").addEventListener("click",
                this.onPageChange.bind(this));
            _html.byId("table-page-next-button").addEventListener("click",
                this.onPageChange.bind(this));
            _html.byId("table-page-last-button").addEventListener("click",
                this.onPageChange.bind(this));
        }
    };
    this.bindPageButtonEvent = bindPageButtonEvent;

    /**
     * 更新翻页按钮状态
     *
     * @private
     */
    var updatePaginationButton = function(){
        var totalPages = Math.ceil(this.value.totalRecords/this.value.pageLength);
        if (this.value.currentPageNo === 1){
            _html.byId("table-page-first-button").className = "disabled";
            _html.byId("table-page-prev-button").className = "disabled";
        }else{
            _html.byId("table-page-first-button").className = "";
            _html.byId("table-page-prev-button").className = "";
        }
        if (totalPages <= 1 || totalPages === this.value.currentPageNo){
            _html.byId("table-page-next-button").className = "disabled";
            _html.byId("table-page-last-button").className = "disabled";
        }else{
            _html.byId("table-page-next-button").className = "";
            _html.byId("table-page-last-button").className = "";
        }
    };
    this.updatePaginationButton = updatePaginationButton;

    /**
     * 更新页号
     *
     * @private
     * @return {[type]} [description]
     */
    var updatePageInfo = function(){
        var totalRecords = parseInt(this.value.totalRecords, 10);
        var pageLength = parseInt(this.value.pageLength, 10);
        var pages = Math.ceil(totalRecords/pageLength);
        pages = pages === 0 ? 1 : pages;
        _html.byId("pageWidgetInfo").innerHTML = this.value.currentPageNo +
            ' / ' +
            pages +
            ' 页' +
            '  共 ' +
            this.value.totalRecords +
            ' 条记录';
    };
    this.updatePageInfo = updatePageInfo;

    /**
     * 生成控件HTML字符串
     *
     * @private
     * @override
     * @return {string} 控件HTML字符串
     */
    var prepareHTML = function(){
        var totalRecords = parseInt(this.value.totalRecords, 10);
        var pageLength = parseInt(this.value.pageLength, 10);
        var pages = Math.ceil(totalRecords/pageLength);
        var retHTML = '<div class="row page-widget" ' +
            'id="' + this.id + '" ' +
            'data-total-records="' + this.value.totalRecords + '" ' +
            'data-page-length="' + this.value.pageLength + '" ' +
            '>';

        pages = pages === 0 ? 1 : pages;
        // 设置currentPageNo的默认值
        this.value.currentPageNo = _util.isNumber(this.value.currentPageNo) ?
            this.value.currentPageNo : 1;
        // 翻页信息
        retHTML += '<div class="col-lg-10 col-md-10 col-sm-10 col-xs-8' +
            ' page-widget-pageNo"' +
            'id="pageWidgetInfo">';
        retHTML += this.value.currentPageNo +
            ' / ' +
            pages +
            ' 页' +
            '  共 ' +
            this.value.totalRecords +
            ' 条记录';
        retHTML += '</div>';

        // 翻页按钮
        retHTML += '<div class="col-lg-14 col-md-14 col-sm-14 col-xs-16 page-widget-button' +
            '">' +
            '<ul class="pagination page-widget-pagination">';
        retHTML = retHTML +
            '<li id="table-page-first-button"><a href="#" data-button-type="' +
            PAGE.FIRST +
            '">首页</a></li>';
        retHTML = retHTML +
            '<li id="table-page-prev-button"><a href="#" data-button-type="' +
            PAGE.PREV +
            '">前页</a></li>';
        retHTML = retHTML +
            '<li id="table-page-next-button"><a href="#" data-button-type="' +
            PAGE.NEXT +
            '">后页</a></li>';
        retHTML = retHTML +
            '<li id="table-page-last-button"><a href="#" data-button-type="' +
            PAGE.LAST +
            '">末页</a></li>';
        retHTML += '</ul></div>';

        retHTML = this.updatePaginationButtonByDummy(dummyDom.html(retHTML));

        return retHTML;
    };
    this.prepareHTML = prepareHTML;

    /**
     * 更新翻页按钮状态
     *
     * @private
     */
    var updatePaginationButtonByDummy = function(dom){
        var totalPages = Math.ceil(this.value.totalRecords/this.value.pageLength);
        if (this.value.currentPageNo === 1){
            $("#table-page-first-button", dom).attr("class", "disabled");
            $("#table-page-prev-button", dom).attr("class", "disabled");
        }else{
            $("#table-page-first-button", dom).attr("class", "");
            $("#table-page-prev-button", dom).attr("class", "");
        }
        if (totalPages <= 1 || totalPages === this.value.currentPageNo){
            $("#table-page-next-button", dom).attr("class", "disabled");
            $("#table-page-last-button", dom).attr("class", "disabled");
        }else{
            $("#table-page-next-button", dom).attr("class", "");
            $("#table-page-last-button", dom).attr("class", "");
        }
        return dom.html();
    };
    this.updatePaginationButtonByDummy = updatePaginationButtonByDummy;

    /**
     * 翻页按钮点击事件处理
     *
     * @private
     * @param  {Event}  evt 按钮点击事件对象
     */
    var onPageChange = function(evt){
        if (evt.target.parentNode.className === "disabled"){
            // 取消事件的默认行为
            evt.preventDefault();
            // 阻止事件的传播
            evt.stopPropagation();
            return;
        }
        var pageNo = 0;
        var pageChangeType = evt.target.getAttribute("data-button-type");
        // 根据点击的按钮进行页号更新
        switch(pageChangeType){
            case PAGE.FIRST:
                pageNo = 1;
                this.value.currentPageNo = 1;
                break;
            case PAGE.PREV:
                pageNo = --(this.value.currentPageNo);
                break;
            case PAGE.NEXT:
                pageNo = ++(this.value.currentPageNo);
                break;
            case PAGE.LAST:
                pageNo = Math.ceil(this.value.totalRecords/this.value.pageLength);
                this.value.currentPageNo = pageNo;
                break;
        }
        pageNo = pageNo < 1 ? 1 : pageNo;
        // 更新翻页信息
        this.updatePageInfo();
        // 更新翻页按钮状态
        this.updatePaginationButton();
        // 存储页号
        this.updateCurrentPageNo(pageNo);
        // 触发控件pageChange事件
        var e = $.Event("pageChange");
        // var e = new CustomEvent('pageChange', {
            // "detail": {
                // "pageNo": pageNo
            // }
        // });
        $(this.dom).trigger(e);
        // this.dispatchEvent(e);

        // 阻止href='#'执行
        evt.preventDefault();
    };
    this.onPageChange = onPageChange;

    /**
     * 把控件放置到指定节点
     *
     * @public
     * @param  {Element}  targetNode 放置节点
     * @param  {emnu}     position   放置的位置
     * @return {Widget}
     */
    var placeTo = function(targetNode, position){
        this.construtor.prototype.placeTo.call(this, targetNode, position);
        this.bindPageButtonEvent();
        this.updatePageInfo();
        this.updatePaginationButton();
        this.updateCurrentPageNo(this.value.currentPageNo);
        return this;
    };
    this.placeTo = placeTo;

    /**
     * 使用当前控件替换指定节点对象
     *
     * @public
     * @param  {Element}  targetNode 放置节点
     * @return {Widget}
     */
    var replaceTo = function(targetNode){
        this.construtor.prototype.replaceTo.call(this, targetNode);
        this.bindPageButtonEvent();
        this.updatePageInfo();
        this.updatePaginationButton();
        return this;
    };
    this.replaceTo = replaceTo;

    /**
     * 取得当前页号
     *
     * @public
     * @return {string} 当前页号
     */
    var getCurrentPageNo = function(){
        return this.dom ? this.dom.getAttribute(PAGE_NO_ATTRIBUTE) : "";
    };
    this.getCurrentPageNo = getCurrentPageNo;
};
PageWidget.prototype = Object.create(Widget.prototype);
PageWidget.prototype.construtor = PageWidget;
