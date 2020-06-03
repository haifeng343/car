"use strict";
Component({
    properties: {
        startTimeName: {
            type: String
        },
        taskTime: {
            type: String
        },
        fee: {
            type: String
        },
        totalFee: {
            type: String
        }
    },
    methods: {
        bindCancel: function () {
            var detail = {
                stopShow: 'none'
            };
            this.triggerEvent('stopCancelEvent', detail);
        },
        bindConfirm: function () {
            var detail = {
                stopShow: 'none'
            };
            this.triggerEvent('stopConfrimEvent', detail);
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
