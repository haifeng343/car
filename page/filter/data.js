"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
var FilterPageData = (function () {
    function FilterPageData() {
        this.map = [];
        this.currentView = '';
        this.indexList = [];
        this.searchData = {
            autoType: 0,
            gearbox: 0,
            drive: 0,
            minAge: 0,
            maxAge: 6,
            minMileage: 0,
            maxMileage: 14,
            minDisplacement: 0,
            maxDisplacement: 4,
            fuelType: 0,
            emission: 0,
            countryType: 0,
            carColor: 0,
            starConfig: [],
            sortType: 0
        };
        this.map = JSON.parse(map_1.default);
        this.indexList = this.map.map(function (item, index) {
            return { label: item.title, value: item.id, active: index === 0 };
        });
    }
    return FilterPageData;
}());
exports.default = FilterPageData;
