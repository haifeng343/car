"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var data_1 = require("./data");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    submitFlag: false,
    onLoad: function () {
        wx.showLoading({
            title: '',
            mask: true
        });
        this.getCouponList().then(function () {
            wx.hideLoading();
        });
    },
    getCouponList: function () {
        var _this = this;
        return this.service
            .getData(this.data.currentTabValue)
            .then(function (resp) {
            var couponList = resp.couponList, tabList = resp.tabList;
            _this.setData({ isLoaded: true, couponList: couponList });
            if (tabList) {
                _this.setData({ tabList: tabList, currentTabValue: 1 });
            }
        })
            .catch(function (error) {
            console.error(error);
            wx.hideLoading();
            wx.showToast({
                title: "\u83B7\u53D6\u5361\u5238\u6570\u636E\u5931\u8D25!\u8BF7\u8054\u7CFB\u5BA2\u670D!" + error.message,
                icon: 'none'
            });
        });
    },
    handleTabChange: function (event) {
        var _this = this;
        var tabValue = event.currentTarget.dataset.value;
        if (tabValue === this.data.currentTabValue) {
            return;
        }
        this.setData({ currentTabValue: tabValue, isLoaded: false, couponList: [] }, function () {
            wx.showLoading({
                title: '',
                mask: true
            });
            _this.getCouponList().then(function () {
                wx.hideLoading();
            });
        });
    },
    handleUseCoupon: function (event) {
        var _this = this;
        var item = event.currentTarget.dataset.item;
        if (item.type === 3) {
            if (this.submitFlag === false) {
                this.submitFlag = true;
                wx.showLoading({
                    title: '',
                    mask: true
                });
                this.service
                    .exchangeCoupon(item.id)
                    .then(function (_) {
                    _this.submitFlag = false;
                    wx.hideLoading();
                    wx.showToast({
                        title: "\u6210\u529F\u5151\u6362" + item.day + "\u76EF\u76EF\u5E01!",
                        icon: 'none'
                    });
                    _this.getCouponList();
                })
                    .catch(function (error) {
                    console.error(error);
                    _this.submitFlag = false;
                    wx.hideLoading();
                    wx.showToast({
                        title: "\u5151\u6362\u76EF\u76EF\u5E01\u5931\u8D25!\u8BF7\u8054\u7CFB\u5BA2\u670D!" + error.message,
                        icon: 'none'
                    });
                });
            }
        }
        else {
            this.setData({ showActionDialog: true });
        }
    },
    handleActionCancel: function () {
        this.setData({ showActionDialog: false });
    },
    handleActionConfirm: function () {
        this.setData({ showActionDialog: false });
        wx.navigateToMiniProgram({
            appId: 'wx11970e278167bf3b',
            path: 'pages/home/index'
        });
    }
});
