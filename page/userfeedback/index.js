"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_js_1 = require("./service.js");
Page({
    data: {
        feedbackList: []
    },
    service: new service_js_1.default(),
    submitFlag: false,
    onLoad: function () {
        var _this = this;
        wx.showLoading({
            title: '请稍候...',
            mask: true
        });
        this.service
            .getUserFeedBackList()
            .then(function (feedbackList) {
            wx.hideLoading();
            _this.setData({ feedbackList: feedbackList });
            if (feedbackList.length === 0) {
                wx.showToast({
                    icon: 'none',
                    title: '暂无反馈数据!'
                });
                setTimeout(function () {
                    wx.navigateBack({ delta: 1 });
                }, 1000);
            }
        })
            .catch(function (error) {
            console.error(error);
            wx.hideLoading();
            wx.showToast({
                title: "\u83B7\u53D6\u53CD\u9988\u6570\u636E\u5931\u8D25!" + error.message,
                icon: 'none'
            });
        });
    }
});
