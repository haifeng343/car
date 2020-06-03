"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var StatisticsService = (function () {
    function StatisticsService() {
    }
    StatisticsService.prototype.addCarMonitor = function (addParam) {
        return http_1.default.post('/cdd/carMonitor/addMonitor.json', addParam);
    };
    StatisticsService.prototype.startCarMonitor = function (addParam) {
        return http_1.default.post('/cdd/carMonitor/startMonitor.json', addParam);
    };
    StatisticsService.prototype.updateCarMonitor = function (addParam) {
        return http_1.default.post('/cdd/carMonitor/updateMonitor.json', addParam);
    };
    StatisticsService.prototype.endCarMonitor = function (data) {
        return http_1.default.get('/cdd/carMonitor/endCarMonitor.json', data);
    };
    StatisticsService.prototype.getMonitorCarList = function (data) {
        return http_1.default.get('/cdd/carMonitor/getCarMonitorList.json', data);
    };
    StatisticsService.prototype.monitorCarDetail = function (data) {
        return http_1.default.get('/cdd/carMonitor/getCarDetailById.json', data);
    };
    StatisticsService.prototype.userInfo = function (data) {
        return http_1.default.get('/cdd/user/userInfo.json', data);
    };
    return StatisticsService;
}());
exports.default = StatisticsService;
