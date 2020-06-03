"use strict";
Component({
    properties: {
        bottomType: {
            type: Number
        },
        taskTime: {
            type: String
        },
        totalFee: {
            type: Number
        },
        editFlag: {
            type: Boolean
        },
        selectNum: {
            type: Number
        },
        selectAllFlag: {
            type: Boolean
        },
        fee: {
            type: Number
        },
        ddCoin: {
            type: Number
        },
    },
    methods: {
        startMonitor: function () {
            var detail = {};
            this.triggerEvent('startMonitor', detail);
        },
        stopMonitor: function () {
            var detail = {};
            this.triggerEvent('stopMonitorEvent', detail);
        },
        goBack: function () {
            var detail = {};
            this.triggerEvent('goBackEvent', detail);
        },
        goSave: function () {
            var detail = {};
            this.triggerEvent('goSaveEvent', detail);
        },
        goToSelectAll: function () {
            var detail = {};
            this.triggerEvent('selectAllEvent', detail);
        },
        deleteBatchItem: function () {
            var detail = {};
            this.triggerEvent('deleteBatchEvent', detail);
        }
    }
});
