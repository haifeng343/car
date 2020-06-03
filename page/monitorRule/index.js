"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var service_1 = require("./service");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    onLoad: function () {
        var _this = this;
        this.service.getHourMoney().then(function (res) {
            _this.setData({
                hourMoney: res.data.cddHourMoney,
            });
            wx.setStorageSync('hourMoney', res.data.cddHourMoney || 1);
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
});
