"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statisicsData = (function () {
    function statisicsData() {
        this.allCount = 0;
        this.showCount = 0;
        this.averagePrice = 0;
        this.lowPrice = 0;
        this.lowPriceData = null;
        this.firstlowPriceData = null;
        this.stopDisplay = 'none';
        this.bottomType = 0;
        this.monitorenoughDisplay = 'none';
        this.monitorShow = 'none';
        this.publicDisplay = 'none';
        this.updateMonitorDisplay = 'none';
        this.monitorId = '';
        this.ddCoin = 0;
        this.sortType = 0;
        this.fee = 1;
        this.startTimeName = '';
        this.taskTime = '';
        this.totalFee = '';
        this.bindPhone = false;
        this.bindPublic = false;
        this.enoughList = [];
        this.gzCount = 0;
        this.yxCount = 0;
        this.rrCount = 0;
        this.allOriginalData = [];
        this.sourceData = [];
        this.updateData = {};
        this.defalutData = {};
    }
    return statisicsData;
}());
exports.default = statisicsData;
