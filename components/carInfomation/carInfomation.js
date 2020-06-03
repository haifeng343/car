"use strict";
Component({
    data: {
        showDialog: false
    },
    properties: {},
    methods: {
        closeDialog: function () {
            this.setData({
                showDialog: false
            });
        }
    }
});
