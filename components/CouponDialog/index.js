"use strict";
Component({
    properties: {
        couponList: {
            type: Array,
            value: []
        },
        title: {
            type: String,
            value: ''
        }
    },
    methods: {
        handleClose: function () {
            this.triggerEvent('onClose');
        }
    }
});
