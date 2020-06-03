"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var RegExpMap = {
    mobile: /^1[34578]\d{9}$/
};
Page({
    data: {
        countDown: 0
    },
    service: new service_1.default(),
    submitFlag: false,
    timer: 0,
    mobile: '',
    code: '',
    startCountDown: function () {
        var _this = this;
        this.setData({ countDown: 60 }, function () {
            _this.timer = setInterval(function () {
                if (_this.data.countDown > 0) {
                    _this.setData({ countDown: _this.data.countDown - 1 });
                }
                else {
                    _this.stopCountDown();
                }
            }, 1000);
        });
    },
    stopCountDown: function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    handleMobileChange: function (event) {
        this.mobile = event.detail.value;
    },
    handleCodeChange: function (event) {
        this.code = event.detail.value;
    },
    handleGetCode: function () {
        var _this = this;
        if (this.mobile.length !== 11 || !RegExpMap.mobile.test(this.mobile)) {
            wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' });
            return;
        }
        if (this.submitFlag === false && this.data.countDown === 0) {
            this.submitFlag = true;
            wx.showLoading({
                title: '获取验证码...',
                mask: true
            });
            this.service
                .getCode(this.mobile)
                .then(function () {
                _this.submitFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: '验证码已发送',
                    icon: 'none'
                });
                _this.startCountDown();
            })
                .catch(function (error) {
                _this.submitFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: "\u83B7\u53D6\u9A8C\u8BC1\u7801\u5931\u8D25!" + error.message,
                    icon: 'none'
                });
            });
        }
    },
    handleBindMoblie: function () {
        var _this = this;
        if (this.mobile.length !== 11 || !RegExpMap.mobile.test(this.mobile)) {
            wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' });
            return;
        }
        if (this.code.length !== 6) {
            wx.showToast({ title: '请填写验证码!', icon: 'none' });
            return;
        }
        if (this.submitFlag === false) {
            this.submitFlag = true;
            wx.showLoading({
                title: '绑定手机号...',
                mask: true
            });
            this.service
                .bindMoblie(this.mobile, this.code)
                .then(function () {
                var app = getApp();
                app.globalData.isUserBindPhone = true;
                _this.submitFlag = false;
                wx.showToast({
                    title: '绑定手机号成功!'
                });
                setTimeout(function () {
                    wx.navigateBack({ delta: 1 });
                }, 1000);
            })
                .catch(function (error) {
                _this.submitFlag = false;
                wx.showToast({
                    title: "\u624B\u673A\u53F7\u7801\u7ED1\u5B9A\u5931\u8D25!" + error.message,
                    icon: 'none'
                });
            });
        }
    }
});
