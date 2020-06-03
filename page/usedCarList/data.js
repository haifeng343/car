"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UsedCarPageData = (function () {
    function UsedCarPageData() {
        this.dataFlag = 0;
        this.allCount = 0;
        this.allOriginalData = [];
        this.allData = [];
        this.gzFilterData = [];
        this.yxFilterData = [];
        this.rrFilterData = [];
        this.sourceData = [];
        this.averagePrice = 0;
        this.lowPrice = 0;
        this.lowPriceData = null;
        this.gzlowPriceData = null;
        this.yxlowPriceData = null;
        this.rrlowPriceData = null;
        this.firstlowPriceData = null;
        this.gzCount = 0;
        this.yxCount = 0;
        this.rrCount = 0;
        this.loadingDisplay = 'block';
        this.monitorDisplay = 'none';
        this.publicDisplay = 'none';
        this.monitorenoughDisplay = 'none';
        this.monitorTitle = '';
        this.dialogTitle = '';
        this.dialogText = '';
        this.dialogBtn = '';
        this.loadingShow = false;
        this.enoughBottom = false;
        this.monitorBottom = false;
        this.ddCoin = 0;
        this.bindPhone = false;
        this.bindPublic = false;
        this.sortType = 0;
    }
    return UsedCarPageData;
}());
exports.default = UsedCarPageData;