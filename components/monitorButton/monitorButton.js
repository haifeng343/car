"use strict";
Component({
    properties: {
        buttonType: {
            type: Number
        },
        dataFlag: {
            type: Number,
        },
        allCount: {
            type: Number,
        }
    },
    methods: {
        startMonitor: function () {
            var detail = {};
            this.triggerEvent('startMonitorEvent', detail);
        },
        goRefresh: function () {
            var detail = {};
            this.triggerEvent('goRefreshEvent', detail);
        },
        goBack: function () {
            var detail = {};
            this.triggerEvent('goBackEvent', detail);
        }
    }
});
