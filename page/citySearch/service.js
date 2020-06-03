"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var SearchService = (function () {
    function SearchService() {
    }
    SearchService.prototype.searchCity = function (cityNameParam) {
        if (cityNameParam === void 0) { cityNameParam = ''; }
        return http_1.default.get('/searchCity.json', { cityNameParam: cityNameParam });
    };
    return SearchService;
}());
exports.default = SearchService;
