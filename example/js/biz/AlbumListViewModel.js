/**
 * 唱片列表画面
 *
 * @ViewModel
 *
 * 修改历史
 * REV.         修改时间            修改人               修改内容
 * -------      ---------------    ----------------    ------------------
 */
var AlbumListViewModel = function(){

    /**
     * 唱片数据
     * @type {Array}
     */
    var _albumListData = [
        [
            [
                {
                    "type": "text",
                    "value": "歌曲序号"
                },
                {
                    "type": "text",
                    "value": "歌手名称"
                },
                {
                    "type": "text",
                    "value": "歌曲名称"
                }
            ]
        ],
        [
            [
                {
                    "type": "text",
                    "value": "1"
                },
                {
                    "type": "text",
                    "value": "Adele Adkins"
                },
                {
                    "type": "text",
                    "value": "Rolling In The Deep"
                }
            ],
            [
                {
                    "type": "text",
                    "value": "2"
                },
                {
                    "type": "text",
                    "value": "Adele Adkins"
                },
                {
                    "type": "text",
                    "value": "Someone Like You"
                }
            ],
            [
                {
                    "type": "text",
                    "value": "3"
                },
                {
                    "type": "text",
                    "value": "Adele Adkins"
                },
                {
                    "type": "text",
                    "value": "Set Fire To The Rain"
                }
            ],
            [
                {
                    "type": "text",
                    "value": "4"
                },
                {
                    "type": "text",
                    "value": "Avril Lavigne"
                },
                {
                    "type": "text",
                    "value": "Rock N Roll"
                }
            ],
            [
                {
                    "type": "text",
                    "value": "5"
                },
                {
                    "type": "text",
                    "value": "Avril Lavigne"
                },
                {
                    "type": "text",
                    "value": "Here's to Never Growing Up"
                }
            ]
        ],
        [
            [
                {
                    "type": "text",
                    "value": "6"
                },
                {
                    "type": "text",
                    "value": "Avril Lavigne"
                },
                {
                    "type": "text",
                    "value": "Bitchin' Summer"
                }
            ]
        ]
    ];

    /**
     * 画面加载
     *
     * @public
     */
    var init = function(){
        // 创建Grid和翻页控件
        this.initGrid(6);
        // 绑定检索按钮点击事件
        _html.bindEventById("albumSearchForm", "submit", this.searchAlbumData.bind(this));
        // 绑定翻页控件翻页事件
        _html.bindEventById("albumPage", "pageChange", this.changeAlbumDataPage.bind(this));

    };
    this.init = init;

    /**
     * 创建Grid和翻页控件
     *
     * @public
     * @param {Integer} totalRecords 数据总数
     */
    var initGrid = function(totalRecords, currentPageData){
        // 创建Grid控件并设值
        var albumDataSearchResultWrapper = new GridWidget("albumData", {
            "rowCount": _config.GRID_ROW_COUNT
        }, _albumListData[0].concat(_albumListData[1]));
        // 在画面渲染Grid控件
        albumDataSearchResultWrapper.placeTo(_html.byId("albumDataSearchResultWrapper"));
        // 创建翻页控件
        var albumDataSearchResultPageWrapper = new PageWidget("albumPage", null, {
            "totalRecords": totalRecords,
            "pageLength": _config.GRID_ROW_COUNT,
            "currentPageNo": 1
        });
        // 在画面渲染翻页控件
        albumDataSearchResultPageWrapper.placeTo(_html.byId("albumDataPageWrapper"));
    };
    this.initGrid = initGrid;

    /**
     * 检索按钮点击事件处理
     *
     * @public
     * @param  {Event} evt 事件对象
     */
    var searchAlbumData = function(evt){
        // 取得检索表单数据
        var searchData = _html.getValue("albumSearchForm");
        // 歌曲名称
        var albumName = _util.get(searchData, "albumName");
        // 检索的歌曲名称不为空的场合
        if (!_util.isEmpty(albumName)){
            var albumIndex = NaN;
            for (var i = 1; i < _albumListData.length; i++){
                for (var j = 0; j < _albumListData[i].length; j++){
                    if (_albumListData[i][j][2].value === albumName){
                        albumIndex = [j];
                        break;
                    }
                }
                if (!isNaN(albumIndex)){
                    break;
                }
            }
            // 检索的歌曲存在的场合
            if (!isNaN(albumIndex)){
                // 删除已经存在的Grid和翻页控件
                _html.removeDomNodeById("albumData");
                _html.removeDomNodeById("albumPage");
                this.initGrid(1);
            }
        }
    };
    this.searchAlbumData = searchAlbumData;

    /**
     * 翻页控件按钮点击事件处理
     *
     * @event
     */
    var changeAlbumDataPage = function(evt){
        // 取得Grid控件实例
        var albumDataSearchResultWrapper = new GridWidget().find("albumData");
        // 取得翻页控件实例
        var albumDataSearchResultPageWrapper = new PageWidget().find("albumPage");
        // 取得当前页号
        var currentPageNo = albumDataSearchResultPageWrapper.getCurrentPageNo();
        // 设置Grid控件的数据
        albumDataSearchResultWrapper.setValue(_albumListData[0].concat(_albumListData[currentPageNo]));
    };
    this.changeAlbumDataPage = changeAlbumDataPage;

};
