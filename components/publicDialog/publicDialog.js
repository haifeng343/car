"use strict";
Component({
    properties: {},
    data: {},
    methods: {
        bindClose: function () {
            var detail = {
                publicShow: 'none',
            };
            this.triggerEvent('publicEvent', detail);
        },
        bindConfirm: function () {
            var detail = {
                publicShow: 'none',
            };
            this.triggerEvent('publicConfrimEvent', detail);
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
