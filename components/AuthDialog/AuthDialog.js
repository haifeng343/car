"use strict";
Component({
    methods: {
        handleGetUserInfo: function (userInfo) {
            this.triggerEvent('onConfirm', { userInfo: userInfo });
        },
        handleCancel: function () {
            this.triggerEvent('onCancel');
        }
    }
});
