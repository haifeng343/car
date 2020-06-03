"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monitor_1 = require("../../utils/monitor");
Component({
    properties: {
        list: {
            type: Array
        },
        dialogTitle: {
            type: String
        },
        dialogText: {
            type: String
        },
        dialogBtn: {
            type: String
        },
        enoughType: {
            type: Number
        }
    },
    data: {
        gzDisplay: 'none',
        plateform: '',
        cityId: {}
    },
    methods: {
        bindConfirm: function () {
            var detail = {
                enoughShow: 'none'
            };
            this.triggerEvent('enoughEvent', detail);
        },
        navigateToPlatform: function (e) {
            var app = getApp();
            var plateform = e.currentTarget.dataset.platform;
            var data = this.properties.enoughType == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
            var num = wx.getStorageSync('gzjumpfirst');
            if (plateform === 'gz') {
                var city = data.cityId.gz ? data.cityId.gz.city_id : '';
                if (!city) {
                    wx.showToast({
                        title: "该城市暂无瓜子车源",
                        icon: "none",
                        duration: 2000
                    });
                }
                else {
                    if (!num) {
                        wx.setStorageSync('gzjumpfirst', 1);
                        this.setData({
                            gzDisplay: 'block',
                            plateform: plateform,
                            cityId: data.cityId
                        });
                    }
                    else {
                        monitor_1.navigateToProgram(plateform, '', data.cityId);
                    }
                }
            }
            if (plateform === 'yx') {
                var city = data.cityId.yx ? data.cityId.yx.cityid : '';
                if (!city) {
                    wx.showToast({
                        title: "该城市暂无优信车源",
                        icon: "none",
                        duration: 2000
                    });
                }
                else {
                    monitor_1.navigateToProgram(plateform, '', data.cityId);
                }
            }
            if (plateform === 'rr') {
                var city = data.cityId.rr ? data.cityId.rr.city : '';
                if (!city) {
                    wx.showToast({
                        title: "该城市暂无人人车源",
                        icon: "none",
                        duration: 2000
                    });
                }
                else {
                    monitor_1.navigateToProgram(plateform, '', data.cityId);
                }
            }
        },
        getJumpCancel: function () {
            this.setData({ gzDisplay: 'none' });
        },
        getJumpConfirm: function () {
            this.setData({ gzDisplay: 'none' });
            monitor_1.navigateToProgram(this.data.plateform, '', this.data.cityId);
        },
        stopEvent: function () { },
        preventTouchMove: function () { }
    }
});
