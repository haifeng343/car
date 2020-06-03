"use strict";
Component({
    properties: {
        deleteItem: {
            type: Object
        }
    },
    data: {},
    methods: {
        bindCancel: function () {
            this.triggerEvent('monitorStopEvent', { value: 'none' });
        },
        bindConfirm: function () {
            this.triggerEvent('monitorConfirmEvent', { value: 'none' });
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
