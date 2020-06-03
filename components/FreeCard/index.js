"use strict";
Component({
    properties: {
        data: {
            type: Object,
            value: {}
        }
    },
    data: {
        isLoaded: false
    },
    methods: {
        handleClickContainer: function () {
            this.triggerEvent('onUse');
        }
    },
    lifetimes: {
        ready: function () {
            this.setData({ isLoaded: true });
        }
    }
});
