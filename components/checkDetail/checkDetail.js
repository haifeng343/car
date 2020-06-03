"use strict";
Component({
    properties: {
        allCount: {
            type: Number
        },
        showCount: {
            type: Number
        },
        sortType: {
            type: Number,
            value: 0
        },
        lowPrice: {
            type: Number,
        }
    },
    methods: {
        goToDetail: function () {
            var detail = {};
            this.triggerEvent('detailEvent', detail);
        }
    }
});
