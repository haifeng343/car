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
var wx_1 = require("../../utils/wx");
var map_1 = require("../../utils/map");
var service_1 = require("./service");
Page({
    data: {
        data: [],
        hotCity: [],
        searchList: [],
        currentTabValue: 0,
        userCity: { name: "定位中...", code: "" },
        viewIndex: "",
        indexList: ["#", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
        topText: '已支持全国购，将从全国帮您搜寻本城市可购买的二手车'
    },
    service: new service_1.default(),
    getHotCityList: function () {
        var _this = this;
        this.service.indexParam().then(function (resp) {
            var data = '';
            var hotCity = [];
            if (resp.data && resp.data.cddUsedHotCity) {
                data = resp.data.cddUsedHotCity;
            }
            data.split(',').map(function (item) {
                var array = item.split('_');
                if (array[0]) {
                    hotCity.push({ name: array[0], value: item });
                }
            });
            _this.setData({ hotCity: hotCity });
        });
    },
    getCityList: function () {
        var _this = this;
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        this.getHotCityList();
        return this.service.getCityList().then(function (resp) {
            wx.hideLoading();
            _this.formatData(resp.data);
        });
    },
    formatData: function (data) {
        var _this = this;
        var pl = [];
        this.data.indexList.forEach(function (item) {
            if (item != "#") {
                pl.push({
                    p: item,
                    cl: []
                });
            }
        });
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            var array = item.split('_');
            if (array.length === 3) {
                var firstLetter = array[1][0].toUpperCase();
                for (var _a = 0, pl_1 = pl; _a < pl_1.length; _a++) {
                    var py = pl_1[_a];
                    if (py.p === firstLetter) {
                        py.cl.push({ name: array[0], value: item });
                        break;
                    }
                }
            }
        }
        this.setData({ data: pl }, function () {
            _this.getUserLocation();
            _this.setData({
                viewIndex: ""
            });
        });
    },
    handleGetCityInfo: function (event) {
        var name = event.currentTarget.dataset.name;
        var value = event.currentTarget.dataset.value;
        if (value) {
            var app_1 = getApp();
            if (app_1.globalData.searchData.city === name) {
                wx.navigateBack({ delta: 1 });
                return;
            }
            this.service.cityDetail(name).then(function (resp) {
                var searchData = { city: name, cityId: {} };
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
                wx.navigateBack({ delta: 1 });
            });
        }
    },
    getUserLocation: function () {
        var _this = this;
        wx_1.getLocationSetting()
            .then(function (_) { return wx_1.getLocation(); })
            .then(function (location) { return _this.calcCityByLocation(location); })
            .catch(function (_) {
            console.error("获取定位授权失败啦~");
            wx.showToast({
                title: "为了更好的使用效果，请同意地理位置信息授权",
                icon: "none"
            });
            _this.calcCityByLocation(undefined);
        });
    },
    calcCityByLocation: function (location) {
        var _this = this;
        var userCity = {
            name: "定位失败",
            code: ""
        };
        if (location) {
            map_1.getLocationInfo(location).then(function (resp) {
                var city = resp.result.address_component.city;
                if (city) {
                    var data = _this.data.data;
                    var temp = false;
                    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                        var pl = data_2[_i];
                        var cityInfo = pl.cl.find(function (cl) { return city.includes(cl.name); });
                        if (cityInfo) {
                            userCity.name = cityInfo.name;
                            userCity.code = cityInfo.value;
                            temp = true;
                            break;
                        }
                    }
                    if (!temp) {
                        userCity.name = "当前城市不在列表内";
                        userCity.code = '';
                    }
                    _this.setData({ userCity: userCity });
                }
            }).catch(function () {
                _this.setData({ userCity: userCity });
            });
        }
        else {
            this.setData({ userCity: userCity });
        }
    },
    handleRepos: function () {
        this.setData({
            userCity: {
                name: "定位中...",
                code: ""
            }
        });
        this.getUserLocation();
    },
    handleScrollToIndex: function (event) {
        var item = event.currentTarget.dataset.item;
        if (item === "#") {
            this.setData({ viewIndex: "topview" });
        }
        else {
            this.setData({ viewIndex: "city" + item });
        }
    },
    goToSearch: function () {
        wx.navigateTo({
            url: "../citySearch/citySearch"
        });
    },
    onLoad: function () {
        this.getCityList();
    }
});
