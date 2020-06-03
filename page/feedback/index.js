"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
Page({
    data: {
        count: 0
    },
    service: new service_1.default(),
    submitFlag: false,
    feedBackText: '',
    handleFeedBackChange: function (event) {
        var value = event.detail.value;
        this.feedBackText = value;
        this.setData({ count: value.length });
    },
    handleSubmitFeedBack: function () {
        var _this = this;
        var length = this.feedBackText.length;
        if (length < 8 || length > 100) {
            wx.showToast({
                title: '为了更好的为您服务，请至少输入8字以上。',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: '提交中...',
            mask: true
        });
        if (this.submitFlag === false) {
            this.submitFlag = true;
            this.service
                .submitFeedBack(this.feedBackText)
                .then(function () {
                _this.submitFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: '提交成功!'
                });
                setTimeout(function () {
                    wx.navigateTo({ url: '/page/userfeedback/index' });
                }, 1000);
            })
                .catch(function (error) {
                _this.submitFlag = false;
                console.error(error);
                wx.hideLoading();
                wx.showToast({
                    title: "\u63D0\u4EA4\u5931\u8D25!" + error.message,
                    icon: 'none'
                });
            });
        }
    },
    handleGotoUserFeedBack: function () {
        wx.navigateTo({ url: '/page/userfeedback/index' });
    }
});
