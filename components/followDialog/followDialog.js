"use strict";
Component({
    properties: {
        text: {
            type: String,
        },
        followType: {
            type: Number
        }
    },
    methods: {
        bindCancel: function () {
            var detail = {
                show: 'none',
                followType: this.properties.followType
            };
            this.triggerEvent('cancelEvent', detail);
        },
        bindConfirm: function () {
            var detail = {
                show: 'none',
                followType: this.properties.followType
            };
            this.triggerEvent('confirmEvent', detail);
        },
        knowConfirm: function () {
            var detail = {
                show: 'none',
                followType: this.properties.followType
            };
            this.triggerEvent('knowEvent', detail);
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
