"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var data_1 = require("./data");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    requestFlag: false,
    handleSelectExpand: function (event) {
        var expand = event.detail.expand;
        this.setData({ canScroll: expand === false });
    },
    handletimeRangeChange: function (event) {
        var _this = this;
        wx.showLoading({
            title: '获取账单数据...',
            mask: true
        });
        var timeRange = event.detail.value;
        this.setData({ timeRange: timeRange, isLoaded: false, fundList: [] }, function () {
            if (_this.data.fundListType === 1) {
                _this.getFundList();
            }
            else {
                _this.getCoinFundList();
            }
        });
    },
    handlebillTypeChange: function (event) {
        var _this = this;
        wx.showLoading({
            title: '获取账单数据...',
            mask: true
        });
        var billType = event.detail.value;
        this.setData({ billType: billType, isLoaded: false, fundList: [] }, function () {
            if (_this.data.fundListType === 1) {
                _this.getFundList();
            }
            else {
                _this.getCoinFundList();
            }
        });
    },
    handleFundTypeChange: function (event) {
        var _this = this;
        var fundListType = +event.currentTarget.dataset.value;
        if (this.data.fundListType !== fundListType) {
            wx.showLoading({
                title: '获取账单数据...',
                mask: true
            });
            this.setData({
                fundListType: fundListType,
                isLoaded: false,
                fundList: [],
                billType: 0,
                timeRange: fundListType === 1 ? 1 : 0
            }, function () {
                if (fundListType === 1) {
                    _this.getFundList();
                }
                else {
                    _this.getCoinFundList();
                }
            });
        }
    },
    handleGotoFundDetail: function (event) {
        var app = getApp();
        app.fundData = event.detail;
        wx.navigateTo({ url: '/page/funddetail/index' });
    },
    getFundList: function () {
        var _this = this;
        this.service
            .getFundList(this.data.timeRange, this.data.billType)
            .then(function (fundList) {
            wx.hideLoading();
            _this.setData({ fundList: fundList, isLoaded: true });
        })
            .catch(function (error) {
            console.error(error);
            wx.hideLoading();
            wx.showToast({
                title: '获取账单数据失败',
                icon: 'none'
            });
        });
    },
    getCoinFundList: function () {
        var _this = this;
        if (this.requestFlag === false) {
            this.requestFlag = true;
            this.service
                .getCoinFundList(this.data.timeRange, this.data.billType)
                .then(function (fundList) {
                _this.requestFlag = false;
                wx.hideLoading();
                _this.setData({ fundList: fundList, isLoaded: true });
            })
                .catch(function (error) {
                console.error(error);
                _this.requestFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: '获取账单数据失败',
                    icon: 'none'
                });
            });
        }
    },
    onLoad: function () {
        wx.showLoading({
            title: '获取账单数据...',
            mask: true
        });
        this.getFundList();
    }
});
