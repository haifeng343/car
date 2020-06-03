"use strict";
Component({
    properties: {
        searchType: {
            type: Number,
            value: 1,
        },
        mSelect: {
            type: Number
        },
    },
    methods: {
        goSelect: function (e) {
            var index = e.currentTarget.dataset.index;
            var detail = {
                index: index
            };
            this.triggerEvent('selectEvent', detail);
        }
    }
});
