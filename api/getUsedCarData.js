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
var getDataFromPlatform_1 = require("./getDataFromPlatform");
var formatter_1 = require("../formatter/formatter");
var util_1 = require("../utils/util");
var getGuaZiCarData = function (type, filter) {
    if (type === void 0) { type = 1; }
    if (filter === void 0) { filter = {}; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.gz ? data.cityId.gz.city_id : 0);
    if (!!filter.temp) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    if (!city) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    var count = 0;
    var list = [];
    var get = [];
    var minPrice = +filter.priceRange.split(",")[0];
    var maxPrice = +filter.priceRange.split(",")[1];
    if (minPrice === 0 && maxPrice === 9999) {
        get.push(getGuaZiCarDataPage(type, 1, filter));
    }
    else if (minPrice === 0 && maxPrice !== 9999) {
        var nPrice = Math.ceil(maxPrice * 1.075);
        var nfilter1 = __assign(__assign({}, filter), { order: 1, priceRange: maxPrice + ',' + nPrice });
        get.push(getGuaZiCarDataPage(type, 1, filter));
        get.push(getGuaZiCarDataPage(type, 1, nfilter1));
    }
    else if (minPrice !== 0 && maxPrice === 9999) {
        var nPrice = Math.ceil(minPrice * 1.075);
        var nfilter1 = __assign(__assign({}, filter), { order: 1, priceRange: nPrice + ',' + maxPrice });
        get.push(getGuaZiCarDataPage(type, 1, filter));
        get.push(getGuaZiCarDataPage(type, 1, nfilter1));
    }
    else {
        var nPrice = Math.ceil(maxPrice * 1.075);
        var nfilter1 = __assign(__assign({}, filter), { order: 1, priceRange: maxPrice + ',' + nPrice });
        get.push(getGuaZiCarDataPage(type, 1, filter));
        get.push(getGuaZiCarDataPage(type, 1, nfilter1));
    }
    return Promise.all(get.map(function (promiseItem) {
        return promiseItem.catch(function (err) {
            return Promise.resolve(err);
        });
    })).then(function (resp) {
        if (resp.filter(function (item) { return item.code && item.code < 0; }).length === resp.length) {
            return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
        }
        else {
            var resData0 = [];
            var resData1 = [];
            if (resp[0] && resp[0].data) {
                resData0 = resp[0].data;
            }
            if (resp[1] && resp[1].data) {
                resData1 = resp[1].data;
            }
            resData0 = resData0.filter(function (item) { return item.price >= minPrice * 10000 && item.price <= maxPrice * 10000; });
            resData1 = resData1.filter(function (item) { return item.price >= minPrice * 10000 && item.price <= maxPrice * 10000; });
            list = list.concat(resData0).concat(resData1);
            var obj_1 = {};
            var peon = list.reduce(function (cur, next) {
                obj_1[next.carId] ? "" : obj_1[next.carId] = true && cur.push(next);
                return cur;
            }, []);
            if (filter.order && filter.order === '1') {
                peon.sort(util_1.compareSort('price', 'asc'));
            }
            if (filter.order && filter.order === '5') {
                peon.sort(util_1.compareSort('mileage', 'asc'));
            }
            if (filter.order && filter.order === '4') {
                peon.sort(util_1.compareSort('licensedDate', 'desc', 'carId'));
            }
            if (resp[0] && resp[0].data && resp[0].count > 50) {
                count = resp[0].count;
            }
            else {
                count = peon.length;
            }
            return Promise.resolve({ count: count, data: peon });
        }
    });
};
exports.getGuaZiCarData = getGuaZiCarData;
var getGuaZiCarDataPage = function (type, num, filter) {
    if (type === void 0) { type = 1; }
    if (num === void 0) { num = 1; }
    if (filter === void 0) { filter = {}; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.gz ? data.cityId.gz.city_id : 0);
    var page = { size: 50, num: num };
    return getDataFromPlatform_1.guazi
        .searchList(city, page, filter)
        .then(function (res) {
        return Promise.resolve({
            count: res.data.total,
            data: formatter_1.doFormatData(res.data, 'gz')
        });
    })
        .catch(function (error) {
        return Promise.reject(error);
    });
};
var getYouxinCarData = function (type, filter) {
    if (type === void 0) { type = 1; }
    if (filter === void 0) { filter = []; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.yx ? data.cityId.yx.cityid : '');
    if (!!filter[0].temp) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    if (!city) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    var getPromise = [];
    var _loop_1 = function (filterItem) {
        var firstList = [];
        var list = [];
        var count = 0;
        var get = getYouxinCarDataPage(type, 1, filterItem).then(function (res) {
            if (res.n_p === 0) {
                return Promise.reject({ code: -101, mag: '平台无数据！' });
            }
            else {
                var PromiseList = [];
                filterItem = __assign(__assign({}, filterItem), { n_p: res.n_p, c_p: res.c_p, p_p: res.p_p });
                firstList = res.data;
                count = res.count;
                PromiseList.push(getYouxinCarDataPage(type, 2, filterItem));
                PromiseList.push(getYouxinCarDataPage(type, 3, filterItem));
                return Promise.all(PromiseList.map(function (item) {
                    return item.catch(function (err) {
                        return Promise.resolve(err);
                    });
                })).then(function (resp) {
                    if (resp.filter(function (item) { return item.code && item.code < 0; }).length === 2) {
                        return Promise.resolve({ count: count, data: firstList });
                    }
                    else {
                        for (var _i = 0, resp_1 = resp; _i < resp_1.length; _i++) {
                            var respItem = resp_1[_i];
                            if (!!respItem && respItem.data) {
                                list = list.concat(respItem.data);
                            }
                        }
                        list = firstList.concat(list);
                        return Promise.resolve({ count: count, data: list });
                    }
                });
            }
        }).catch(function (res) {
            return Promise.reject(res);
        });
        getPromise.push(get);
    };
    for (var _i = 0, filter_1 = filter; _i < filter_1.length; _i++) {
        var filterItem = filter_1[_i];
        _loop_1(filterItem);
    }
    return Promise.all(getPromise.map(function (item) {
        return item.catch(function (err) {
            return Promise.resolve(err);
        });
    })).then(function (resp) {
        var lists = [];
        var count = 0;
        if (resp.filter(function (item) { return item.code && (item.code === -100 || item.code === -200); }).length === resp.length) {
            return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
        }
        else if (resp.filter(function (item) { return item.code && (item.code === -101); }).length === resp.length) {
            return Promise.reject({ code: -101, mag: '平台无数据！' });
        }
        else {
            for (var _i = 0, resp_2 = resp; _i < resp_2.length; _i++) {
                var respItem = resp_2[_i];
                if (!!respItem && respItem.data) {
                    lists = lists.concat(respItem.data);
                    count += respItem.count;
                }
            }
            return Promise.resolve({ count: count, data: lists });
        }
    });
};
exports.getYouxinCarData = getYouxinCarData;
var getYouxinCarDataPage = function (type, num, filter) {
    if (type === void 0) { type = 1; }
    if (num === void 0) { num = 1; }
    if (filter === void 0) { filter = {}; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.yx ? data.cityId.yx.cityid : '');
    var page = { size: 20, num: num };
    return getDataFromPlatform_1.youxin
        .searchList(city, page, filter)
        .then(function (res) {
        return Promise.resolve({
            count: res.data.local_total,
            data: formatter_1.doFormatData(res.data, 'yx'),
            n_p: res.data.n_p,
            c_p: res.data.c_p,
            p_p: res.data.p_p
        });
    })
        .catch(function (res) {
        return Promise.reject(res);
    });
};
var getRenRenCarData = function (type, filter) {
    if (type === void 0) { type = 1; }
    if (filter === void 0) { filter = {}; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.rr ? data.cityId.rr.city : '');
    if (!!filter.temp) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    if (!city) {
        return Promise.reject({ code: -101, mag: '平台无数据！' });
    }
    var list = [];
    return Promise.all([
        getRenRenCarDataPage(type, 1, filter),
        getRenRenCarDataPage(type, 2, filter)
    ].map(function (promiseItem) {
        return promiseItem.catch(function (err) {
            return Promise.resolve(err);
        });
    })).then(function (_a) {
        var r0 = _a[0], r1 = _a[1];
        if ([r0, r1].filter(function (item) { return item.code && item.code < 0; }).length === 2) {
            return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
        }
        else {
            if (r0 && r0.data) {
                list = list.concat(r0.data);
            }
            if (r1 && r1.data) {
                list = list.concat(r1.data);
            }
            var count = [r0, r1].find(function (item) { return !item.code; }).count;
            return Promise.resolve({ count: count, data: list });
        }
    });
};
exports.getRenRenCarData = getRenRenCarData;
var getRenRenCarDataPage = function (type, num, filter) {
    if (type === void 0) { type = 1; }
    if (num === void 0) { num = 1; }
    if (filter === void 0) { filter = {}; }
    var app = getApp();
    var data = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
    var city = (data.cityId.rr ? data.cityId.rr.city : '');
    var page = { size: 40, num: num };
    return getDataFromPlatform_1.renren
        .searchList(city, page, filter)
        .then(function (res) {
        return Promise.resolve({
            count: res.body.numFound,
            data: formatter_1.doFormatData(res.body, 'rr')
        });
    })
        .catch(function (error) {
        return Promise.reject(error);
    });
};
