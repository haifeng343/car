"use strict";
Component({
    properties: {
        updateData: {
            type: Object
        },
        defalutData: {
            type: Object
        },
    },
    methods: {
        bindCancel: function () {
            var detail = { updateShow: 'none' };
            this.triggerEvent('updateCancelEvent', detail);
        },
        bindConfirm: function () {
            var detail = { updateShow: 'none' };
            this.triggerEvent('updateConfrimEvent', detail);
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
