"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var fecha = require("./fecha");
var getUsedCardAllData = function (data) {
    var app = getApp();
    var maxTotal = 50;
    var sourceData = [];
    var filterData = [];
    var allCount = 0;
    var gzFilterData = [];
    var yxFilterData = [];
    var rrFilterData = [];
    var gzData = data.gzData;
    var yxData = data.yxData;
    var rrData = data.rrData;
    for (var i = 0; i < maxTotal; i++) {
        if (data.gzCount > 0) {
            var gz = addPlatfromData(filterData, gzData, i);
            if (gz === 0) {
                break;
            }
            if (gz === 1) {
                gzFilterData.push(gzData[i]);
                filterData.push(gzData[i]);
                sourceData.push({
                    data: gzData[i].source,
                    newLevel: 0,
                    platform: 'gz',
                    priceDownLevel: 0
                });
            }
        }
        if (data.yxCount > 0) {
            var yx = addPlatfromData(filterData, yxData, i);
            if (yx === 0) {
                break;
            }
            if (yx === 1) {
                yxFilterData.push(yxData[i]);
                filterData.push(yxData[i]);
                sourceData.push({
                    data: yxData[i].source,
                    newLevel: 0,
                    platform: 'yx',
                    priceDownLevel: 0
                });
            }
        }
        if (data.rrCount > 0) {
            var rr = addPlatfromData(filterData, rrData, i);
            if (rr === 0) {
                break;
            }
            if (rr === 1) {
                rrFilterData.push(rrData[i]);
                filterData.push(rrData[i]);
                sourceData.push({
                    data: rrData[i].source,
                    newLevel: 0,
                    platform: 'rr',
                    priceDownLevel: 0
                });
            }
        }
    }
    if (data.gzCount > -1) {
        allCount += data.gzCount;
    }
    if (data.yxCount > -1) {
        allCount += data.yxCount;
    }
    if (data.rrCount > -1) {
        allCount += data.rrCount;
    }
    var priceSortArr = __spreadArrays(filterData);
    var firstPaySortArr = __spreadArrays(filterData);
    var gzSortArr = __spreadArrays(gzFilterData);
    var yxSortArr = __spreadArrays(yxFilterData);
    var rrSortArr = __spreadArrays(rrFilterData);
    var average = filterData.length > 0
        ? filterData.reduce(function (sum, _a) {
            var price = _a.price;
            return sum + price;
        }, 0) /
            filterData.length
        : 0;
    var lowPrice = filterData.length > 0
        ? Math.min.apply(Math, filterData.map(function (o) {
            return o.price;
        }))
        : 0;
    priceSortArr.sort(util_1.compareSort('price', 'asc'));
    var lowPriceData = priceSortArr[0];
    gzSortArr.sort(util_1.compareSort('price', 'asc'));
    var gzlowPriceData = gzSortArr[0];
    yxSortArr.sort(util_1.compareSort('price', 'asc'));
    var yxlowPriceData = yxSortArr[0];
    rrSortArr.sort(util_1.compareSort('price', 'asc'));
    var rrlowPriceData = rrSortArr[0];
    firstPaySortArr = firstPaySortArr.filter(function (item) { return item.firstPay !== 0; });
    var firstlowPriceData = null;
    if (firstPaySortArr.length === 0) {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = lowPriceData;
    }
    else {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = firstPaySortArr[0];
    }
    var y = data.type == 1
        ? app.globalData.searchData
        : app.globalData.monitorSearchData;
    if (y.advSort === 1) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('price', 'asc'));
        filterData = allArr;
    }
    if (y.advSort === 11) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('price', 'desc'));
        filterData = allArr;
    }
    if (y.advSort === 2) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('licensedDate', 'desc'));
        filterData = allArr;
    }
    if (y.advSort === 3) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('mileage', 'asc'));
        filterData = allArr;
    }
    if (y.advSort === 4) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('firstPay', 'asc'));
        filterData = allArr;
    }
    return {
        allCount: allCount,
        filterData: filterData,
        gzFilterData: gzFilterData,
        yxFilterData: yxFilterData,
        rrFilterData: rrFilterData,
        sourceData: sourceData,
        averagePrice: +average.toFixed(0),
        lowPrice: +lowPrice.toFixed(0),
        lowPriceData: lowPriceData,
        gzlowPriceData: gzlowPriceData,
        yxlowPriceData: yxlowPriceData,
        rrlowPriceData: rrlowPriceData,
        firstlowPriceData: firstlowPriceData,
        gzCount: data.gzCount,
        yxCount: data.yxCount,
        rrCount: data.rrCount
    };
};
exports.getUsedCardAllData = getUsedCardAllData;
var getMonitorAllData = function (list, mSelect) {
    var app = getApp();
    var filterData = [];
    var gzFilterData = [];
    var yxFilterData = [];
    var rrFilterData = [];
    var carList = monitorFilter(list, mSelect);
    for (var _i = 0, carList_1 = carList; _i < carList_1.length; _i++) {
        var p = carList_1[_i];
        if (p.platform === 'gz') {
            var data = p.data;
            var price = +data.price.replace('万', '') * 10000;
            var firstPay = +data.first_pay.replace('万', '') * 10000;
            var mileage = +data.road_haul.replace('万公里', '') * 10000;
            var licenseDateString = data.license_date.replace('年', '') + '-01-01 00:00:00';
            var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
            var datas = {
                title: data.title,
                price: price,
                priceText: data.price,
                thumb: data.thumb_img,
                firstPay: firstPay,
                firstPayText: data.first_pay,
                mileage: mileage,
                mileageText: data.road_haul,
                licensedDate: licensedDate,
                licensedText: data.license_date,
                tag: data.list_tags ? data.list_tags.map(function (item) { return item.text; }) : [],
                source: p,
                platform: 'gz',
                carId: data.puid,
                newLevel: p.newLevel,
                priceDownLevel: p.priceDownLevel,
                priceMargin: p.priceMargin,
                collection: false
            };
            filterData.push(datas);
            gzFilterData.push(datas);
        }
        else if (p.platform === 'yx') {
            var data = p.data;
            var price = +data.price.replace('万', '') * 10000;
            var firstPay = +data.shoufu_price.replace('首付', '').replace('万', '') * 10000;
            var mileage = +data.mileage.replace('万', '') * 10000;
            var licenseDateString = data.carnotime + ' 00:00:00';
            var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
            var datas = {
                title: data.carserie + data.carname,
                price: price,
                priceText: data.price,
                thumb: data.carimg,
                firstPay: firstPay,
                firstPayText: data.shoufu_price.replace('首付', ''),
                mileage: mileage,
                mileageText: data.mileage + '公里',
                licensedDate: licensedDate,
                licensedText: data.carnotime.substr(0, 4) + '年',
                tag: data.tags_sort.map(function (item) { return item.name; }),
                source: p,
                platform: 'yx',
                carId: data.carid,
                newLevel: p.newLevel,
                priceDownLevel: p.priceDownLevel,
                priceMargin: p.priceMargin,
                collection: false
            };
            filterData.push(datas);
            yxFilterData.push(datas);
        }
        else {
            var data = p.data;
            var price = data.price * 10000;
            var firstPay = data.down_payment * 10000;
            var mileage = data.mileage * 10000;
            var licenseDateString = data.licensed_date.substr(0, 10) + ' 00:00:00';
            var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
            var datas = {
                title: data.title,
                price: price,
                priceText: data.price + '万',
                thumb: data.search_image_url[0],
                firstPay: firstPay,
                firstPayText: data.down_payment + '万',
                mileage: mileage,
                mileageText: data.mileage + '万公里',
                licensedDate: licensedDate,
                licensedText: data.licensed_date.substr(0, 4) + '年',
                tag: data.tags.map(function (item) { return item.txt; }),
                source: p,
                platform: 'rr',
                carId: data.id,
                newLevel: p.newLevel,
                priceDownLevel: p.priceDownLevel,
                priceMargin: p.priceMargin,
                collection: false
            };
            filterData.push(datas);
            rrFilterData.push(datas);
        }
    }
    var priceSortArr = __spreadArrays(filterData);
    var firstPaySortArr = __spreadArrays(filterData);
    var gzSortArr = __spreadArrays(gzFilterData);
    var yxSortArr = __spreadArrays(yxFilterData);
    var rrSortArr = __spreadArrays(rrFilterData);
    var average = filterData.length > 0
        ? filterData.reduce(function (sum, _a) {
            var price = _a.price;
            return sum + price;
        }, 0) /
            filterData.length
        : 0;
    var lowPrice = filterData.length > 0
        ? Math.min.apply(Math, filterData.map(function (o) {
            return o.price;
        }))
        : 0;
    priceSortArr.sort(util_1.compareSort('price', 'asc'));
    var lowPriceData = priceSortArr[0];
    gzSortArr.sort(util_1.compareSort('price', 'asc'));
    var gzlowPriceData = gzSortArr[0];
    yxSortArr.sort(util_1.compareSort('price', 'asc'));
    var yxlowPriceData = yxSortArr[0];
    rrSortArr.sort(util_1.compareSort('price', 'asc'));
    var rrlowPriceData = rrSortArr[0];
    firstPaySortArr = firstPaySortArr.filter(function (item) { return item.firstPay !== 0; });
    var firstlowPriceData = null;
    if (firstPaySortArr.length === 0) {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = lowPriceData;
    }
    else {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = firstPaySortArr[0];
    }
    var y = app.globalData.monitorSearchData;
    if (y.advSort === 1) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('price', 'asc'));
        filterData = allArr;
    }
    if (y.advSort === 11) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('price', 'desc'));
        filterData = allArr;
    }
    if (y.advSort === 2) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('licensedDate', 'desc'));
        filterData = allArr;
    }
    if (y.advSort === 3) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('mileage', 'asc'));
        filterData = allArr;
    }
    if (y.advSort === 4) {
        var allArr = __spreadArrays(filterData);
        allArr.sort(util_1.compareSort('firstPay', 'asc'));
        filterData = allArr;
    }
    return {
        filterData: filterData,
        gzFilterData: gzFilterData,
        yxFilterData: yxFilterData,
        rrFilterData: rrFilterData,
        averagePrice: +average.toFixed(0),
        lowPrice: +lowPrice.toFixed(0),
        lowPriceData: lowPriceData,
        gzlowPriceData: gzlowPriceData,
        yxlowPriceData: yxlowPriceData,
        rrlowPriceData: rrlowPriceData,
        firstlowPriceData: firstlowPriceData
    };
};
exports.getMonitorAllData = getMonitorAllData;
var getBatchFilter = function (filterData) {
    var gzFilterData = [];
    var yxFilterData = [];
    var rrFilterData = [];
    for (var i = 0; i < filterData.length; i++) {
        if (filterData[i].platform == 'gz') {
            gzFilterData.push(filterData[i]);
        }
        if (filterData[i].platform == 'yx') {
            yxFilterData.push(filterData[i]);
        }
        if (filterData[i].platform == 'rr') {
            rrFilterData.push(filterData[i]);
        }
    }
    var priceSortArr = __spreadArrays(filterData);
    var firstPaySortArr = __spreadArrays(filterData);
    var gzSortArr = __spreadArrays(gzFilterData);
    var yxSortArr = __spreadArrays(yxFilterData);
    var rrSortArr = __spreadArrays(rrFilterData);
    var average = filterData.length > 0
        ? filterData.reduce(function (sum, _a) {
            var price = _a.price;
            return sum + price;
        }, 0) /
            filterData.length
        : 0;
    var lowPrice = filterData.length > 0
        ? Math.min.apply(Math, filterData.map(function (o) {
            return o.price;
        }))
        : 0;
    priceSortArr.sort(util_1.compareSort('price', 'asc'));
    var lowPriceData = priceSortArr[0];
    gzSortArr.sort(util_1.compareSort('price', 'asc'));
    var gzlowPriceData = gzSortArr[0];
    yxSortArr.sort(util_1.compareSort('price', 'asc'));
    var yxlowPriceData = yxSortArr[0];
    rrSortArr.sort(util_1.compareSort('price', 'asc'));
    var rrlowPriceData = rrSortArr[0];
    firstPaySortArr = firstPaySortArr.filter(function (item) { return item.firstPay !== 0; });
    var firstlowPriceData = null;
    if (firstPaySortArr.length === 0) {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = lowPriceData;
    }
    else {
        firstPaySortArr.sort(util_1.compareSort('firstPay', 'asc'));
        firstlowPriceData = firstPaySortArr[0];
    }
    return {
        filterData: filterData,
        gzFilterData: gzFilterData,
        yxFilterData: yxFilterData,
        rrFilterData: rrFilterData,
        averagePrice: +average.toFixed(0),
        lowPrice: +lowPrice.toFixed(0),
        lowPriceData: lowPriceData,
        gzlowPriceData: gzlowPriceData,
        yxlowPriceData: yxlowPriceData,
        rrlowPriceData: rrlowPriceData,
        firstlowPriceData: firstlowPriceData
    };
};
exports.getBatchFilter = getBatchFilter;
var addMonitorParam = function (obj) {
    var app = getApp();
    var y = app.globalData.searchData;
    var relation = {
        brandId: y.brandId,
        cityId: y.cityId,
        seriesID: y.seriesID
    };
    var data = {
        cityName: y.city,
        minPrice: y.minPrice,
        maxPrice: y.maxPrice === 50 ? 9999 : y.maxPrice,
        minAge: y.minAge,
        maxAge: y.maxAge === 6 ? 99 : y.maxAge,
        minMileage: y.minMileage,
        maxMileage: y.maxMileage === 14 ? 9999 : y.maxMileage,
        minDisplacement: y.minDisplacement,
        maxDisplacement: y.maxDisplacement === 4 ? 99 : y.maxDisplacement,
        actualPrice: +(obj.lowPrice / 10000).toFixed(2),
        searchJson: y.searchJson,
        relationJson: JSON.stringify(relation)
    };
    if (y.brandName) {
        data.brandName = y.brandName;
    }
    if (y.seriesName) {
        data.seriesName = y.seriesName;
    }
    if (y.autoType) {
        data.autoType = y.autoType;
    }
    if (y.gearbox) {
        data.gearbox = y.gearbox;
    }
    if (y.drive) {
        data.drive = y.drive;
    }
    if (y.fuelType) {
        data.fuelType = y.fuelType;
    }
    if (y.emission) {
        data.emission = y.emission;
    }
    if (y.countryType) {
        data.countryType = y.countryType;
    }
    if (y.carColor) {
        data.carColor = y.carColor;
    }
    if (y.starConfig.length) {
        data.starConfig = y.starConfig.join(',');
    }
    if (y.sortType) {
        data.sortType = y.sortType;
    }
    var n = [];
    if (obj.noteSelect) {
        n.push(2);
    }
    if (obj.publicSelect) {
        n.push(1);
    }
    data.notice = n.join(',');
    data.cddUsedBlock = { gz: [], yx: [], rr: [] };
    data.cddUsedCount = {
        gzTotal: obj.gzCount,
        yxTotal: obj.yxCount,
        rrTotal: obj.rrCount,
        allTotal: obj.allCount
    };
    var cdd = compareCar(obj.sourceData, obj.allOriginalData);
    data.cddUsedUsable = cdd;
    return data;
};
exports.addMonitorParam = addMonitorParam;
var updateMonitorParam = function (obj) {
    var app = getApp();
    var y = app.globalData.monitorSearchData;
    var relation = {
        brandId: y.brandId,
        cityId: y.cityId,
        seriesID: y.seriesID
    };
    var data = {
        id: obj.monitorId,
        cityName: y.city,
        minPrice: y.minPrice,
        maxPrice: y.maxPrice === 50 ? 9999 : y.maxPrice,
        minAge: y.minAge,
        maxAge: y.maxAge === 6 ? 99 : y.maxAge,
        minMileage: y.minMileage,
        maxMileage: y.maxMileage === 14 ? 9999 : y.maxMileage,
        minDisplacement: y.minDisplacement,
        maxDisplacement: y.maxDisplacement === 4 ? 99 : y.maxDisplacement,
        actualPrice: +(obj.lowPrice / 10000).toFixed(2),
        searchJson: y.searchJson,
        relationJson: JSON.stringify(relation)
    };
    if (y.brandName) {
        data.brandName = y.brandName;
    }
    if (y.seriesName) {
        data.seriesName = y.seriesName;
    }
    if (y.autoType) {
        data.autoType = y.autoType;
    }
    if (y.gearbox) {
        data.gearbox = y.gearbox;
    }
    if (y.drive) {
        data.drive = y.drive;
    }
    if (y.fuelType) {
        data.fuelType = y.fuelType;
    }
    if (y.emission) {
        data.emission = y.emission;
    }
    if (y.countryType) {
        data.countryType = y.countryType;
    }
    if (y.carColor) {
        data.carColor = y.carColor;
    }
    if (y.starConfig.length) {
        data.starConfig = y.starConfig.join(',');
    }
    if (y.sortType) {
        data.sortType = y.sortType;
    }
    data.cddUsedBlock = { gz: [], yx: [], rr: [] };
    data.cddUsedCount = {
        gzTotal: obj.gzCount,
        yxTotal: obj.yxCount,
        rrTotal: obj.rrCount,
        allTotal: obj.allCount
    };
    var cdd = compareCar(obj.sourceData, obj.allOriginalData);
    data.cddUsedUsable = cdd;
    return data;
};
exports.updateMonitorParam = updateMonitorParam;
var getMonitorMSelect = function (list) {
    var newLevelNum = 0;
    var priceDownLevelNum = 0;
    for (var i = 0; i < list.length; i++) {
        if (list[i].newLevel > 0) {
            newLevelNum++;
        }
        if (list[i].priceDownLevel > 0) {
            priceDownLevelNum++;
        }
    }
    if (newLevelNum > 0) {
        return 2;
    }
    else if (newLevelNum == 0 && priceDownLevelNum > 0) {
        return 3;
    }
    else if (newLevelNum == 0 && priceDownLevelNum == 0) {
        return 1;
    }
    else {
        return 1;
    }
};
exports.getMonitorMSelect = getMonitorMSelect;
function addPlatfromData(allData, PlatfromData, index) {
    if (index < PlatfromData.length) {
        if (allData.length >= 50) {
            return 0;
        }
        else {
            return 1;
        }
    }
    else {
        return 2;
    }
}
function compareCar(array1, array2) {
    var result = [];
    for (var key in array1) {
        var stra = array1[key];
        var count = 0;
        for (var j = 0; j < array2.length; j++) {
            var strb = array2[j];
            if (stra.platform === 'gz' && strb.platform === 'gz') {
                if (stra.data.puid === strb.carId) {
                    count++;
                }
            }
            if (stra.platform === 'yx' && strb.platform === 'yx') {
                if (stra.data.carid === strb.carId) {
                    count++;
                }
            }
            if (stra.platform == 'rr' && strb.platform === 'rr') {
                if (stra.data.id === strb.carId) {
                    count++;
                }
            }
        }
        if (count > 0) {
            result.push(stra);
        }
    }
    return result;
}
function monitorFilter(arr, mSelect) {
    var newArr = [];
    if (mSelect == 1) {
        newArr = arr;
    }
    if (mSelect == 2) {
        newArr = arr.filter(function (item) {
            return item.newLevel > 0;
        });
    }
    if (mSelect == 3) {
        newArr = arr.filter(function (item) {
            return item.priceDownLevel > 0;
        });
    }
    return newArr;
}
