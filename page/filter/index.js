"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var service_1 = require("./service");
var searchDataStream_1 = require("../../utils/searchDataStream");
Page({
    data: new data_1.default(),
    service: new service_1.default(),
    changeList: new Set(),
    type: 1,
    onLoad: function (options) {
        var type = options.type;
        if (type) {
            this.type = +type;
        }
        var app = getApp();
        var outsideData = this.type === 1
            ? app.globalData.searchData
            : app.globalData.monitorSearchData;
        var insideData = this.data.searchData;
        var assginData = {};
        Object.keys(insideData)
            .filter(function (key) { return typeof outsideData[key] !== 'undefined'; })
            .forEach(function (key) {
            if (Array.isArray(outsideData[key])) {
                assginData[key] = Object.assign([], outsideData[key]);
            }
            else if (typeof outsideData[key] === 'object') {
                assginData[key] = Object.assign({}, outsideData[key]);
            }
            else {
                assginData[key] = outsideData[key];
            }
        });
        var map = this.data.map;
        Object.keys(assginData).forEach(function (key) {
            var filterItem = map.find(function (item) { return item.field === key; });
            if (filterItem) {
                if (filterItem && filterItem.optionList) {
                    filterItem.optionList.forEach(function (item) {
                        if (Array.isArray(assginData[key]) &&
                            assginData[key].includes(item.value)) {
                            item.active = true;
                        }
                        else if (item.value === assginData[key]) {
                            item.active = true;
                        }
                    });
                }
            }
        });
        this.setData({
            data: Object.assign({}, outsideData),
            searchData: assginData,
            map: map
        });
    },
    handleGotoView: function (event) {
        var value = event.currentTarget.dataset.value;
        this.setData({
            currentView: value,
            indexList: this.data.indexList.map(function (item) {
                if (item.value === value) {
                    item.active = true;
                }
                else {
                    item.active = false;
                }
                return item;
            })
        });
    },
    handleSelectFilter: function (event) {
        var _a, _b, _c, _d, _e;
        var value = +event.currentTarget.dataset.value;
        var field = event.currentTarget.dataset.field;
        var filterItem = this.data.map.find(function (item) { return item.field === field; });
        if (filterItem) {
            var optionItem_1 = filterItem.optionList.find(function (item) { return item.value === value; });
            var action = '';
            if (optionItem_1.active === true) {
                if (filterItem.multi) {
                    action = 'cancelselectmulti';
                }
                else {
                    action = 'cancelselect';
                }
            }
            else {
                if (filterItem.multi) {
                    action = 'selectmulti';
                }
                else {
                    action = 'selectandcancel';
                }
            }
            var arr = [];
            if (Array.isArray(this.data.searchData[field])) {
                arr = this.data.searchData[field];
            }
            switch (action) {
                case 'cancelselectmulti':
                    optionItem_1.active = false;
                    arr.splice(arr.indexOf(optionItem_1.value), 1);
                    this.setData((_a = {},
                        _a['searchData.' + field] = arr.slice().sort(function (a, b) { return a - b; }),
                        _a));
                    break;
                case 'cancelselect':
                    optionItem_1.active = false;
                    this.setData((_b = {},
                        _b['searchData.' + field] = filterItem.defaultValue,
                        _b));
                    break;
                case 'selectmulti':
                    optionItem_1.active = true;
                    arr.push(optionItem_1.value);
                    this.setData((_c = {},
                        _c['searchData.' + field] = arr.slice().sort(function (a, b) { return a - b; }),
                        _c));
                    break;
                case 'selectandcancel':
                    optionItem_1.active = true;
                    this.setData((_d = {},
                        _d['searchData.' + field] = optionItem_1.value,
                        _d));
                    filterItem.optionList.forEach(function (item) {
                        if (item.value !== optionItem_1.value) {
                            item.active = false;
                        }
                    });
                    break;
            }
            this.setData((_e = {},
                _e['map'] = this.data.map.slice(),
                _e));
            this.changeList.add(field);
        }
    },
    handleRangeChange: function (event) {
        var _a;
        var _b = event.currentTarget.dataset.field, minField = _b[0], maxField = _b[1];
        var step = event.currentTarget.dataset.step.toString().split('.');
        var min = event.detail.min;
        var max = event.detail.max;
        this.changeList.add(minField);
        this.changeList.add(maxField);
        var digit = step[1] ? step[1].length : 0;
        var minText = min.toFixed(digit);
        var maxText = max.toFixed(digit);
        this.setData((_a = {},
            _a['searchData.' + minField] = +minText,
            _a['searchData.' + maxField] = +maxText,
            _a));
    },
    handleResetToDefault: function () {
        var _this = this;
        var outsideData = this.data.data;
        var insideData = this.data.searchData;
        var assginData = {};
        var map = this.data.map;
        Object.keys(insideData)
            .filter(function (key) { return typeof outsideData[key] !== 'undefined'; })
            .filter(function (key) {
            return map.find(function (item) {
                if (typeof item.field === 'string') {
                    return item.field === key;
                }
                else if (Array.isArray(item.field)) {
                    return item.field.includes(key);
                }
                return false;
            });
        })
            .forEach(function (key) {
            _this.changeList.add(key);
            var filterItem = map.find(function (item) {
                if (typeof item.field === 'string') {
                    return item.field === key;
                }
                if (Array.isArray(item.field)) {
                    return item.field.includes(key);
                }
                return false;
            });
            var defaultValue = filterItem.defaultValue, field = filterItem.field;
            if (typeof field === 'string') {
                if (Array.isArray(defaultValue)) {
                    assginData[key] = Object.assign([], defaultValue);
                }
                else if (typeof outsideData[key] === 'object') {
                    assginData[key] = Object.assign({}, defaultValue);
                }
                else {
                    assginData[key] = defaultValue;
                }
            }
            else if (Array.isArray(field)) {
                assginData[field[0]] = defaultValue[0];
                assginData[field[1]] = defaultValue[1];
            }
        });
        Object.keys(assginData).forEach(function (key) {
            var filterItem = map.find(function (item) { return item.field === key; });
            if (filterItem && filterItem.optionList) {
                filterItem.optionList.forEach(function (item) {
                    if (Array.isArray(assginData[key]) &&
                        assginData[key].includes(item.value)) {
                        item.active = true;
                    }
                    else if (item.value === assginData[key]) {
                        item.active = true;
                    }
                    else {
                        item.active = false;
                    }
                });
            }
        });
        this.setData({ searchData: assginData, map: map });
    },
    handleSubmit: function () {
        var outsideData = this.data.data;
        var insideData = this.data.searchData;
        var result = {};
        this.changeList.forEach(function (field) {
            if (JSON.stringify(insideData[field]) !== JSON.stringify(outsideData[field])) {
                result[field] = insideData[field];
            }
        });
        this.changeList = new Set();
        if (this.type === 1) {
            searchDataStream_1.SearchDataSubject.next(result);
        }
        else if (this.type === 2) {
            searchDataStream_1.MonitorSearchDataSubject.next(result);
        }
        wx.navigateBack({ delta: 1 });
    }
});
