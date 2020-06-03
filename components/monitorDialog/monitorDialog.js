"use strict";
Component({
    properties: {
        ddCoin: {
            type: Number,
            value: 0
        },
        bindPublic: {
            type: Boolean
        },
        title: {
            type: String
        },
        fee: {
            type: Number,
            value: 1
        }
    },
    data: {
        publicSelect: false,
        noteSelect: true,
    },
    methods: {
        bindCancel: function () {
            var detail = {
                monitorShow: 'none'
            };
            this.triggerEvent('monitorEvent', detail);
            this.setData({
                publicSelect: false,
                noteSelect: true,
            });
        },
        bindConfirm: function () {
            if (!this.data.publicSelect && !this.data.noteSelect) {
                wx.showToast({
                    title: '请先选择通知方式',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            var detail = {
                monitorShow: 'none',
                publicSelect: this.data.publicSelect,
                noteSelect: this.data.noteSelect
            };
            this.triggerEvent('monitorConfirmEvent', detail);
            this.setData({
                publicSelect: false,
                noteSelect: true,
            });
        },
        bindPublic: function () {
            if (!this.data.bindPublic) {
                var detail = {
                    publicShow: 'block',
                    monitorShow: 'none'
                };
                this.triggerEvent('monitorPublicEvent', detail);
                return;
            }
            this.setData({
                publicSelect: !this.data.publicSelect
            });
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
