"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var UsedCarService = (function () {
    function UsedCarService() {
    }
    UsedCarService.prototype.getCarDetail = function (id) {
        return http_1.default.get('/cdd/carMonitor/getCarDetailById.json', { monitorId: id });
    };
    UsedCarService.prototype.batchAddBlack = function (Param) {
        return http_1.default.request('/cdd/carMonitor/batchAddBlacklist.json', 'POST', Param);
    };
    UsedCarService.prototype.endMonitor = function (id) {
        return http_1.default.get('/cdd/carMonitor/endCarMonitor.json', { monitorId: id });
    };
    UsedCarService.prototype.updateMonitor = function (updateParam) {
        return http_1.default.request('/cdd/carMonitor/updateMonitor.json', 'POST', updateParam);
    };
    return UsedCarService;
}());
exports.default = UsedCarService;
