"use strict";
Component({
    properties: {
        text: {
            type: String
        }
    },
    data: {},
    methods: {
        bindCancel: function () {
            this.triggerEvent('monitorEndEvent', { value: 'none' });
        },
        bindConfirm: function () {
            this.triggerEvent('monitorEndConfirmEvent', { value: 'none' });
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
