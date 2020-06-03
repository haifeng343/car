"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BrandPageData = (function () {
    function BrandPageData() {
        this.isLoaded = false;
        this.hotList = [];
        this.brandList = [];
        this.showSeries = false;
        this.currentBrand = null;
        this.currentSeries = null;
        this.seriesList = [];
        this.indexList = [];
        this.currentView = '';
        this.currentSeriesView = '';
    }
    return BrandPageData;
}());
exports.default = BrandPageData;
