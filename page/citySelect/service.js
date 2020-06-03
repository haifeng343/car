"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var CitySelectService = (function () {
    function CitySelectService() {
    }
    CitySelectService.prototype.getCityList = function () {
        return http_1.default.get('/cityList.json');
    };
    CitySelectService.prototype.indexParam = function () {
        return http_1.default.get('/indexParam.json');
    };
    CitySelectService.prototype.cityDetail = function (cityName) {
        return http_1.default.get('/cityDetail.json', { cityName: cityName });
    };
    return CitySelectService;
}());
exports.default = CitySelectService;
