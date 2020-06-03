"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var MonitorHistroyService = (function () {
    function MonitorHistroyService() {
    }
    MonitorHistroyService.prototype.getMonitorCarList = function () {
        return http_1.default.get('/cdd/carMonitor/getCarHistoryList.json')
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (monitorList) {
            return monitorList.filter(function (value) {
                monitorList.map(function (item) {
                    item.title = item.cityName + "(" + (item.locationName || '全城') + ")";
                    item.monitorDateText = item.startTime ? "\u76D1\u63A7\u65F6\u95F4:" + (item.startTime).substr(0, 10) + "\u81F3" + item.endTime.substr(0, 10) : '';
                    return item;
                });
                if (value.startTime) {
                    return true;
                }
                return '';
            });
        }).catch(function () {
        });
    };
    MonitorHistroyService.prototype.removeCarHistoryMonitor = function (id) {
        var _this = this;
        return http_1.default.get('/cdd/carMonitor/deleteCarMonitor.json', { monitorId: id }).then(function () {
            return _this.getMonitorCarList();
        });
    };
    return MonitorHistroyService;
}());
exports.default = MonitorHistroyService;
