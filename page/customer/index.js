"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("../mine/service");
var wx_1 = require("../../utils/wx");
Page({
    data: {
        wechatid: 'bangdingding01'
    },
    isAuth: false,
    submitFlag: false,
    mineService: new service_1.default(),
    handleSetClipboardData: function () {
        wx.setClipboardData({
            data: this.data.wechatid,
            success: function () {
                wx.showToast({
                    title: '复制成功!'
                });
            },
            fail: function () {
                wx.showToast({
                    title: '复制失败!'
                });
            }
        });
    },
    handleGotoGuide: function () {
        wx.navigateTo({ url: '/page/public/public' });
    },
    gotoFeedBack: function () {
        wx.navigateTo({ url: '/page/feedback/index' });
    },
    handleClickFeedBack: function () {
        if (this.isAuth === true) {
            this.gotoFeedBack();
        }
        else {
            this.setData({ showAuthDialog: true });
        }
    },
    handleGetUserInfo: function (event) {
        var _this = this;
        var userInfo = event.detail.userInfo.detail;
        var iv = userInfo.iv, encryptedData = userInfo.encryptedData;
        if (!iv || !encryptedData) {
            wx.showToast({
                title: '为了更好的使用效果，请同意用户信息授权',
                icon: 'none'
            });
            this.setData({
                showAuthDialog: false
            });
            return;
        }
        if (this.submitFlag === false) {
            this.submitFlag = true;
            wx.showLoading({
                title: '获取授权信息...',
                mask: true
            });
            this.setData({ showAuthDialog: false });
            wx_1.getSessionKey().then(function (sessionKey) {
                var data = {
                    session_key: sessionKey,
                    iv: iv,
                    encryptedData: encryptedData
                };
                _this.auth(data);
            });
        }
    },
    auth: function (data) {
        var _this = this;
        this.mineService
            .auth(data)
            .then(function () {
            _this.submitFlag = false;
            wx.hideLoading();
            wx.showToast({
                title: '登录成功'
            });
            _this.gotoFeedBack();
        })
            .catch(function (error) {
            console.error(error);
            _this.submitFlag = false;
            wx.hideLoading();
            wx.showToast({
                title: '登录失败，请稍后重试',
                icon: 'none'
            });
        });
    },
    handleCloseAuthDialog: function () {
        wx.showToast({
            title: '为了更好的使用效果，请同意用户信息授权',
            icon: 'none'
        });
        this.setData({
            showAuthDialog: false
        });
    },
    onLoad: function () {
        var app = getApp();
        var isAuth = app.globalData.isAuth;
        this.isAuth = isAuth;
    }
});
