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
Page({
    data: {
        result: [],
        value: '',
        resultLength: 0,
        hasAsked: false,
        isFocus: false
    },
    submitFlag: false,
    service: new service_1.default(),
    inputSearch: function (event) {
        this.setData({
            value: event.detail.value
        });
        if (event.detail.value) {
            this.handleSearch();
        }
    },
    handleSearch: function () {
        var _this = this;
        this.setData({ hasAsked: false });
        if (!this.data.value) {
            this.setData({
                result: [],
                hasAsked: true,
                resultLength: -1
            });
            return;
        }
        if (this.submitFlag) {
            return;
        }
        this.submitFlag = true;
        wx.showLoading({
            title: '搜索中...',
            mask: true
        });
        this.service.searchCity(this.data.value).then(function (result) {
            wx.hideLoading();
            var length = result.data.length || 0;
            _this.setData({
                result: result.data || [],
                hasAsked: true,
                resultLength: length
            });
            _this.submitFlag = false;
        }).catch(function () {
            wx.hideLoading();
            _this.submitFlag = false;
            wx.showToast({
                title: '网络异常',
                icon: 'none'
            });
        });
    },
    handleSelectCity: function (event) {
        var item = event.currentTarget.dataset.item;
        var searchData = { city: item.cityName, cityId: {} };
        if (item.json) {
            var json = JSON.parse(item.json);
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
        var app = getApp();
        app.globalData.searchData = __assign(__assign({}, app.globalData.searchData), searchData);
        wx.navigateBack({
            delta: 2
        });
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    clearInput: function () {
        var _this = this;
        this.setData({
            isFocus: false,
        }, function () {
            _this.setData({ value: '', hasAsked: false });
        });
    }
});
