"use strict";
Component({
    data: {
        show: false
    },
    methods: {
        handleClosePanel: function () {
            var _this = this;
            this.setData({ show: false });
            setTimeout(function () {
                _this.triggerEvent('onClose');
            }, 220);
        },
        preventTouchMove: function () { }
    },
    lifetimes: {
        ready: function () {
            this.setData({ show: true });
        }
    }
});
