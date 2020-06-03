"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var car_1 = require("../../utils/car");
var monitor_1 = require("../../utils/monitor");
var service_1 = require("./service");
var data_1 = require("./data");
var app = getApp();
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    onLoad: function () {
        var data = app.globalData.usedCarListData;
        console.log(data);
        if (data.enoughList) {
            for (var i = 0; i < data.enoughList.length; i++) {
                if (data.enoughList[i].key == 'yx') {
                    if (data.yxlowPriceData) {
                        data.enoughList[i]['firstPayText'] = data.yxlowPriceData.firstPayText;
                        data.enoughList[i]['priceText'] = data.yxlowPriceData.priceText;
                        data.enoughList[i]['selectCount'] = data.yxSelectCount;
                    }
                }
                if (data.enoughList[i].key == 'gz') {
                    if (data.gzlowPriceData) {
                        data.enoughList[i]['firstPayText'] = data.gzlowPriceData.firstPayText;
                        data.enoughList[i]['priceText'] = data.gzlowPriceData.priceText;
                        data.enoughList[i]['selectCount'] = data.gzSelectCount;
                    }
                }
                if (data.enoughList[i].key == 'rr') {
                    if (data.rrlowPriceData) {
                        data.enoughList[i]['firstPayText'] = data.rrlowPriceData.firstPayText;
                        data.enoughList[i]['priceText'] = data.rrlowPriceData.priceText;
                        data.enoughList[i]['selectCount'] = data.rrSelectCount;
                    }
                }
            }
        }
        this.setData({
            allCount: data.allCount,
            gzCount: data.gzCount,
            yxCount: data.yxCount,
            rrCount: data.rrCount,
            showCount: data.showCount,
            averagePrice: data.averagePrice,
            firstlowPriceData: data.firstlowPriceData,
            lowPriceData: data.lowPriceData,
            lowPrice: data.lowPrice,
            enoughList: data.enoughList,
            monitorId: data.monitorId || '',
            totalFee: data.totalFee || '',
            taskTime: data.taskTime || '',
            startTimeName: data.startTimeName || '',
            allOriginalData: data.allOriginalData,
            ddCoin: data.ddCoin || 0,
            bindPhone: data.bindPhone || false,
            bindPublic: data.bindPublic || false,
            sourceData: data.sourceData,
            sortType: data.sortType || 0,
            fee: wx.getStorageSync('hourMoney'),
            bottomType: data.bottomType || 0,
            cardType: data.bottomType == 4 ? 1 : 2,
        });
    },
    onShow: function () {
        this.getUserInfo();
    },
    getUserInfo: function () {
        var _this = this;
        this.service.userInfo().then(function (res) {
            _this.setData({
                ddCoin: res.data.coinAccount.useCoin,
                bindPhone: res.data.phone,
                bindPublic: res.data.public
            });
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
        this.service.getHourMoney().then(function (res) {
            _this.setData({
                fee: res.data.cddHourMoney || 1
            });
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    startMonitor: function () {
        var count = this.data.allCount;
        if (count >= 50) {
            this.setData({
                monitorenoughDisplay: 'block',
                dialogTitle: '车源充足',
                dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
                dialogBtn: '知道了',
            });
        }
        else {
            var app_1 = getApp();
            if (!this.data.bindPhone && !app_1.globalData.isUserBindPhone) {
                wx.navigateTo({
                    url: '/page/bindPhone/bindPhone'
                });
                return;
            }
            this.setData({
                monitorShow: 'block',
                monitorTitle: '车源监控确认',
            });
        }
    },
    getMonitorEvent: function (e) {
        this.setData({
            monitorShow: e.detail.monitorShow,
        });
    },
    getmonitorConfirmEvent: function (e) {
        var app = getApp();
        if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
            wx.navigateTo({
                url: "../bindPhone/bindPhone"
            });
            return;
        }
        this.setData({
            monitorDisplay: e.detail.monitorShow
        });
        this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
    },
    getMonitorPublicEvent: function (e) {
        this.setData({
            monitorShow: 'none',
            publicDisplay: e.detail
        });
    },
    getPublicEvent: function (e) {
        this.setData({
            publicDisplay: e.detail.publicShow,
            monitorShow: 'block'
        });
    },
    getPublicConfrimEvent: function (e) {
        this.setData({
            publicDisplay: e.detail.publicShow,
        });
    },
    getStartMonitor: function (noteSelect, publicSelect) {
        console.log(noteSelect);
        console.log(publicSelect);
        var data = {
            noteSelect: noteSelect,
            publicSelect: publicSelect,
            sourceData: this.data.sourceData,
            allOriginalData: this.data.allOriginalData,
            lowPrice: this.data.lowPrice,
            allCount: this.data.allCount,
            gzCount: this.data.gzCount,
            yxCount: this.data.yxCount,
            rrCount: this.data.rrCount,
        };
        var addParam = monitor_1.jsonForm(car_1.addMonitorParam(data));
        console.log(addParam);
        this.service.addCarMonitor(addParam).then(function (res) {
            wx.hideLoading();
            wx.showToast({
                title: res.resultMsg,
                duration: 2000
            });
            wx.switchTab({
                url: '/page/monitors/index'
            });
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    stopMonitor: function () {
        this.setData({
            stopDisplay: 'block',
        });
    },
    stopCancelEvent: function () {
        console.log(111);
        this.setData({
            stopDisplay: 'none',
        });
    },
    getstopConfirmEventEvent: function (e) {
        var _this = this;
        console.log(this.data);
        var data = {
            monitorId: this.data.monitorId,
        };
        this.service.endCarMonitor(data).then(function (res) {
            if (res.success) {
                wx.showToast({
                    title: res.resultMsg,
                    icon: 'success',
                    duration: 2000
                });
                _this.setData({
                    stopDisplay: e.detail.value,
                });
                wx.navigateBack({
                    delta: 2
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
    goBackEvent: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    goSave: function () {
        var app = getApp();
        var count = this.data.allCount;
        if (count >= 50) {
            this.setData({
                monitorenoughDisplay: 'block',
                dialogTitle: '车源充足',
                dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
                dialogBtn: '知道了'
            });
        }
        else {
            this.setData({
                updateMonitorDisplay: 'block',
                updateData: app.globalData.monitorSearchData,
                defalutData: app.globalData.monitorDefaultSearchData
            });
        }
    },
    getUpdateCancelEvent: function (e) {
        this.setData({
            updateMonitorDisplay: e.detail.updateShow,
        });
    },
    getUpdateConfrimEvent: function (e) {
        this.setData({
            updateMonitorDisplay: e.detail.updateShow,
        });
        this.getUpdateMonitor();
    },
    getUpdateMonitor: function () {
        var data = {
            monitorId: this.data.monitorId,
            sourceData: this.data.sourceData,
            allOriginalData: this.data.allOriginalData,
            lowPrice: this.data.lowPrice,
            allCount: this.data.allCount,
            gzCount: this.data.gzCount,
            yxCount: this.data.yxCount,
            rrCount: this.data.rrCount,
        };
        var addParam = monitor_1.jsonForm(car_1.updateMonitorParam(data));
        wx.showLoading({
            title: '正在修改监控...',
            mask: true
        });
        this.service.updateCarMonitor(addParam).then(function (res) {
            wx.hideLoading();
            wx.showToast({
                title: res.resultMsg,
                duration: 2000
            });
            wx.navigateBack({
                delta: 2
            });
        }).catch(function (error) {
            wx.hideLoading();
            wx.showToast({
                title: error.resultMsg || '你的网络可能开小差了~',
                icon: 'none'
            });
        });
    },
    navigateToPlatform: function (e) {
        var p = e.currentTarget.dataset.platform;
        if (p == 'gz') {
            wx.navigateToMiniProgram({
                appId: 'wx2f40778ca2a8c6b0',
            });
        }
        if (p == 'yx') {
            wx.navigateToMiniProgram({
                appId: 'wx66d9d754ae654ee0',
            });
        }
        if (p == 'rr') {
            wx.navigateToMiniProgram({
                appId: 'wx2d80f009df8d7aaa',
            });
        }
    },
    getEnoughEvent: function () {
        this.setData({
            monitorenoughDisplay: 'none',
        });
    },
});
