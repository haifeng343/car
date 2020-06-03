"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var UsedCarService = (function () {
    function UsedCarService() {
    }
    UsedCarService.prototype.userInfo = function () {
        return http_1.default.get('/cdd/user/userInfo.json');
    };
    UsedCarService.prototype.indexParam = function () {
        return http_1.default.get('/indexParam.json');
    };
    UsedCarService.prototype.addMonitor = function (addParam) {
        return http_1.default.request('/cdd/carMonitor/addMonitor.json', 'POST', addParam);
    };
    return UsedCarService;
}());
exports.default = UsedCarService;
