"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var service_1 = require("./service");
var searchDataStream_1 = require("../../utils/searchDataStream");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    type: 1,
    scrollFlag: false,
    onLoad: function (options) {
        var _this = this;
        var type = options.type;
        if (type) {
            this.type = +type;
        }
        this.service
            .getBrandList()
            .then(function (brandList) {
            var indexList = [{ label: '热门', value: 'top' }];
            brandList.forEach(function (item) {
                indexList.push({ label: item.pinyin, value: item.pinyin });
            });
            _this.setData({ brandList: brandList, indexList: indexList, isLoaded: true });
            wx.nextTick(function () {
                var app = getApp();
                var searchData = _this.type === 1
                    ? app.globalData.searchData
                    : app.globalData.monitorSearchData;
                var bid = searchData.brandId.id;
                var sid = searchData.seriesID.id;
                if (bid) {
                    var currentBrand_1;
                    for (var _i = 0, brandList_1 = brandList; _i < brandList_1.length; _i++) {
                        var item = brandList_1[_i];
                        for (var _a = 0, _b = item.brandList; _a < _b.length; _a++) {
                            var item2 = _b[_a];
                            if (item2.id === bid) {
                                currentBrand_1 = item2;
                            }
                        }
                    }
                    _this.scrollFlag = true;
                    if (typeof currentBrand_1 !== 'undefined') {
                        _this.setData({
                            currentBrand: currentBrand_1
                        });
                        _this.getSeriesListByBrandId(currentBrand_1.id)
                            .then(function () {
                            _this.setData({
                                showSeries: true,
                                currentView: "brandId-" + bid
                            });
                            wx.nextTick(function () {
                                _this.setData({
                                    currentSeries: _this.data.seriesList.find(function (item) { return item.id === sid; }),
                                    currentSeriesView: "seriesId-" + sid
                                });
                            });
                        })
                            .catch(function (error) {
                            console.error("\u83B7\u53D6\u8F66\u7CFB\u5217\u8868\u5931\u8D25, \u54C1\u724CID: " + currentBrand_1.id);
                            console.error(error);
                        });
                    }
                }
            });
        })
            .catch(function (error) {
            console.error(error);
            _this.setData({ isLoaded: true });
            wx.showToast({
                title: "\u83B7\u53D6\u54C1\u724C\u5931\u8D25!\u8BF7\u8054\u7CFB\u5BA2\u670D!",
                icon: 'none'
            });
        });
        this.service
            .getHotBrand()
            .then(function (hotList) {
            _this.setData({ hotList: hotList });
        })
            .catch(function (error) {
            console.error(error);
            wx.showToast({
                title: "\u83B7\u53D6\u70ED\u95E8\u54C1\u724C\u5931\u8D25!\u8BF7\u8054\u7CFB\u5BA2\u670D!",
                icon: 'none'
            });
        });
    },
    handlePageScroll: function () {
        if (this.scrollFlag === true) {
            this.scrollFlag = false;
            return;
        }
        if (this.data.showSeries === true) {
            this.setData({ showSeries: false });
        }
    },
    handleSubmit: function (data) {
        var app = getApp();
        var searchData = this.type === 1
            ? app.globalData.searchData
            : app.globalData.monitorSearchData;
        var result = {};
        Object.keys(data).forEach(function (key) {
            if (JSON.stringify(data[key]) !== JSON.stringify(searchData[key])) {
                result[key] = data[key];
            }
        });
        if (this.type === 1) {
            searchDataStream_1.SearchDataSubject.next(result);
        }
        else if (this.type === 2) {
            searchDataStream_1.MonitorSearchDataSubject.next(result);
        }
    },
    handleSelectAllBrand: function () {
        var data = {
            brandName: '',
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: ''
        };
        this.handleSubmit(data);
        wx.navigateBack({ delta: 1 });
    },
    handleSelectBrand: function (event) {
        var item = event.currentTarget.dataset.item;
        this.setData({ showSeries: true, currentBrand: item, currentSeries: null });
        this.getSeriesListByBrandId(item.id);
    },
    getSeriesListByBrandId: function (id) {
        var _this = this;
        return this.service
            .getSeriesListByBrandId(id)
            .then(function (seriesList) {
            _this.setData({ seriesList: seriesList });
        })
            .catch(function (error) {
            console.error("\u83B7\u53D6\u8F66\u7CFB\u5217\u8868\u5931\u8D25, \u54C1\u724CID: " + id);
            console.error(error);
            wx.showToast({
                title: "\u83B7\u53D6\u8F66\u7CFB\u5931\u8D25!\u8BF7\u8054\u7CFB\u5BA2\u670D!",
                icon: 'none'
            });
        });
    },
    handleSelectSeries: function (event) {
        var item = event.currentTarget.dataset.item;
        var searchObject = {};
        var brandData = this.data.currentBrand.value;
        if (brandData.rr) {
            searchObject.rr = { brand: brandData.rr.name };
        }
        if (brandData.gz) {
            searchObject.gz = { minor: brandData.gz.value };
        }
        if (brandData.yx) {
            searchObject.yx = { brandid: brandData.yx.brandid };
        }
        var seriesData = item.value;
        if (seriesData.rr) {
            searchObject.rr.car_series = seriesData.rr.name;
        }
        if (seriesData.gz) {
            searchObject.gz.tag = seriesData.gz.value;
        }
        if (seriesData.yx) {
            searchObject.yx.serieid = seriesData.yx.serieid;
        }
        var data = {
            brandName: this.data.currentBrand.name,
            brandId: this.data.currentBrand.value,
            seriesName: item.seriesName,
            seriesID: seriesData,
            searchJson: JSON.stringify(searchObject)
        };
        this.handleSubmit(data);
        wx.navigateBack({ delta: 1 });
    },
    handleGotoView: function (event) {
        var value = event.currentTarget.dataset.value;
        this.setData({ currentView: value });
    }
});
