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
            "rowCount": 10
        }, _albumListData);
        // 在画面渲染Grid控件
        albumDataSearchResultWrapper.placeTo(_html.byId("albumDataSearchResultWrapper"));
    };
    this.init = init;

};
