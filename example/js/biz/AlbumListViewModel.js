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
        ],
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
    ];

    /**
     * 唱片列表第二页数据
     * @type {Array}
     */
    var _albumListDataPageTwo = [
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
    ];

    /**
     * 画面加载
     *
     * @public
     */
    var init = function(){
        // 创建Grid控件并设值
        var albumDataSearchResultWrapper = new GridWidget("albumData", {
            "rowCount": _config.GRID_ROW_COUNT
        }, _albumListData);
        // 在画面渲染Grid控件
        albumDataSearchResultWrapper.placeTo(_html.byId("albumDataSearchResultWrapper"));
        // 创建翻页控件
        var albumDataSearchResultPageWrapper = new PageWidget("albumPage", null, {
            "totalRecords": 6,
            "pageLength": _config.GRID_ROW_COUNT,
            "currentPageNo": 1
        });
        // 在画面渲染翻页控件
        albumDataSearchResultPageWrapper.placeTo(_html.byId("albumDataPageWrapper"));
        _html.bindEventById("albumPage", "pageChange", this.changeAlbumDataPage);
    };
    this.init = init;

    /**
     * 翻页控件按钮点击事件处理
     *
     * @event
     */
    var changeAlbumDataPage = function(evt){

    };
    this.changeAlbumDataPage = changeAlbumDataPage;

};
