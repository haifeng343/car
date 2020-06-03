"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var transformFilter = function (searchData, type) {
    if (searchData === void 0) { searchData = {}; }
    if (type === void 0) { type = 'gz'; }
    if (type === 'gz') {
        if (!searchData.city || !searchData.cityId.gz || !searchData.cityId.gz.city_id || !searchData.cityId.gz.domain) {
            return { temp: true };
        }
        var filter = {};
        if (searchData.brandName && searchData.brandId && searchData.brandId.gz && searchData.brandId.gz.value) {
            filter.minor = searchData.brandId.gz.value;
        }
        else if (searchData.brandName) {
            return { temp: true };
        }
        if (searchData.seriesName && searchData.seriesID && searchData.seriesID.gz && searchData.seriesID.gz.value && filter.minor) {
            filter.tag = searchData.seriesID.gz.value;
        }
        else if (searchData.seriesName) {
            return { temp: true };
        }
        else {
            filter.tag = -1;
        }
        if (searchData.maxPrice && searchData.maxPrice != 50) {
            filter.priceRange = searchData.minPrice + ',' + searchData.maxPrice;
        }
        else {
            filter.priceRange = searchData.minPrice + ',9999';
        }
        switch (searchData.autoType) {
            case 1:
                filter.auto_type = '5,6';
                break;
            case 2:
                filter.auto_type = '2';
                break;
            case 3:
                filter.auto_type = '3';
                break;
            case 4:
                filter.auto_type = '4';
                break;
            case 7:
                filter.auto_type = '7';
                break;
            case 8:
                filter.auto_type = '8';
                break;
            default: break;
        }
        switch (searchData.gearbox) {
            case 1:
                filter.gearbox = '1';
                break;
            case 2:
                filter.gearbox = '2';
                break;
            default: break;
        }
        switch (searchData.drive) {
            case 3:
                filter.driving_type = '3';
                break;
            default:
                filter.driving_type = '-1';
                break;
        }
        if (searchData.maxAge && searchData.maxAge != 6) {
            filter.license_date = searchData.minAge + ',' + searchData.maxAge;
        }
        else {
            filter.license_date = searchData.minAge + ',99';
        }
        if (searchData.maxMileage && searchData.maxMileage != 14) {
            filter.road_haul = searchData.minMileage + ',' + searchData.maxMileage;
        }
        else {
            filter.road_haul = searchData.minMileage + ',9999';
        }
        var randomNum = (0.0000001 * Math.floor(Math.random() * 10000)).toFixed(7);
        if (searchData.maxDisplacement && searchData.maxDisplacement != 4) {
            filter.air_displacement = searchData.minDisplacement + ',' + (searchData.maxDisplacement + randomNum);
        }
        else {
            filter.air_displacement = searchData.minDisplacement + ',' + (99 + randomNum);
        }
        switch (searchData.fuelType) {
            case 1:
                filter.fuel_type = '1';
                break;
            case 2:
                filter.fuel_type = '2';
                break;
            case 3:
                filter.fuel_type = '3';
                break;
            case 4:
                filter.fuel_type = '4';
                break;
            default: break;
        }
        switch (searchData.emission) {
            case 3:
                filter.emission = '3,4,5';
                break;
            case 4:
                filter.emission = '3,4,5';
                break;
            case 5:
                filter.emission = '4,5';
                break;
            case 6:
                filter.emission = '5';
                break;
            default: break;
        }
        switch (searchData.countryType) {
            case 1:
                filter.guobie = '1';
                break;
            case 2:
                filter.guobie = '2';
                break;
            case 3:
                filter.guobie = '3';
                break;
            case 4:
                filter.guobie = '4';
                break;
            case 5:
                filter.guobie = '5';
                break;
            case 6:
                filter.guobie = '6';
                break;
            default: break;
        }
        switch (searchData.carColor) {
            case 1:
                filter.car_color = '1';
                break;
            case 2:
                filter.car_color = '2';
                break;
            case 3:
                filter.car_color = '3';
                break;
            case 6:
                filter.car_color = '6';
                break;
            case 7:
                filter.car_color = '7';
                break;
            case 10:
                filter.car_color = '10';
                break;
            default: break;
        }
        var starConfig = searchData.starConfig.concat();
        if (starConfig.indexOf(1) > -1) {
            filter.tag_types = '4';
        }
        if (starConfig.indexOf(2) > -1) {
            if (filter.tag_types) {
                filter.tag_types += ',';
            }
            else {
                filter.tag_types = '';
            }
            filter.tag_types += '15';
        }
        if (starConfig.indexOf(3) > -1) {
            if (filter.tag_types) {
                filter.tag_types += ',';
            }
            else {
                filter.tag_types = '';
            }
            filter.tag_types += '37';
        }
        if (starConfig.indexOf(4) > -1) {
            if (filter.tag_types) {
                filter.tag_types += ',';
            }
            else {
                filter.tag_types = '';
            }
            filter.tag_types += '18';
        }
        if (starConfig.indexOf(5) > -1) {
            filter.bright_spot_config = '3';
        }
        if (starConfig.indexOf(6) > -1) {
            if (filter.bright_spot_config) {
                filter.bright_spot_config += ',';
            }
            else {
                filter.bright_spot_config = '';
            }
            filter.bright_spot_config += '1';
        }
        if (starConfig.indexOf(7) > -1) {
            if (filter.bright_spot_config) {
                filter.bright_spot_config += ',';
            }
            else {
                filter.bright_spot_config = '';
            }
            filter.bright_spot_config += '7';
        }
        switch (searchData.sortType) {
            case 1:
                filter.order = '1';
                break;
            case 2:
                filter.order = '5';
                break;
            case 3:
                filter.order = '4';
                break;
            default: break;
        }
        return filter;
    }
    if (type === 'rr') {
        if (!searchData.city || !searchData.cityId.rr || !searchData.cityId.rr.city) {
            return { temp: true };
        }
        var filter = {};
        if (searchData.brandName && searchData.brandId && searchData.brandId.rr && searchData.brandId.rr.name) {
            filter.brand = searchData.brandId.rr.name;
        }
        else if (searchData.brandName) {
            return { temp: true };
        }
        if (searchData.seriesName && searchData.seriesID && searchData.seriesID.rr && searchData.seriesID.rr.name && filter.brand) {
            filter.car_series = searchData.seriesID.rr.name;
        }
        else if (searchData.seriesName) {
            return { temp: true };
        }
        if (searchData.maxPrice && searchData.maxPrice != 50) {
            filter.price = searchData.minPrice + '-' + searchData.maxPrice;
        }
        else {
            filter.price = searchData.minPrice + '-9999';
        }
        switch (searchData.autoType) {
            case 1:
                filter.level = 'jiao';
                break;
            case 2:
                filter.level = 'suv';
                break;
            case 3:
                filter.level = 'mpv';
                break;
            case 4:
                filter.level = 'pao';
                break;
            case 7:
                filter.level = 'mian';
                break;
            case 8:
                filter.level = 'pika';
                break;
            default: break;
        }
        switch (searchData.gearbox) {
            case 1:
                filter.gearbox = 'MT';
                break;
            case 2:
                filter.gearbox = 'AT';
                break;
            default: break;
        }
        switch (searchData.drive) {
            case 3:
                filter.drive = '4';
                break;
            default: break;
        }
        if (searchData.maxAge && searchData.maxAge != 6) {
            filter.age = searchData.minAge + '-' + searchData.maxAge;
        }
        else {
            filter.age = searchData.minAge + '-99';
        }
        if (searchData.maxMileage && searchData.maxMileage != 14) {
            filter.mileage = searchData.minMileage + '-' + searchData.maxMileage;
        }
        else {
            filter.mileage = searchData.minMileage + '-9999';
        }
        if (searchData.maxDisplacement && searchData.maxDisplacement != 4) {
            filter.displacement = searchData.minDisplacement + '-' + searchData.maxDisplacement;
        }
        else {
            filter.displacement = searchData.minDisplacement + '-99';
        }
        switch (searchData.fuelType) {
            case 1:
                filter.fuel_type = 'qy';
                break;
            case 2:
                filter.fuel_type = 'cy';
                break;
            case 3:
                filter.fuel_type = 'dd';
                break;
            case 4:
                filter.fuel_type = 'yd';
                break;
            default: break;
        }
        switch (searchData.emission) {
            case 3:
                filter.emission = '3,4,5';
                break;
            case 4:
                filter.emission = '4,5';
                break;
            case 5:
                filter.emission = '5';
                break;
            case 6: return { temp: true };
            default: break;
        }
        switch (searchData.countryType) {
            case 1:
                filter.brand_country = 'f';
                break;
            case 2:
                filter.brand_country = 'm';
                break;
            case 3:
                filter.brand_country = 'gc';
                break;
            case 4:
                filter.brand_country = 'd';
                break;
            case 5:
                filter.brand_country = 'r';
                break;
            case 6:
                filter.brand_country = 'h';
                break;
            default: break;
        }
        switch (searchData.carColor) {
            case 1:
                filter.car_color = '黑色';
                break;
            case 2:
                filter.car_color = '白色';
                break;
            case 3:
                filter.car_color = '银灰色';
                break;
            case 6:
                filter.car_color = '红色';
                break;
            case 7:
                filter.car_color = '蓝色';
                break;
            case 10:
                filter.car_color = '橙色';
                break;
            default: break;
        }
        var starConfig = searchData.starConfig.concat();
        if (starConfig.indexOf(1) > -1) {
            filter.special_tags = '1';
        }
        if (starConfig.indexOf(2) > -1) {
            if (filter.special_tags) {
                filter.special_tags += ',';
            }
            else {
                filter.special_tags = '';
            }
            filter.special_tags += '8';
        }
        if (starConfig.indexOf(3) > -1) {
            if (filter.special_tags) {
                filter.special_tags += ',';
            }
            else {
                filter.special_tags = '';
            }
            filter.special_tags += '4';
        }
        if (starConfig.indexOf(4) > -1) {
            if (filter.special_tags) {
                filter.special_tags += ',';
            }
            else {
                filter.special_tags = '';
            }
            filter.special_tags += '32';
        }
        if (starConfig.indexOf(5) > -1) {
            filter.star_config = '3';
        }
        if (starConfig.indexOf(6) > -1) {
            if (filter.star_config) {
                filter.star_config += ',';
            }
            else {
                filter.star_config = '';
            }
            filter.star_config += '8';
        }
        if (starConfig.indexOf(7) > -1) {
            if (filter.star_config) {
                filter.star_config += ',';
            }
            else {
                filter.star_config = '';
            }
            filter.star_config += '13';
        }
        switch (searchData.sortType) {
            case 1:
                filter.sort = 'price';
                break;
            case 2:
                filter.sort = 'mileage';
                break;
            case 3:
                filter.sort = 'licensed_date';
                break;
            default: break;
        }
        return filter;
    }
    if (type === 'yx') {
        if (!searchData.city || !searchData.cityId.yx || !searchData.cityId.yx.cityid || !searchData.cityId.yx.provinceid) {
            return [{ temp: true }];
        }
        var filterList = [];
        var filter = {};
        filter.provinceid = searchData.cityId.yx.provinceid;
        if (searchData.brandName && searchData.brandId && searchData.brandId.yx && searchData.brandId.yx.brandid) {
            filter.brandid = searchData.brandId.yx.brandid;
        }
        else if (searchData.brandName) {
            return [{ temp: true }];
        }
        if (searchData.seriesName && searchData.seriesID && searchData.seriesID.yx && searchData.seriesID.yx.serieid && filter.brandid) {
            filter.serieid = searchData.seriesID.yx.serieid;
        }
        else if (searchData.seriesName) {
            return [{ temp: true }];
        }
        filter.pricemin = searchData.minPrice;
        if (searchData.maxPrice && searchData.maxPrice != 50) {
            filter.pricemax = searchData.maxPrice;
        }
        else {
            filter.pricemax = '9999';
        }
        switch (searchData.gearbox) {
            case 1:
                filter.gearbox = '2';
                break;
            case 2:
                filter.gearbox = '1';
                break;
            default: break;
        }
        switch (searchData.drive) {
            case 3:
                filter.drive = '3';
                break;
            default: break;
        }
        filter.agemin = searchData.minAge;
        if (searchData.maxAge && searchData.maxAge != 6) {
            filter.agemax = searchData.maxAge;
        }
        else {
            filter.agemax = '99';
        }
        filter.mileagemin = searchData.minMileage;
        if (searchData.maxMileage && searchData.maxMileage != 14) {
            filter.mileagemax = searchData.maxMileage;
        }
        else {
            filter.mileagemax = '9999';
        }
        filter.displacementmin = searchData.minDisplacement;
        if (searchData.maxDisplacement && searchData.maxDisplacement != 4) {
            filter.displacementmax = searchData.maxDisplacement;
        }
        else {
            filter.displacementmax = '99';
        }
        switch (searchData.fuelType) {
            case 1:
                filter.fueltype = '1';
                break;
            case 2:
                filter.fueltype = '2';
                break;
            case 3:
                filter.fueltype = '3';
                break;
            case 4:
                filter.fueltype = '4';
                break;
            default: break;
        }
        switch (searchData.emission) {
            case 3:
                filter.emission_standard = '3';
                break;
            case 4:
                filter.emission_standard = '4';
                break;
            case 5:
                filter.emission_standard = '5';
                break;
            case 6:
                filter.emission_standard = '6';
                break;
            default: break;
        }
        switch (searchData.countryType) {
            case 1:
                filter.country_type = '5';
                break;
            case 2:
                filter.country_type = '4';
                break;
            case 3:
                filter.country_type = '6';
                break;
            case 4:
                filter.country_type = '1';
                break;
            case 5:
                filter.country_type = '2';
                break;
            case 6:
                filter.country_type = '3';
                break;
            default: break;
        }
        switch (searchData.carColor) {
            case 1:
                filter.color = '1';
                break;
            case 2:
                filter.color = '4';
                break;
            case 3:
                filter.color = '3';
                break;
            case 6:
                filter.color = '8';
                break;
            case 7:
                filter.color = '11';
                break;
            case 10:
                filter.color = '7';
                break;
            default: break;
        }
        var starConfig = searchData.starConfig.concat();
        if (starConfig.indexOf(1) > -1) {
            filter.equal_newcar = '1';
        }
        if (starConfig.indexOf(2) > -1) {
            filter.today_newcar = '1';
        }
        if (starConfig.indexOf(3) > -1) {
            filter.filter_supervalue = '1';
        }
        if (starConfig.indexOf(4) > -1) {
            filter.uxin_auth = '1';
        }
        if (starConfig.indexOf(5) > -1) {
            filter.config_highlight = '82';
        }
        if (starConfig.indexOf(6) > -1) {
            if (filter.config_highlight) {
                filter.config_highlight += ',';
            }
            else {
                filter.config_highlight = '';
            }
            filter.config_highlight += '104';
        }
        if (starConfig.indexOf(7) > -1) {
            if (filter.config_highlight) {
                filter.config_highlight += ',';
            }
            else {
                filter.config_highlight = '';
            }
            filter.config_highlight += '185';
        }
        switch (searchData.sortType) {
            case 1:
                filter.orderprice = '1';
                break;
            case 2:
                filter.ordermileage = '1';
                break;
            case 3:
                filter.orderage = '1';
                break;
            default: break;
        }
        switch (searchData.autoType) {
            case 1:
                var filter1 = __assign(__assign({}, filter), { category: '0', structure: '2' });
                filterList.push(filter1);
                var filter2 = __assign(__assign({}, filter), { category: '0', structure: '1' });
                filterList.push(filter2);
                break;
            case 2:
                filter.category = '8';
                filter.structure = '0';
                filterList.push(filter);
                break;
            case 3:
                filter.category = '7';
                filter.structure = '0';
                filterList.push(filter);
                break;
            case 4:
                filter.category = '9';
                filter.structure = '0';
                filterList.push(filter);
                break;
            case 7:
                filter.category = '10';
                filter.structure = '0';
                filterList.push(filter);
                break;
            case 8:
                filter.category = '11';
                filter.structure = '0';
                filterList.push(filter);
                break;
            default:
                filterList.push(filter);
                break;
        }
        return filterList;
    }
    return { temp: true };
};
exports.default = { transformFilter: transformFilter };
