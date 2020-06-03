"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var getUsedCarData_1 = require("../../api/getUsedCarData");
var car_1 = require("../../utils/car");
var util_1 = require("../../utils/util");
var monitor_1 = require("../../utils/monitor");
var data_1 = require("./data");
var service_1 = require("./service");
var transformFilter_1 = require("../../utils/transformFilter");
var searchDataStream_1 = require("../../utils/searchDataStream");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    onLoad: function () {
        var _this = this;
        var app = getApp();
        this.service.serchDataSubscription = searchDataStream_1.SearchDataSubject.subscribe(function (next) {
            if (next) {
                var arr = Object.keys(next);
                if (arr.length) {
                    var searchData = app.globalData.searchData;
                    app.globalData.searchData = Object.assign(searchData, next);
                    if (arr.indexOf('sortType') > -1) {
                        if (next.sortType === 1 || next.sortType === 0) {
                            app.globalData.searchData = Object.assign(searchData, { 'advSort': next.sortType });
                        }
                        if (next.sortType === 2) {
                            app.globalData.searchData = Object.assign(searchData, { 'advSort': 3 });
                        }
                        if (next.sortType === 3) {
                            app.globalData.searchData = Object.assign(searchData, { 'advSort': 2 });
                        }
                    }
                    _this.setData({
                        loadingDisplay: 'block',
                        dataFlag: 0,
                        allData: [],
                        editFlag: false,
                        selectAllFlag: false
                    });
                    _this.onCarLoad();
                }
            }
        });
        this.onCarLoad();
    },
    onShow: function () {
        this.getUserInfo();
    },
    onUnload: function () {
        if (this.service.serchDataSubscription) {
            this.service.serchDataSubscription.unsubscribe();
        }
    },
    onCarLoad: function () {
        var app = getApp();
        var x = app.globalData.searchData;
        this.setData({
            updateData: Object.assign({}, x)
        });
        this.getUsedCarData();
        this.getIndexData();
    },
    submit: function (e) {
        var app = getApp();
        var allArr = __spreadArrays(this.data.allOriginalData);
        var arr = Object.keys(e.detail);
        console.log(e.detail);
        if (arr.length) {
            if (arr.length == 1 && arr[0] == 'advSort') {
                app.globalData.searchData['advSort'] = e.detail['advSort'];
                this.setData({
                    loadingDisplay: 'block',
                    allData: []
                });
                if (e.detail['advSort'] === 1) {
                    allArr.sort(util_1.compareSort('price', 'asc'));
                }
                if (e.detail['advSort'] === 11) {
                    allArr.sort(util_1.compareSort('price', 'desc'));
                }
                if (e.detail['advSort'] === 2) {
                    allArr.sort(util_1.compareSort('licensedDate', 'desc'));
                }
                if (e.detail['advSort'] === 3) {
                    allArr.sort(util_1.compareSort('mileage', 'asc'));
                }
                if (e.detail['advSort'] === 4) {
                    allArr.sort(util_1.compareSort('firstPay', 'asc'));
                }
                this.setData({
                    loadingDisplay: 'none',
                    allOriginalData: allArr,
                    allData: allArr.slice(0, 5),
                    updateData: Object.assign({}, app.globalData.searchData)
                });
            }
            else {
                var searchData = app.globalData.searchData;
                app.globalData.searchData = Object.assign(searchData, e.detail);
                this.setData({
                    loadingDisplay: 'block',
                    dataFlag: 0,
                    allData: [],
                    editFlag: false,
                    selectAllFlag: false
                });
                searchDataStream_1.SearchDataObject.next(true);
                this.onLoad();
            }
        }
    },
    getUserInfo: function () {
        var _this = this;
        this.service.userInfo().then(function (res) {
            _this.setData({
                ddCoin: res.data.coinAccount.useCoin,
                bindPhone: res.data.phone,
                bindPublic: res.data.public
            });
        });
    },
    getIndexData: function () {
        var _this = this;
        this.service.indexParam().then(function (res) {
            var cddHourMoney = res.data.cddHourMoney || '1';
            wx.setStorageSync('hourMoney', cddHourMoney);
            _this.setData({
                fee: res.data.cddHourMoney
            });
        });
    },
    onReachBottom: function () {
        var _this = this;
        console.log('到底了');
        if (this.data.allData < this.data.allOriginalData) {
            this.setData({
                loadingShow: true
            });
            var timers_1 = setTimeout(function () {
                _this.addDataToArray();
                clearTimeout(timers_1);
            }, 500);
        }
        else {
            this.setData({
                loadingShow: false
            });
            if (this.data.allCount > 50) {
                if (!this.data.enoughBottom) {
                    this.setData({
                        monitorenoughDisplay: 'block',
                        dialogTitle: '哎呀，到底了',
                        dialogText: '您已查看全部车源，更多车源可前往各平台查看。',
                        dialogBtn: '取消',
                        enoughBottom: true
                    });
                }
                else {
                    wx.showToast({
                        title: '到底了',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
            if (this.data.allCount <= 50) {
                if (!this.data.monitorBottom) {
                    this.setData({
                        monitorDisplay: 'block',
                        monitorTitle: '到底了!你可以开启监控',
                        monitorBottom: true
                    });
                }
                else {
                    wx.showToast({
                        title: '到底了',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        }
    },
    addDataToArray: function () {
        if (this.data.allData.length < this.data.allOriginalData.length) {
            var a = [];
            var index = this.data.allData.length;
            var addArr = this.data.allOriginalData.slice(index, index + 5);
            var newArr = a.concat(this.data.allData).concat(addArr);
            this.setData({
                allData: newArr,
                loadingShow: false
            });
        }
    },
    getUsedCarData: function () {
        var _this = this;
        var app = getApp();
        var searchData = app.globalData.searchData;
        var enoughList = [];
        Promise.all([
            getUsedCarData_1.getGuaZiCarData(1, transformFilter_1.default.transformFilter(searchData, 'gz')),
            getUsedCarData_1.getYouxinCarData(1, transformFilter_1.default.transformFilter(searchData, 'yx')),
            getUsedCarData_1.getRenRenCarData(1, transformFilter_1.default.transformFilter(searchData, 'rr'))
        ].map(function (promiseItem) {
            return promiseItem.catch(function (err) {
                return err;
            });
        }))
            .then(function (res) {
            var r0 = res[0];
            var r1 = res[1];
            var r2 = res[2];
            if ([r0, r1, r2].filter(function (item) { return item.code && (item.code === -100 || item.code === -200); }).length === 3) {
                _this.setData({
                    loadingDisplay: 'none',
                    dataFlag: 3
                });
            }
            else if ([r0, r1, r2].filter(function (item) { return item.code && item.code === -101; }).length === 3) {
                _this.setData({
                    loadingDisplay: 'none',
                    dataFlag: 2,
                    allCount: 0,
                    allOriginalData: [],
                    allData: [],
                    gzFilterData: [],
                    yxFilterData: [],
                    rrFilterData: [],
                    sourceData: [],
                    gzCount: -1,
                    yxCount: -1,
                    rrCount: -1,
                    averagePrice: 0,
                    lowPrice: 0,
                    lowPriceData: null,
                    gzlowPriceData: null,
                    yxlowPriceData: null,
                    rrlowPriceData: null,
                    firstlowPriceData: null,
                    sortType: searchData.sortType
                });
            }
            else {
                if (r0 && r0.data) {
                    enoughList.push({
                        key: 'gz',
                        name: '瓜子',
                        value: r0.count
                    });
                }
                if (r1 && r1.data) {
                    enoughList.push({
                        key: 'yx',
                        name: '优信',
                        value: r1.count
                    });
                }
                if (r2 && r2.data) {
                    enoughList.push({
                        key: 'rr',
                        name: '人人',
                        value: r2.count
                    });
                }
                enoughList.sort(util_1.compareSort('value', 'desc'));
                if (r0 && r0.code < 0) {
                    enoughList.push({ key: 'gz', name: '瓜子', value: -1 });
                }
                if (r1 && r1.code < 0) {
                    enoughList.push({ key: 'yx', name: '优信', value: -1 });
                }
                if (r2 && r2.code < 0) {
                    enoughList.push({ key: 'rr', name: '人人', value: -1 });
                }
                var carData = car_1.getUsedCardAllData({
                    gzCount: (r0 && r0.count) || -1,
                    gzData: (r0 && r0.data) || [],
                    yxCount: (r1 && r1.count) || -1,
                    yxData: (r1 && r1.data) || [],
                    rrCount: (r2 && r2.count) || -1,
                    rrData: (r2 && r2.data) || [],
                    type: 1
                });
                if (carData.allCount && carData.allCount > 0 && carData.filterData.length > 0) {
                    _this.setData({
                        dataFlag: 1,
                    });
                }
                else {
                    _this.setData({
                        dataFlag: 2,
                    });
                }
                _this.setData({
                    loadingDisplay: 'none',
                    allCount: carData.allCount,
                    allOriginalData: carData.filterData,
                    allData: carData.filterData.slice(0, 5),
                    gzFilterData: carData.gzFilterData,
                    yxFilterData: carData.yxFilterData,
                    rrFilterData: carData.rrFilterData,
                    sourceData: carData.sourceData,
                    averagePrice: carData.averagePrice,
                    lowPrice: carData.lowPrice,
                    lowPriceData: carData.lowPriceData ? carData.lowPriceData : null,
                    gzlowPriceData: carData.gzlowPriceData ? carData.gzlowPriceData : null,
                    yxlowPriceData: carData.yxlowPriceData ? carData.yxlowPriceData : null,
                    rrlowPriceData: carData.rrlowPriceData ? carData.rrlowPriceData : null,
                    firstlowPriceData: carData.firstlowPriceData ? carData.firstlowPriceData : null,
                    enoughList: enoughList,
                    gzCount: carData.gzCount,
                    yxCount: carData.yxCount,
                    rrCount: carData.rrCount,
                    sortType: searchData.sortType
                });
            }
        })
            .catch(function (res) {
            console.log(res);
            _this.setData({
                loadingDisplay: 'none',
                dataFlag: 3
            });
        });
    },
    startMonitor: function () {
        var count = this.data.allCount;
        var app = getApp();
        if (count > 50) {
            this.setData({
                monitorenoughDisplay: 'block',
                dialogTitle: '车源充足',
                dialogText: '已帮您甄选' +
                    this.data.allOriginalData.length +
                    '辆车源，若想查看更多车源，请点击前往各平台查看',
                dialogBtn: '知道了'
            });
        }
        else {
            if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
                wx.navigateTo({
                    url: '../bindPhone/bindPhone'
                });
                return;
            }
            this.setData({
                monitorDisplay: 'block',
                monitorTitle: '车源监控确认'
            });
        }
    },
    getMonitorEvent: function (e) {
        this.setData({
            monitorDisplay: e.detail.monitorShow
        });
    },
    getmonitorConfirmEvent: function (e) {
        var app = getApp();
        if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
            wx.navigateTo({
                url: '../bindPhone/bindPhone'
            });
            return;
        }
        this.setData({
            monitorDisplay: e.detail.monitorShow
        });
        this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
    },
    getStartMonitor: function (noteSelect, publicSelect) {
        var data = {
            noteSelect: noteSelect,
            publicSelect: publicSelect,
            sourceData: this.data.sourceData,
            allOriginalData: this.data.allOriginalData,
            lowPrice: this.data.lowPrice,
            allCount: this.data.allCount,
            gzCount: this.data.gzCount,
            yxCount: this.data.yxCount,
            rrCount: this.data.rrCount
        };
        var addParam = monitor_1.jsonForm(car_1.addMonitorParam(data));
        wx.showLoading({
            title: '正在添加监控...',
            mask: true
        });
        this.service
            .addMonitor(addParam)
            .then(function (res) {
            wx.hideLoading();
            wx.showToast({
                title: res.resultMsg,
                duration: 2000,
                icon: 'none'
            });
            wx.switchTab({
                url: '/page/monitors/index'
            });
        })
            .catch(function (error) {
            wx.showToast({
                title: error.message || error.resultMsg,
                duration: 2000,
                icon: 'none'
            });
        });
    },
    getMonitorPublicEvent: function (e) {
        this.setData({
            monitorDisplay: e.detail.monitorShow,
            publicDisplay: e.detail.publicShow
        });
    },
    getPublicEvent: function (e) {
        this.setData({
            monitorDisplay: 'block',
            publicDisplay: e.detail.publicShow
        });
    },
    getPublicConfrimEvent: function (e) {
        this.setData({
            publicDisplay: e.detail.publicShow
        });
    },
    getEnoughEvent: function (e) {
        this.setData({
            monitorenoughDisplay: e.detail.enoughShow
        });
    },
    goToDetail: function () {
        var app = getApp();
        app.globalData.usedCarListData = {
            allCount: this.data.allCount,
            gzCount: this.data.gzCount,
            yxCount: this.data.yxCount,
            rrCount: this.data.rrCount,
            showCount: this.data.allOriginalData.length,
            averagePrice: this.data.averagePrice,
            lowPrice: this.data.lowPrice,
            lowPriceData: this.data.lowPriceData,
            gzlowPriceData: this.data.gzlowPriceData,
            yxlowPriceData: this.data.yxlowPriceData,
            rrlowPriceData: this.data.rrlowPriceData,
            firstlowPriceData: this.data.firstlowPriceData,
            enoughList: this.data.enoughList,
            ddCoin: this.data.ddCoin,
            bindPhone: this.data.bindPhone,
            bindPublic: this.data.bindPublic,
            bottomType: 4,
            sortType: this.data.sortType,
            allOriginalData: this.data.allOriginalData,
            sourceData: this.data.sourceData,
            gzSelectCount: this.data.gzCount > -1 ? this.data.gzFilterData.length : -1,
            yxSelectCount: this.data.yxCount > -1 ? this.data.yxFilterData.length : -1,
            rrSelectCount: this.data.rrCount > -1 ? this.data.rrFilterData.length : -1
        };
        wx.navigateTo({
            url: '../statistics/statistics'
        });
    },
    navtoMonitorRule: function () {
        wx.navigateTo({
            url: '../monitorRule/index'
        });
    },
    goRefresh: function () {
        this.setData({
            loadingDisplay: 'block',
            dataFlag: 0,
            allData: []
        });
        this.onCarLoad();
    }
});
