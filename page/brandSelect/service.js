"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var BrandSelectService = (function () {
    function BrandSelectService() {
    }
    BrandSelectService.prototype.getBrandList = function () {
        return http_1.default.get('/brandList.json')
            .then(function (resp) {
            return Promise.resolve((resp.data || []).map(function (item) {
                if (!item.brandpy) {
                    item.brandpy = item.brandName[0].toLocaleUpperCase();
                }
                else {
                    item.brandpy = item.brandpy[0].toLocaleUpperCase();
                }
                return item;
            }));
        })
            .then(function (resp) {
            var map = new Map();
            for (var _i = 0, resp_1 = resp; _i < resp_1.length; _i++) {
                var b = resp_1[_i];
                var data = JSON.parse(b.json);
                var brandpy = b.brandpy, id = b.id, brandName = b.brandName, icon = b.icon;
                if (!map.has(brandpy)) {
                    map.set(brandpy, {
                        pinyin: brandpy,
                        brandList: []
                    });
                }
                var value = {
                    icon: icon,
                    id: id
                };
                if (data.gz) {
                    value.gz = {
                        value: data.gz.value
                    };
                }
                if (data.rr) {
                    value.rr = {
                        name: data.rr.name
                    };
                }
                if (data.yx) {
                    value.yx = {
                        brandid: data.yx.brandid
                    };
                }
                map.get(brandpy).brandList.push({
                    id: id,
                    name: brandName,
                    icon: icon,
                    value: value
                });
            }
            return Array.from(map.values());
        });
    };
    BrandSelectService.prototype.getHotBrand = function () {
        return http_1.default.get('/indexParam.json')
            .then(function (resp) {
            return Promise.resolve(resp.data.cddUsedBardHot);
        })
            .then(function (resp) {
            return resp.map(function (item) {
                var id = item.id, brandName = item.brandName, json = item.json, icon = item.icon;
                var data = JSON.parse(json);
                var value = {
                    icon: icon,
                    id: id
                };
                if (data.gz) {
                    value.gz = {
                        value: data.gz.value
                    };
                }
                if (data.rr) {
                    value.rr = {
                        name: data.rr.name
                    };
                }
                if (data.yx) {
                    value.yx = {
                        brandid: data.yx.brandid
                    };
                }
                return {
                    id: id,
                    name: brandName,
                    icon: icon,
                    value: value
                };
            });
        });
    };
    BrandSelectService.prototype.getSeriesListByBrandId = function (id) {
        return http_1.default.get('/seriesList.json', { id: id })
            .then(function (resp) { return Promise.resolve((resp.data || [])); })
            .then(function (resp) {
            return Promise.resolve(resp.filter(function (item) {
                return item.json.includes('"rr"') ||
                    item.json.includes('"gz"') ||
                    item.json.includes('"yx"');
            }));
        })
            .then(function (resp) {
            resp.unshift({
                seriesName: '不限车系',
                json: '',
                createTime: '',
                id: 0,
                pid: 0
            });
            return resp.map(function (item) {
                var seriesName = item.seriesName, json = item.json, id = item.id;
                var data = (json ? JSON.parse(json) : {});
                var value = { id: id };
                if (data.gz) {
                    value.gz = {
                        value: data.gz.value
                    };
                }
                if (data.rr) {
                    value.rr = {
                        name: data.rr.name
                    };
                }
                if (data.yx) {
                    value.yx = {
                        serieid: data.yx.serieid
                    };
                }
                return {
                    id: id,
                    name: seriesName,
                    seriesName: seriesName === '不限车系' ? '' : seriesName,
                    value: value
                };
            });
        });
    };
    return BrandSelectService;
}());
exports.default = BrandSelectService;
