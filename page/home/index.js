"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./service");
var data_1 = require("./data");
var wx_1 = require("../../utils/wx");
var map_1 = require("../../utils/map");
var auth_1 = require("../../utils/auth");
var searchDataStream_1 = require("../../utils/searchDataStream");
Page({
    service: new service_1.default(),
    shortY: 0,
    submitFlag: false,
    data: new data_1.default(),
    searchSubmit: function () {
        var app = getApp();
        var searchData = __assign({}, this.data.searchData);
        app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), searchData);
        if (!searchData.city) {
            wx.showToast({
                title: '请先选择城市',
                icon: 'none'
            });
        }
        else if (this.data.isAuth) {
            wx.navigateTo({
                url: '../usedCarList/usedCarList'
            });
        }
        else {
            this.showAuthDialog();
            wx.showLoading({
                title: '获取登录授权中',
                mask: true
            });
        }
    },
    showAuthDialog: function () {
        var _this = this;
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
    handleGetUserInfo: function (e) {
        var _this = this;
        var userInfo = e.detail.userInfo.detail;
        var iv = userInfo.iv, encryptedData = userInfo.encryptedData;
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
            _this.searchSubmit();
        })
            .catch(function () {
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
    slideOption: function () {
        var spread = this.data.spread;
        this.setData({ spread: !spread });
    },
    bindTouchStart: function (event) {
        this.shortY = event.changedTouches[0]
            ? event.changedTouches[0].pageY || 0
            : 0;
    },
    bindTouchEnd: function (event) {
        if (this.shortY && this.shortY > event.changedTouches[0].pageY + 50) {
            console.log('上滑事件');
            this.setData({ spread: true });
        }
    },
    selectStarConfig: function (event) {
        var index = +event.currentTarget.dataset.index;
        var searchData = __assign({}, this.data.searchData);
        if (searchData.starConfig.indexOf(index) > -1) {
            searchData.starConfig.splice(searchData.starConfig.indexOf(index), 1);
        }
        else {
            searchData.starConfig.push(index);
            searchData.starConfig.sort();
        }
        this.setData({ searchData: searchData });
    },
    selectType: function (event) {
        var index = +event.currentTarget.dataset.index;
        var type = event.currentTarget.dataset.type;
        var searchData = __assign({}, this.data.searchData);
        if (index === searchData[type]) {
            searchData[type] = 0;
        }
        else {
            searchData[type] = index;
        }
        if (type === 'sortType') {
            switch (searchData['sortType']) {
                case 1:
                    searchData.advSort = 1;
                    break;
                case 2:
                    searchData.advSort = 3;
                    break;
                case 3:
                    searchData.advSort = 2;
                    break;
                default: searchData.advSort = 0;
            }
        }
        this.setData({ searchData: __assign(__assign({}, this.data.searchData), searchData) });
    },
    handleClearBrand: function () {
        var searchData = __assign({}, this.data.searchData);
        if (searchData.brandName) {
            searchData.brandName = '';
            searchData.brandId = {};
            searchData.seriesName = '';
            searchData.seriesID = {};
            this.setData({ searchData: searchData }, function () {
                var app = getApp();
                app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), searchData);
            });
        }
        else {
            this.goBrandSelect();
        }
    },
    goBrandSelect: function () {
        wx.navigateTo({
            url: '../brandSelect/index?type=1'
        });
    },
    goCitySelect: function () {
        wx.navigateTo({
            url: '../citySelect/citySelect'
        });
    },
    getBanner: function () {
        var _this = this;
        this.service.getBanner().then(function (resp) {
            if (resp.list.length) {
                _this.setData({ imgUrls: resp.list });
            }
        });
    },
    handleRepos: function () {
        if (this.data.cityText === '定位中...') {
            return;
        }
        this.setData({ cityText: '定位中...' });
        this.getUserLocation();
    },
    getUserLocation: function () {
        var _this = this;
        wx_1.getLocationSetting()
            .then(function (_) { return wx_1.getLocation(); })
            .then(function (location) { return _this.calcCityByLocation(location); })
            .catch(function (_) {
            console.error('获取定位授权失败啦~');
            wx.showToast({
                title: '为了更好的使用效果，请同意地理位置信息授权',
                icon: 'none'
            });
            _this.calcCityByLocation(undefined);
        });
    },
    calcCityByLocation: function (location) {
        var _this = this;
        if (location) {
            map_1.getLocationInfo(location)
                .then(function (resp) {
                var city = resp.result.address_component.city;
                if (city) {
                    var searchData = __assign({}, _this.data.searchData);
                    _this.setData({
                        cityText: '手动定位'
                    });
                    if (!city.includes(searchData.city)) {
                        var cityList = _this.data.cityList;
                        if (cityList.length) {
                            _this.changeCity(city);
                        }
                        else {
                            _this.service
                                .getCityList()
                                .then(function (res) {
                                _this.setData({ cityList: res.data }, function () {
                                    _this.changeCity(city);
                                });
                            })
                                .catch(function () {
                                _this.setData({
                                    cityText: '定位失败'
                                });
                            });
                        }
                    }
                }
            })
                .catch(function () {
                _this.setData({
                    cityText: '定位失败'
                });
            });
        }
        else {
            this.setData({ cityText: '定位失败' });
        }
    },
    changeCity: function (city) {
        var _this = this;
        var cityList = this.data.cityList;
        var _loop_1 = function (item) {
            var cityName = item.split('_')[0];
            if (city.includes(cityName) && cityName) {
                var app_1 = getApp();
                this_1.service
                    .cityDetail(cityName)
                    .then(function (resp) {
                    var searchData = { city: cityName, cityId: {} };
                    if (resp.data && resp.data.json) {
                        var json = JSON.parse(resp.data.json);
                        if (json.rr) {
                            searchData.cityId = __assign(__assign({}, searchData.cityId), { rr: { city: json.rr.city } });
                        }
                        if (json.gz) {
                            searchData.cityId = __assign(__assign({}, searchData.cityId), {
                                gz: {
                                    city_id: json.gz.city_id,
                                    domain: json.gz.domain
                                }
                            });
                        }
                        if (json.yx) {
                            searchData.cityId = __assign(__assign({}, searchData.cityId), {
                                yx: {
                                    cityid: json.yx.cityid,
                                    provinceid: json.yx.provinceid
                                }
                            });
                        }
                    }
                    wx.setStorageSync('cityHistory', searchData);
                    app_1.globalData.searchData = __assign(__assign({}, app_1.globalData.searchData), searchData);
                    _this.setData({
                        searchData: __assign(__assign({}, _this.data.searchData), searchData)
                    });
                })
                    .catch(function () {
                    _this.setData({
                        cityText: '定位失败'
                    });
                });
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var _i = 0, cityList_1 = cityList; _i < cityList_1.length; _i++) {
            var item = cityList_1[_i];
            var state_1 = _loop_1(item);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        this.setData({ cityText: '当前城市不在列表内' });
    },
    handlePriceChange: function (event) {
        var data = {
            minPrice: event.detail.min,
            maxPrice: event.detail.max
        };
        var searchData = __assign(__assign({}, this.data.searchData), data);
        this.setData({ searchData: searchData });
    },
    handleAgeChange: function (event) {
        var data = {
            minAge: event.detail.min,
            maxAge: event.detail.max
        };
        var searchData = __assign(__assign({}, this.data.searchData), data);
        this.setData({ searchData: searchData });
    },
    handleMileageChange: function (event) {
        var data = {
            minMileage: event.detail.min,
            maxMileage: event.detail.max
        };
        var searchData = __assign(__assign({}, this.data.searchData), data);
        this.setData({ searchData: searchData });
    },
    handleShowTipDialog: function () {
        this.setData({ showTipDialog: true });
    },
    handleCloseTipDialog: function () {
        this.setData({ showTipDialog: false });
    },
    init: function () {
        var app = getApp();
        var cityHistory = wx.getStorageSync('cityHistory');
        if (!app.globalData.searchData.city) {
            if (!cityHistory || !cityHistory.city) {
                cityHistory = {
                    city: '北京',
                    cityId: {
                        rr: { city: '北京' },
                        gz: { city_id: 12, domain: 'bj' },
                        yx: { cityid: '201', provinceid: '2' }
                    }
                };
            }
            app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), cityHistory);
        }
        var initData = {
            gearbox: 0,
            drive: 0,
            minDisplacement: 0,
            maxDisplacement: 4,
            fuelType: 0,
            emission: 0,
            countryType: 0,
            carColor: 0,
            starConfig: [1],
            advSort: 0
        };
        var starConfig = [1, 2, 3, 4];
        initData.starConfig = [];
        for (var index = 0; index < starConfig.length; index++) {
            var temp = starConfig[index];
            if (app.globalData.searchData.starConfig.indexOf(temp) > -1) {
                initData.starConfig.push(temp);
            }
        }
        switch (app.globalData.searchData.sortType) {
            case 1:
                initData.advSort = 1;
                break;
            case 2:
                initData.advSort = 3;
                break;
            case 3:
                initData.advSort = 2;
                break;
            default: initData.advSort = 0;
        }
        app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), initData);
        var searchData = __assign({}, app.globalData.searchData);
        this.setData({ searchData: searchData, cityText: '手动定位' });
    },
    getUnReadCouponList: function () {
        var _this = this;
        this.service.getUnReadCouponList().then(function (couponList) {
            _this.setData({ couponList: couponList, showCouponDialog: couponList.length > 0 });
        });
    },
    handleCloseCouponDialog: function () {
        this.setData({ showCouponDialog: false });
    },
    onShow: function () {
        var _this = this;
        this.init();
        if (this.data.isAuth) {
            this.getUnReadCouponList();
        }
        else if (!this.service.authSubscription) {
            this.service.authSubscription = auth_1.authSubject.subscribe(function (isAuth) {
                console.log('Home Page isAuth Subscription, isAuth = ' + isAuth);
                if (isAuth) {
                    _this.setData({ isAuth: isAuth });
                    _this.getUnReadCouponList();
                }
            });
        }
    },
    onLoad: function () {
        var _this = this;
        this.getBanner();
        searchDataStream_1.SearchDataSubject.subscribe(function (next) {
            if (next) {
                var app = getApp();
                app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), next);
            }
        });
        searchDataStream_1.MonitorSearchDataSubject.subscribe(function (next) {
            if (next) {
                var app = getApp();
                app.globalData.monitorSearchData = __assign(__assign({}, app.globalData.monitorSearchData), next);
            }
        });
        searchDataStream_1.SearchDataObject.subscribe(function (next) {
            if (next) {
                var app = getApp();
                _this.setData({ searchData: app.globalData.searchData });
            }
        });
    },
    onUnload: function () {
        if (this.service.authSubscription) {
            this.service.authSubscription.unsubscribe();
            this.service.authSubscription = null;
        }
    },
    onHide: function () {
        var app = getApp();
        var searchData = __assign({}, this.data.searchData);
        app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), searchData);
    },
    onShareAppMessage: function () {
        return {
            title: '实时监控全网二手车信息，低价品牌好车一辆不错过',
            path: 'page/home/index',
            imageUrl: 'https://piaodingding.oss-cn-hangzhou.aliyuncs.com/images/wechat/cdd/share.png'
        };
    }
});
