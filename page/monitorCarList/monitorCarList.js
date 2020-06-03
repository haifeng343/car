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
var transformFilter_1 = require("../../utils/transformFilter");
var searchDataStream_1 = require("../../utils/searchDataStream");
var data_1 = require("./data");
var service_1 = require("./service");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    onLoad: function (options) {
        var _this = this;
        var app = getApp();
        if (options.monitorId) {
            this.setData({
                monitorId: +options.monitorId
            });
            this.service.serchDataSubscription = searchDataStream_1.MonitorSearchDataSubject.subscribe(function (next) {
                if (next) {
                    var arr = Object.keys(next);
                    if (arr.length) {
                        var monitorSearchData = app.globalData.monitorSearchData;
                        app.globalData.monitorSearchData = Object.assign(monitorSearchData, next);
                        if (arr.indexOf('sortType') > -1) {
                            if (next.sortType === 1 || next.sortType === 0) {
                                app.globalData.monitorSearchData = Object.assign(monitorSearchData, { 'advSort': next.sortType });
                            }
                            if (next.sortType === 2) {
                                app.globalData.monitorSearchData = Object.assign(monitorSearchData, { 'advSort': 3 });
                            }
                            if (next.sortType === 3) {
                                app.globalData.monitorSearchData = Object.assign(monitorSearchData, { 'advSort': 2 });
                            }
                        }
                        _this.setData({
                            loadingDisplay: "block",
                            dataFlag: 0,
                            allData: [],
                            editFlag: false,
                            selectAllFlag: false,
                        });
                        if (util_1.objectDiff(app.globalData.monitorSearchData, app.globalData.monitorDefaultSearchData)) {
                            _this.onCarLoad();
                        }
                        else {
                            _this.onCarShow();
                        }
                    }
                }
            });
            this.onCarLoad();
        }
        else {
            this.setData({
                loadingDisplay: 'none',
                dataFlag: 4,
            });
        }
    },
    onUnload: function () {
        if (this.service.serchDataSubscription) {
            this.service.serchDataSubscription.unsubscribe();
        }
    },
    onCarLoad: function () {
        this.getMonitorData(false);
    },
    onCarShow: function () {
        var app = getApp();
        this.setData({
            mSelect: 1,
            updateData: Object.assign({}, app.globalData.monitorSearchData)
        });
        this.getUsedCarData();
    },
    submit: function (e) {
        var app = getApp();
        var allArr = __spreadArrays(this.data.allOriginalData);
        var arr = Object.keys(e.detail);
        if (arr.length) {
            if (arr.length == 1 && arr[0] == 'advSort') {
                app.globalData.monitorSearchData['advSort'] = e.detail['advSort'];
                this.setData({
                    loadingDisplay: "block",
                    allData: [],
                    advSort: e.detail['advSort']
                });
                if (e.detail['advSort'] === 1) {
                    allArr.sort(util_1.compareSort("price", "asc"));
                }
                if (e.detail['advSort'] === 11) {
                    allArr.sort(util_1.compareSort("price", "desc"));
                }
                if (e.detail['advSort'] === 2) {
                    allArr.sort(util_1.compareSort("licensedDate", "desc"));
                }
                if (e.detail['advSort'] === 3) {
                    allArr.sort(util_1.compareSort("mileage", "asc"));
                }
                if (e.detail['advSort'] === 4) {
                    allArr.sort(util_1.compareSort("firstPay", "asc"));
                }
                this.setData({
                    loadingDisplay: "none",
                    allOriginalData: allArr,
                    allData: allArr.slice(0, 5),
                    updateData: Object.assign({}, app.globalData.monitorSearchData)
                });
            }
            else {
                var monitorSearchData = app.globalData.monitorSearchData;
                app.globalData.monitorSearchData = Object.assign(monitorSearchData, e.detail);
                this.setData({
                    loadingDisplay: "block",
                    dataFlag: 0,
                    allData: [],
                    editFlag: false,
                    selectAllFlag: false,
                });
                if (util_1.objectDiff(app.globalData.monitorSearchData, app.globalData.monitorDefaultSearchData)) {
                    this.onCarLoad();
                }
                else {
                    this.onCarShow();
                }
            }
        }
    },
    onReachBottom: function () {
        var _this = this;
        console.log("到底了");
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
            if (this.data.bottomType === 2) {
                if (this.data.allCount > 50) {
                    if (!this.data.enoughBottom) {
                        if (this.data.editFlag) {
                            return;
                        }
                        this.setData({
                            monitorenoughDisplay: 'block',
                            dialogTitle: '哎呀，到底了',
                            dialogText: '已看完筛选出的' + this.data.allOriginalData.length + '辆车源，各平台还有更多车源可供选择, 您可以前往继续查询。',
                            dialogBtn: '取消',
                            enoughBottom: true,
                        });
                    }
                    else {
                        wx.showToast({
                            title: "到底了",
                            icon: "none",
                            duration: 2000
                        });
                    }
                }
                else {
                    wx.showToast({
                        title: "到底了",
                        icon: "none",
                        duration: 2000
                    });
                }
            }
            else {
                wx.showToast({
                    title: "到底了",
                    icon: "none",
                    duration: 2000
                });
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
    onPageScroll: function (e) {
        var _this = this;
        this.setData({
            scrollTop: e.scrollTop,
            scrollIng: true
        });
        var timer = setTimeout(function () {
            if (_this.data.scrollTop === e.scrollTop) {
                _this.setData({
                    scrollTop: e.scrollTop,
                    scrollIng: false
                });
                clearTimeout(timer);
            }
        }, 300);
    },
    getMonitorData: function (detail) {
        var _this = this;
        var app = getApp();
        this.service.getCarDetail(this.data.monitorId).then(function (res) {
            wx.hideLoading();
            var carList = res.data.carList;
            var monitorDetail = res.data.monitorDetail;
            var monitorCount = res.data.monitorCount;
            var relation = JSON.parse(monitorDetail.relationJson || '{}');
            app.globalData.monitorSearchData = {
                city: monitorDetail.cityName,
                cityId: relation.cityId,
                brandName: monitorDetail.brandName,
                brandId: relation.brandId,
                seriesName: monitorDetail.seriesName,
                seriesID: relation.seriesID,
                searchJson: monitorDetail.searchJson,
                relationJson: '',
                minPrice: monitorDetail.minPrice,
                maxPrice: monitorDetail.maxPrice === 9999 ? 50 : monitorDetail.maxPrice,
                autoType: monitorDetail.autoType || 0,
                gearbox: monitorDetail.gearbox || 0,
                drive: monitorDetail.drive || 0,
                minAge: monitorDetail.minAge,
                maxAge: monitorDetail.maxAge === 99 ? 6 : monitorDetail.maxAge,
                minMileage: monitorDetail.minMileage,
                maxMileage: monitorDetail.maxMileage === 9999 ? 14 : monitorDetail.maxMileage,
                minDisplacement: monitorDetail.minDisplacement,
                maxDisplacement: monitorDetail.maxDisplacement === 99 ? 4 : monitorDetail.maxDisplacement,
                fuelType: monitorDetail.fuelType || 0,
                emission: monitorDetail.emission || 0,
                countryType: monitorDetail.countryType || 0,
                carColor: monitorDetail.carColor || 0,
                starConfig: monitorDetail.starConfig ? monitorDetail.starConfig.split(',').map(function (item) { return +item; }) : [],
                sortType: monitorDetail.sortType || 0,
                advSort: _this.data.advSort ? _this.data.advSort : _this.advSortType(monitorDetail.sortType)
            };
            app.globalData.monitorDefaultSearchData = {
                city: monitorDetail.cityName,
                cityId: relation.cityId,
                brandName: monitorDetail.brandName,
                brandId: relation.brandId,
                seriesName: monitorDetail.seriesName,
                seriesID: relation.seriesID,
                searchJson: monitorDetail.searchJson,
                relationJson: '',
                minPrice: monitorDetail.minPrice,
                maxPrice: monitorDetail.maxPrice === 9999 ? 50 : monitorDetail.maxPrice,
                autoType: monitorDetail.autoType || 0,
                gearbox: monitorDetail.gearbox || 0,
                drive: monitorDetail.drive || 0,
                minAge: monitorDetail.minAge,
                maxAge: monitorDetail.maxAge === 99 ? 6 : monitorDetail.maxAge,
                minMileage: monitorDetail.minMileage,
                maxMileage: monitorDetail.maxMileage === 9999 ? 14 : monitorDetail.maxMileage,
                minDisplacement: monitorDetail.minDisplacement,
                maxDisplacement: monitorDetail.maxDisplacement === 99 ? 4 : monitorDetail.maxDisplacement,
                fuelType: monitorDetail.fuelType || 0,
                emission: monitorDetail.emission || 0,
                countryType: monitorDetail.countryType || 0,
                carColor: monitorDetail.carColor || 0,
                starConfig: monitorDetail.starConfig ? monitorDetail.starConfig.split(',').map(function (item) { return +item; }) : [],
                sortType: monitorDetail.sortType || 0,
                advSort: _this.data.advSort ? _this.data.advSort : _this.advSortType(monitorDetail.sortType)
            };
            if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || !carList || carList.length == 0) {
                _this.setData({
                    dataFlag: 2,
                    loadingDisplay: 'none',
                    bottomType: 1,
                    taskTime: monitor_1.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
                    startTimeName: monitor_1.startTimeName(monitorDetail.startTime),
                    fee: monitorDetail.fee,
                    monitorId: monitorDetail.id,
                    totalFee: monitorDetail.totalFee,
                    allOriginalData: [],
                    allData: [],
                    allCount: 0,
                    updateData: Object.assign({}, app.globalData.monitorSearchData),
                    defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
                    editFlag: false,
                    mSelect: detail ? detail : _this.data.mSelect
                });
                return;
            }
            if (!_this.data.isMtype) {
                var mType = car_1.getMonitorMSelect(carList);
                _this.setData({
                    mSelect: mType,
                    isMtype: true
                });
            }
            var monitorCarData = car_1.getMonitorAllData(carList, detail ? detail : _this.data.mSelect);
            if (monitorCarData.filterData.length === 0) {
                _this.setData({
                    dataFlag: 2,
                    loadingDisplay: 'none',
                    bottomType: 1,
                    taskTime: monitor_1.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
                    startTimeName: monitor_1.startTimeName(monitorDetail.startTime),
                    fee: monitorDetail.fee,
                    monitorId: monitorDetail.id,
                    totalFee: monitorDetail.totalFee,
                    allOriginalData: [],
                    allData: [],
                    allCount: 0,
                    updateData: Object.assign({}, app.globalData.monitorSearchData),
                    defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
                    editFlag: false,
                    mSelect: detail ? detail : _this.data.mSelect
                });
                return;
            }
            var enoughList = [{ key: 'gz', name: '瓜子', value: monitorCount.gzTotal }, { key: 'yx', name: '优信', value: monitorCount.yxTotal }, { key: 'rr', name: '人人', value: monitorCount.rrTotal }];
            enoughList.sort(util_1.compareSort('value', 'desc'));
            _this.setData({
                loadingDisplay: "none",
                dataFlag: 1,
                allCount: monitorCount.allTotal,
                allOriginalData: monitorCarData.filterData,
                allData: monitorCarData.filterData.slice(0, 5),
                gzFilterData: monitorCarData.gzFilterData,
                yxFilterData: monitorCarData.yxFilterData,
                rrFilterData: monitorCarData.rrFilterData,
                averagePrice: monitorCarData.averagePrice,
                lowPrice: monitorCarData.lowPrice,
                lowPriceData: monitorCarData.lowPriceData ? monitorCarData.lowPriceData : null,
                gzlowPriceData: monitorCarData.gzlowPriceData ? monitorCarData.gzlowPriceData : null,
                yxlowPriceData: monitorCarData.yxlowPriceData ? monitorCarData.yxlowPriceData : null,
                rrlowPriceData: monitorCarData.rrlowPriceData ? monitorCarData.rrlowPriceData : null,
                firstlowPriceData: monitorCarData.firstlowPriceData ? monitorCarData.firstlowPriceData : null,
                enoughList: enoughList,
                gzCount: monitorCount.gzTotal,
                yxCount: monitorCount.yxTotal,
                rrCount: monitorCount.rrTotal,
                taskTime: monitor_1.taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
                startTimeName: monitor_1.startTimeName(monitorDetail.startTime),
                fee: monitorDetail.fee,
                monitorId: monitorDetail.id,
                totalFee: monitorDetail.totalFee,
                bottomType: 1,
                sortType: monitorDetail.sortType || 0,
                updateData: Object.assign({}, app.globalData.monitorSearchData),
                defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
                mSelect: detail ? detail : _this.data.mSelect
            });
        }).catch(function (res) {
            console.log(res);
            wx.hideLoading();
            _this.setData({
                loadingDisplay: 'none',
                dataFlag: 4,
            });
        });
    },
    advSortType: function (value) {
        if (value) {
            if (value === 1) {
                return 1;
            }
            else if (value === 2) {
                return 3;
            }
            else if (value === 3) {
                return 2;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    },
    deleteItem: function (e) {
        var num = wx.getStorageSync('followNum');
        var index = e.detail.index;
        if (!num) {
            this.setData({
                followText: '屏蔽车源后，该车源将不会在后续监控中出现！',
                followType: 1,
                followDisplay: 'block',
                followIndex: index
            });
        }
        else {
            this.setData({
                followText: "是否确认屏蔽此车源！",
                followType: 1,
                followDisplay: "block",
                followIndex: index
            });
        }
    },
    followCancelEvent: function (e) {
        if (e.detail.followType == 1) {
            wx.setStorageSync('followNum', 1);
        }
        this.setData({
            followDisplay: e.detail.show
        });
    },
    followKnowEvent: function (e) {
        var _this = this;
        wx.setStorageSync('followNum', 1);
        var index = this.data.followIndex;
        var item = this.data.allData[index];
        var allData = __spreadArrays(this.data.allOriginalData);
        var allData2 = __spreadArrays(this.data.allData);
        var data = { monitorId: this.data.monitorId, blockData: {} };
        if (item.platform == 'gz') {
            data.blockData = { gz: [item.carId], yx: [], rr: [] };
        }
        if (item.platform == 'yx') {
            data.blockData = { gz: [], yx: [item.carId], rr: [] };
        }
        if (item.platform == 'rr') {
            data.blockData = { gz: [], yx: [], rr: [item.carId] };
        }
        this.service.batchAddBlack(monitor_1.jsonForm(data)).then(function (res) {
            allData.splice(index, 1);
            allData2.splice(index, 1);
            var carData = car_1.getBatchFilter(allData);
            _this.setData({
                singleEditFlag: true
            });
            if (allData.length > 0) {
                if (allData.length > allData2.length) {
                    allData2.push(allData[allData2.length]);
                }
                _this.setData({
                    dataFlag: 1
                });
            }
            else {
                _this.setData({
                    dataFlag: 2,
                });
            }
            _this.setData({
                allOriginalData: allData,
                allData: allData2,
                averagePrice: carData.averagePrice,
                lowPrice: carData.lowPrice,
                lowPriceData: carData.lowPriceData ? carData.lowPriceData : null,
                gzlowPriceData: carData.gzlowPriceData ? carData.gzlowPriceData : null,
                yxlowPriceData: carData.yxlowPriceData ? carData.yxlowPriceData : null,
                rrlowPriceData: carData.rrlowPriceData ? carData.rrlowPriceData : null,
                firstlowPriceData: carData.firstlowPriceData ? carData.firstlowPriceData : null,
                followDisplay: e.detail.show,
                singleEditFlag: false
            });
            wx.showToast({
                title: res.resultMsg,
                icon: "none",
                duration: 2000
            });
        }).catch(function (res) {
            wx.showToast({
                title: res.resultMsg || res.message,
                icon: "none",
                duration: 2000
            });
        });
    },
    goEdit: function () {
        this.setData({
            editFlag: !this.data.editFlag
        });
        if (!this.data.editFlag) {
            this.setData({
                selectAllFlag: true
            });
            this.goToSelectAll();
        }
    },
    goToSelect: function (e) {
        var _a;
        var num = 0;
        var indexArr = [];
        var index = e.detail.index;
        var item = 'allData[' + index + '].collection';
        var items = 'allOriginalData[' + index + '].collection';
        var a = __spreadArrays(this.data.allOriginalData);
        this.setData((_a = {},
            _a[item] = !this.data.allData[index].collection,
            _a[items] = !this.data.allOriginalData[index].collection,
            _a));
        for (var i = 0; i < a.length; i++) {
            if (a[i]['collection']) {
                num++;
                indexArr.push(i);
            }
        }
        if (num == this.data.allOriginalData.length) {
            this.setData({
                selectAllFlag: true,
                selectNum: num,
                indexArr: indexArr
            });
        }
        else {
            this.setData({
                selectAllFlag: false,
                selectNum: num,
                indexArr: indexArr
            });
        }
    },
    goToSelectAll: function () {
        var num = 0;
        var indexArr = [];
        var d = __spreadArrays(this.data.allData);
        var a = __spreadArrays(this.data.allOriginalData);
        for (var i = 0; i < d.length; i++) {
            d[i]['collection'] = !this.data.selectAllFlag;
        }
        for (var i = 0; i < a.length; i++) {
            a[i]['collection'] = !this.data.selectAllFlag;
            indexArr.push(i);
        }
        if (!this.data.selectAllFlag) {
            num = this.data.allOriginalData.length;
            indexArr;
        }
        else {
            num = 0;
            indexArr = [];
        }
        this.setData({
            allOriginalData: a,
            allData: d,
            selectAllFlag: !this.data.selectAllFlag,
            selectNum: num,
            indexArr: indexArr
        });
    },
    deleteBatchItem: function () {
        var indexArr = this.data.indexArr;
        if (indexArr.length == 0) {
            this.setData({
                editFlag: false
            });
            return;
        }
        this.setData({
            followText: '即将屏蔽' + this.data.selectNum + '辆车源，屏蔽后本次监控将不再获取该车源信息',
            followType: 2,
            followDisplay: 'block'
        });
    },
    followConfirmEvent: function (e) {
        var _this = this;
        var indexArr = this.data.indexArr;
        var arr = __spreadArrays(this.data.allOriginalData);
        var b = arr.filter(function (item, index) {
            return item && indexArr.indexOf(index) > -1;
        });
        var gzId = [];
        var yxId = [];
        var rrId = [];
        for (var i = 0; i < b.length; i++) {
            if (b[i].platform == 'gz') {
                gzId.push(b[i].carId);
            }
            if (b[i].platform == 'yx') {
                yxId.push(b[i].carId);
            }
            if (b[i].platform == 'rr') {
                rrId.push(b[i].carId);
            }
        }
        var data = { monitorId: this.data.monitorId, blockData: {} };
        data.blockData = { gz: gzId, yx: yxId, rr: rrId };
        this.service.batchAddBlack(monitor_1.jsonForm(data)).then(function (res) {
            _this.setData({
                followDisplay: e.detail.show,
                editFlag: false,
                allData: []
            });
            wx.showToast({
                title: res.resultMsg,
                icon: "none",
                duration: 2000
            });
            _this.getMonitorData(false);
        }).catch(function (res) {
            wx.showToast({
                title: res.resultMsg || res.message,
                icon: "none",
                duration: 2000
            });
        });
    },
    goToMAllSelect: function (e) {
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        this.setData({
            allData: []
        });
        this.getMonitorData(e.detail.index);
    },
    goMselect: function (e) {
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        this.setData({
            allData: []
        });
        this.getMonitorData(e.detail);
    },
    goTocheckAll: function () {
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        this.setData({
            allData: []
        });
        this.getMonitorData(1);
    },
    getUsedCarData: function () {
        var _this = this;
        var app = getApp();
        var searchData = app.globalData.monitorSearchData;
        var enoughList = [];
        Promise.all([getUsedCarData_1.getGuaZiCarData(2, transformFilter_1.default.transformFilter(searchData, 'gz')), getUsedCarData_1.getYouxinCarData(2, transformFilter_1.default.transformFilter(searchData, 'yx')), getUsedCarData_1.getRenRenCarData(2, transformFilter_1.default.transformFilter(searchData, 'rr'))].map(function (promiseItem) {
            return promiseItem.catch(function (err) {
                return err;
            });
        })).then(function (res) {
            var r0 = res[0];
            var r1 = res[1];
            var r2 = res[2];
            if ([r0, r1, r2].filter(function (item) { return item.code && (item.code === -100 || item.code === -200); }).length === 3) {
                _this.setData({
                    loadingDisplay: "none",
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
                    sortType: searchData.sortType,
                    bottomType: 2,
                });
            }
            else {
                if (r0 && r0.data) {
                    enoughList.push({
                        key: "gz",
                        name: "瓜子",
                        value: r0.count
                    });
                }
                if (r1 && r1.data) {
                    enoughList.push({
                        key: "yx",
                        name: "优信",
                        value: r1.count
                    });
                }
                if (r2 && r2.data) {
                    enoughList.push({
                        key: "rr",
                        name: "人人",
                        value: r2.count
                    });
                }
                enoughList.sort(util_1.compareSort("value", "desc"));
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
                    gzCount: r0.count || -1,
                    gzData: r0.data || [],
                    yxCount: r1.count || -1,
                    yxData: r1.data || [],
                    rrCount: r2.count || -1,
                    rrData: r2.data || [],
                    type: 2
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
                    loadingDisplay: "none",
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
                    gzCount: carData.gzCount,
                    yxCount: carData.yxCount,
                    rrCount: carData.rrCount,
                    enoughList: enoughList,
                    enoughBottom: false,
                    bottomType: 2,
                });
            }
        }).catch(function (res) {
            console.log(res);
            _this.setData({
                loadingDisplay: "none",
                dataFlag: 3
            });
        });
    },
    getStopMonitor: function () {
        this.setData({
            stopDisplay: 'block',
        });
    },
    getStop: function (e) {
        this.setData({
            stopDisplay: e.detail.stopShow,
        });
    },
    getStopConfirm: function (e) {
        var _this = this;
        this.service.endMonitor(this.data.monitorId).then(function (res) {
            wx.showToast({
                title: res.resultMsg || res.message,
                icon: "none",
                duration: 2000
            });
            _this.setData({
                stopDisplay: e.detail.stopShow,
            });
            wx.navigateBack({
                delta: 1
            });
        }).catch(function (res) {
            wx.showToast({
                title: res.resultMsg || res.message,
                icon: "none",
                duration: 2000
            });
        });
    },
    goSave: function () {
        var count = this.data.allCount;
        if (count > 50) {
            this.setData({
                monitorenoughDisplay: 'block',
                dialogTitle: '车源充足',
                dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
                dialogBtn: '知道了'
            });
        }
        else {
            this.setData({
                updateMonitorDisplay: 'block'
            });
        }
    },
    getUpdateCancelEvent: function (e) {
        this.setData({
            updateMonitorDisplay: e.detail.updateShow
        });
    },
    getUpdateConfrimEvent: function (e) {
        this.setData({
            updateMonitorDisplay: e.detail.updateShow
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
        var updateParam = monitor_1.jsonForm(car_1.updateMonitorParam(data));
        wx.showLoading({
            title: '正在修改监控...',
            mask: true
        });
        this.service.updateMonitor(updateParam).then(function (res) {
            wx.hideLoading();
            wx.showToast({
                title: res.resultMsg,
                duration: 2000,
                icon: 'none'
            });
            wx.navigateBack({
                delta: 1
            });
        }).catch(function (error) {
            wx.showToast({
                title: error.message || error.resultMsg,
                duration: 2000,
                icon: 'none'
            });
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
            bottomType: this.data.bottomType,
            taskTime: this.data.taskTime,
            startTimeName: this.data.startTimeName,
            fee: this.data.fee,
            monitorId: this.data.monitorId,
            totalFee: this.data.totalFee,
            sortType: this.data.sortType,
            allOriginalData: this.data.allOriginalData,
            sourceData: this.data.sourceData,
            gzSelectCount: this.data.gzCount > -1 ? this.data.gzFilterData.length : -1,
            yxSelectCount: this.data.yxCount > -1 ? this.data.yxFilterData.length : -1,
            rrSelectCount: this.data.rrCount > -1 ? this.data.rrFilterData.length : -1,
        };
        this.setData({
            editFlag: false,
            selectAllFlag: true
        });
        this.goToSelectAll();
        wx.navigateTo({
            url: "../statistics/statistics"
        });
    },
    goRefresh: function () {
        this.onCarShow();
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    getEnoughEvent: function (e) {
        this.setData({
            monitorenoughDisplay: e.detail.enoughShow
        });
    },
});
