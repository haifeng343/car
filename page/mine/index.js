"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../../utils/auth");
var wx_1 = require("../../utils/wx");
var service_1 = require("./service");
var data_1 = require("./data");
var app = getApp();
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    action: '',
    submitFlag: false,
    shareFlag: false,
    isFirstShare: false,
    depositType: '',
    checkFirstShare: function () {
        var _this = this;
        return this.service.checkFirstShare().then(function (resp) {
            var isFirstShare = resp.isFirstShare;
            _this.isFirstShare = isFirstShare;
            _this.setData({
                shareDesc: isFirstShare ? '可获得兑换券' : ''
            });
        });
    },
    getUserInfo: function () {
        var _this = this;
        return this.service
            .getUserInfo()
            .then(function (userInfo) {
            _this.setData(userInfo);
            if (_this.action) {
                _this.handleAction();
                _this.action = '';
            }
        })
            .catch(function (error) {
            wx.showToast({
                title: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25!" + error.message,
                icon: 'none'
            });
        });
    },
    getCouponCount: function () {
        var _this = this;
        return this.service.getCouponCount().then(function (couponCount) {
            if (couponCount > 0) {
                _this.setData({ couponDesc: couponCount + "\u5F20\u5151\u6362\u5238\u53EF\u7528" });
            }
            else {
                _this.setData({ couponDesc: '' });
            }
        });
    },
    handleClickDeposit: function (event) {
        var type = event.currentTarget.dataset.type;
        this.depositType = type;
    },
    handleGotoDeposit: function (e) {
        if (this.data.isAuth) {
            wx.navigateTo({
                url: '/page/deposit/deposit?type=' + e.currentTarget.dataset.type
            });
        }
        else {
            this.action = 'gotodeposit';
            this.showAuthDialog();
        }
    },
    handleShowTipDialog: function () {
        this.setData({ showTipDialog: true });
    },
    handleCloseTipDialog: function () {
        this.setData({ showTipDialog: false });
    },
    handleGotoCoupon: function () {
        if (this.data.isAuth) {
            wx.navigateTo({
                url: '/page/coupon/coupon'
            });
        }
        else {
            this.action = 'gotocoupon';
            this.showAuthDialog();
        }
    },
    handleGotoHistory: function () {
        if (this.data.isAuth) {
            wx.navigateTo({
                url: '/page/monitorhistory/monitorhistory'
            });
        }
        else {
            this.action = 'gotohistory';
            this.showAuthDialog();
        }
    },
    handleGotoFeedBack: function () {
        if (this.data.isAuth) {
            wx.navigateTo({
                url: '/page/feedback/index'
            });
        }
        else {
            this.action = 'gotofeedback';
            this.showAuthDialog();
        }
    },
    handleGotoFund: function () {
        if (this.data.isAuth) {
            wx.navigateTo({
                url: '/page/fund/fund'
            });
        }
        else {
            this.action = 'gotofund';
            this.showAuthDialog();
        }
    },
    handleAction: function () {
        var action = this.action;
        this.action = '';
        switch (action) {
            case 'gotodeposit':
                this.handleGotoDeposit(action);
                break;
            case 'gotofund':
                this.handleGotoFund();
                break;
            case 'gotohistory':
                this.handleGotoHistory();
                break;
            case 'share':
                this.handleGotoHistory();
                break;
            case 'gotocoupon':
                this.handleGotoCoupon();
                break;
        }
    },
    handleAuth: function () {
        this.action = '';
        this.showAuthDialog();
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
    handleCloseCouponDialog: function () {
        this.setData({ showCouponDialog: false });
    },
    showAuthDialog: function () {
        var _this = this;
        wx.showLoading({
            title: '获取登录授权中',
            mask: true
        });
        wx_1.getSessionKey()
            .then(function () {
            wx.hideLoading();
            _this.setData({ showAuthDialog: true });
        })
            .catch(function () {
            wx.hideLoading();
            wx.showToast({
                title: '获取登录授权失败',
                icon: 'none'
            });
        });
    },
    handleShare: function () {
        this.setData({ showShareCard: true });
    },
    handleCloseShareCard: function () {
        this.setData({ showShareCard: false });
    },
    handleGetUserInfo: function (event) {
        var _this = this;
        var userInfo = event.detail.userInfo.detail;
        var iv = userInfo.iv;
        var encryptedData = userInfo.encryptedData;
        if (!iv || !encryptedData) {
            wx.showToast({
                title: '为了更好的使用效果，请同意用户信息授权',
                icon: 'none'
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
        this.service
            .auth(data)
            .then(function () {
            _this.submitFlag = false;
            wx.hideLoading();
            wx.showToast({
                title: '登录成功'
            });
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
    onShow: function () {
        var _this = this;
        if (this.data.isAuth) {
            this.getCouponCount();
            this.getUserInfo();
            this.checkFirstShare();
        }
        else if (!this.service.authSubscription) {
            this.service.authSubscription = auth_1.authSubject.subscribe(function (isAuth) {
                console.log('Mine Page isAuth Subscription, isAuth = ' + isAuth);
                _this.setData({ isAuth: isAuth });
                if (isAuth) {
                    _this.getCouponCount();
                    _this.getUserInfo();
                    _this.checkFirstShare();
                }
            });
        }
        console.log(this.data);
        if (app.globalData.isUserBindPhone) {
            this.setData({
                IsMobile: true
            });
        }
        if (this.shareFlag === true) {
            this.requestShare();
        }
    },
    onUnload: function () {
        if (this.service.authSubscription) {
            this.service.authSubscription.unsubscribe();
            this.service.authSubscription = null;
        }
    },
    requestShare: function () {
        var _this = this;
        if (this.isFirstShare === false) {
            return;
        }
        wx.showLoading({
            title: '请稍候...',
            mask: true
        });
        this.service
            .requestShare()
            .then(function (couponList) {
            wx.hideLoading();
            _this.isFirstShare = false;
            _this.setData({ shareDesc: '', showCouponDialog: true, couponList: couponList });
        })
            .catch(function (error) {
            console.error(error);
            wx.hideLoading();
            wx.showToast({
                title: error.message,
                icon: 'none'
            });
        });
    },
    gotoBindPhone: function () {
        wx.navigateTo({
            url: '/page/bindPhone/bindPhone'
        });
    },
    onShareAppMessage: function () {
        return {
            title: '实时监控全网二手车信息，低价品牌好车一辆不错过',
            path: 'page/home/index',
            imageUrl: 'https://piaodingding.oss-cn-hangzhou.aliyuncs.com/images/wechat/cdd/share.png'
        };
    }
});
