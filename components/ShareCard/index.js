"use strict";
Component({
    data: {
        showDialog: false
    },
    properties: {
        warning: {
            type: Boolean
        },
        title: {
            type: String,
            value: '分享给好友'
        }
    },
    methods: {
        handleClose: function () {
            if (this.data.warning === true) {
                this.setData({ showDialog: true });
            }
            else {
                this.handleConfirmClose();
            }
        },
        handleCancelClose: function () {
            this.setData({ showDialog: false });
        },
        handleConfirmClose: function () {
            this.triggerEvent('onClose');
        }
    }
});
