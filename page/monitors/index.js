"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var data_1 = require("./data");
var monitor = require("../../utils/monitor.js");
var app = getApp();
Page({
    data: new data_1.default(),
    homeServise: new service_1.default(),
    onShow: function () {
        var token = wx.getStorageSync('token');
        if (token) {
            this.setData({
                data: []
            });
            this.getLongMonitorData();
            this.getUserInfo();
        }
        else {
            this.setData({
                show: 0
            });
        }
    },
    getLongMonitorData: function () {
        var _this = this;
        var data = {};
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        this.homeServise.getMonitorCarList(data).then(function (res) {
            wx.hideLoading();
            if (res.data.length) {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].dayNum = monitor.setDay(res.data[i].monitorTime);
                    res.data[i].hourNum = monitor.setHour(res.data[i].monitorTime);
                    res.data[i].index = i;
                    res.data[i].longRentType = res.data[i].rentType;
                    res.data[i].rentType = 2;
                }
                _this.setData({
                    data: res.data,
                    show: 1
                });
            }
            else {
                _this.setData({
                    show: 0
                });
            }
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    getUserInfo: function () {
        var _this = this;
        var data = {};
        this.homeServise.userInfo(data).then(function (res) {
            _this.setData({
                ddCoin: res.data.coinAccount.useCoin,
            });
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    delItem: function (e) {
        var item = this.data.data[e.detail.index];
        var deleteItem = {
            startTimeName: item.startTime ? monitor.startTimeName(item.startTime) : '',
            createTime: monitor.startTimeName(item.createTime),
            taskTime: monitor.taskTime(item.monitorTime, item.minutes),
            fee: item.fee,
            totalFee: item.totalFee || 0,
            id: item.id
        };
        if (!item.startTime && (item.status == 12 || item.status == 0)) {
            this.setData({
                monitorEndDisplay: 'block',
                deleteItem: deleteItem
            });
        }
        else {
            this.setData({
                monitorStopDisplay: 'block',
                deleteItem: deleteItem
            });
        }
    },
    getmonitorStopEvent: function (e) {
        this.setData({
            monitorStopDisplay: e.detail.value,
        });
    },
    getmonitorConfirmEvent: function (e) {
        var _this = this;
        var data = {
            monitorId: this.data.deleteItem.id
        };
        this.homeServise.endCarMonitor(data).then(function (res) {
            if (res.success) {
                wx.showToast({
                    title: res.resultMsg,
                    icon: 'success',
                    duration: 2000
                });
                _this.setData({
                    monitorStopDisplay: e.detail.value,
                    data: []
                });
                _this.getLongMonitorData();
            }
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    getmonitorEndEvent: function (e) {
        this.setData({
            monitorEndDisplay: e.detail.value,
        });
    },
    getmonitorEndConfirmEvent: function (e) {
        var _this = this;
        var data = {
            monitorId: this.data.deleteItem.id
        };
        this.homeServise.endCarMonitor(data).then(function (res) {
            if (res.success) {
                wx.showToast({
                    title: res.resultMsg,
                    icon: 'success',
                    duration: 2000
                });
                _this.setData({
                    monitorEndDisplay: e.detail.value,
                    data: []
                });
                _this.getLongMonitorData();
            }
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    recharge: function (e) {
        var type = e.detail.type;
        wx.navigateTo({
            url: '/page/deposit/deposit?type=' + type
        });
    },
    getmonitorStartEvent: function (e) {
        this.setData({
            monitorStartDisplay: e.detail.value,
        });
    },
    getmonitorStartConfirmEvent: function (e) {
        this.setData({
            monitorStartDisplay: e.detail.value,
        });
        this.getMonitorStart();
    },
    getMonitorStart: function () {
        var _this = this;
        var data = {
            monitorId: this.data.startItem.id
        };
        wx.showLoading({
            title: '正在开启监控...',
            mask: true
        });
        this.homeServise.startCarMonitor(data).then(function (res) {
            wx.hideLoading();
            if (res.success) {
                wx.showToast({
                    title: res.resultMsg,
                    icon: 'success',
                    duration: 2000
                });
                _this.getLongMonitorData();
            }
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    openTask: function (e) {
        var item = this.data.data[e.detail.index];
        this.setData({
            monitorStartDisplay: 'block',
            startItem: item
        });
    },
    goToClick: function (e) {
        var type = e.detail.type;
        var item = this.data.data[e.detail.index];
        if (item.status == 12) {
            this.delItem(e);
        }
        if ((item.status == 11 || item.status == 0) && this.data.ddCoin < item.fee) {
            wx.navigateTo({
                url: '/page/deposit/deposit?type=' + type
            });
        }
        if ((item.status == 11 || item.status == 0) && this.data.ddCoin >= item.fee) {
            this.openTask(e);
        }
    },
    checkDetail: function (e) {
        var item = this.data.data[e.detail.index];
        app.globalData.monitorSearchData = {
            city: "",
            cityId: {},
            brandName: "",
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
            autoType: 0,
            gearbox: 0,
            drive: 0,
            minAge: 0,
            maxAge: 6,
            minMileage: 0,
            maxMileage: 14,
            minDisplacement: 0,
            maxDisplacement: 4,
            fuelType: 0,
            emission: 0,
            countryType: 0,
            carColor: 0,
            starConfig: [],
            sortType: 0
        };
        app.globalData.monitorDefaultSearchData = {
            city: "",
            cityId: {},
            brandName: "",
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
            autoType: 0,
            gearbox: 0,
            drive: 0,
            minAge: 0,
            maxAge: 6,
            minMileage: 0,
            maxMileage: 14,
            minDisplacement: 0,
            maxDisplacement: 4,
            fuelType: 0,
            emission: 0,
            countryType: 0,
            carColor: 0,
            starConfig: [],
            sortType: 0
        };
        wx.navigateTo({
            url: '../monitorCarList/monitorCarList?monitorId=' + item.id,
        });
    },
    handleGoToRule: function () {
        wx.navigateTo({
            url: '../monitorRule/index',
        });
    }
});
