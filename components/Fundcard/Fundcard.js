"use strict";
Component({
    properties: {
        type: {
            type: Number,
            value: 1
        },
        data: {
            type: Object
        },
        showDetail: {
            type: Boolean,
            value: false
        }
    },
    data: {
        isLoaded: false,
        expand: false,
        height: 'auto',
        isListInit: false,
        listHeight: 0
    },
    methods: {
        handleShowDetail: function () {
            this.triggerEvent('onGotoDetail', this.data.data);
        },
        handleExpandClick: function () {
            var _a = this.data, expand = _a.expand, listHeight = _a.listHeight;
            var height = expand ? '0PX' : listHeight + "PX";
            this.setData({
                expand: !expand,
                height: height
            });
        }
    },
    lifetimes: {
        ready: function () {
            var _this = this;
            setTimeout(function () {
                if (_this.data.data.logList && _this.data.data.logList.length > 0) {
                    _this.createSelectorQuery()
                        .select('.withdraw-list.init')
                        .boundingClientRect(function (rect) {
                        if (rect) {
                            var listHeight = rect.height;
                            _this.setData({ isListInit: true, height: '0PX', listHeight: listHeight });
                        }
                    })
                        .exec();
                }
                _this.setData({ isLoaded: true });
            });
        }
    }
});
