"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var homeService = (function () {
    function homeService() {
    }
    homeService.prototype.getHourMoney = function () {
        return http_1.default.get("/indexParam.json");
    };
    return homeService;
}());
exports.default = homeService;
