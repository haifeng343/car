"use strict";
Component({
    properties: {},
    data: {},
    methods: {
        bindCancel: function () {
            this.triggerEvent('monitorStartEvent', { value: 'none' });
        },
        bindConfirm: function () {
            this.triggerEvent('monitorStartConfirmEvent', { value: 'none' });
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
