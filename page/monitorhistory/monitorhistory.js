"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var data_1 = require("./data");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    submitFlag: false,
    targetMonitorId: -1,
    onLoad: function () {
        this.getCarHistory();
    },
    getCarHistory: function () {
        var _this = this;
        this.service
            .getMonitorCarList()
            .then(function (monitorList) {
            wx.hideLoading();
            _this.setData({ isLoaded: true, monitorList: monitorList });
        })
            .catch(function (error) {
            _this.setData({ isLoaded: false, monitorList: [] });
            console.error(error);
            wx.hideLoading();
            wx.showToast({
                title: "\u83B7\u53D6\u5386\u53F2\u76D1\u63A7\u6570\u636E\u5931\u8D25!" + error.message,
                icon: 'none'
            });
        });
    },
    getmonitorEndEvent: function (e) {
        this.setData({
            monitorEndDisplay: e.detail.value,
        });
    },
    handleFundTypeChange: function (event) {
        var _this = this;
        var fundListType = +event.currentTarget.dataset.value;
        if (this.data.fundListType !== fundListType) {
            wx.showLoading({
                title: '获取历史数据...',
                mask: true
            });
            this.setData({
                fundListType: fundListType,
                isLoaded: false,
                monitorList: [],
            }, function () {
                _this.getCarHistory();
            });
        }
    },
    handleRemove: function (event) {
        var monitorId = event.detail;
        this.targetMonitorId = monitorId;
        this.setData({
            monitorEndDisplay: 'block'
        });
    },
    getmonitorEndConfirmEvent: function () {
        this.handleDialogConfirm();
    },
    handleDialogClose: function () {
        var showDialog = false;
        this.setData({ showDialog: showDialog });
    },
    handleDialogConfirm: function () {
        var _this = this;
        if (this.submitFlag === false) {
            this.submitFlag = true;
            wx.showLoading({
                title: '请稍候...',
                mask: true
            });
            this.service
                .removeCarHistoryMonitor(this.targetMonitorId)
                .then(function (monitorList) {
                wx.hideLoading();
                _this.submitFlag = false;
                _this.setData({ monitorList: monitorList, monitorEndDisplay: 'none' });
                wx.showToast({ title: '操作成功!' });
            })
                .catch(function (error) {
                wx.hideLoading();
                _this.submitFlag = false;
                wx.showToast({
                    title: "\u7ED3\u675F\u76D1\u63A7\u5931\u8D25!" + error.message,
                    icon: 'none'
                });
            });
        }
    }
});
