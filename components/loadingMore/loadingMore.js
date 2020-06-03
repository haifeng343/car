"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        extClass: {
            type: String,
            value: ''
        },
        show: {
            type: Boolean,
            value: true,
            observer: function observer(newValue) {
                this.computedStyle(newValue, this.data.animated);
            }
        },
        animated: {
            type: Boolean,
            value: false,
            observer: function observer(newValue) {
                this.computedStyle(this.data.show, newValue);
            }
        },
        duration: {
            type: Number,
            value: 350
        },
        type: {
            type: String,
            value: 'dot-gray'
        },
        tips: {
            type: String,
            value: '加载中'
        }
    },
    data: new data_1.default(),
    methods: {
        computedStyle: function (show, animated) {
            if (!show) {
                if (!animated) {
                    this.setData({
                        displayStyle: 'none'
                    });
                }
                else {
                    this.startAnimation();
                }
            }
            else {
                this.setData({
                    displayStyle: ''
                });
            }
        },
        startAnimation: function () {
            var _this = this;
            setTimeout(function () {
                var data = _this.data;
                var animation = data.animationInstance;
                if (!!animation) {
                    animation.height(0).step();
                    _this.setData({
                        animationData: animation.export()
                    });
                }
            });
        }
    },
    lifetimes: {
        attached: function () {
            var animationInstance = wx.createAnimation({
                duration: this.data.duration,
                timingFunction: 'ease'
            });
            this.setData({ animationInstance: animationInstance });
            this.computedStyle(this.data.show, this.data.animated);
        }
    }
});
