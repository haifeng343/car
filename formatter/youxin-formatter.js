"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fecha = require("../utils/fecha");
var youxinFormatter = function (data) {
    var result = [];
    for (var _i = 0, _a = data.list; _i < _a.length; _i++) {
        var p = _a[_i];
        var price = +p.price.replace('万', '') * 10000;
        var firstPay = +p.shoufu_price.replace('首付', '').replace('万', '') * 10000;
        var mileage = +p.mileage.replace('万', '') * 10000;
        var licenseDateString = p.carnotime + ' 00:00:00';
        var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
        var data_1 = {
            title: p.carserie + p.carname,
            price: price,
            priceText: p.price,
            thumb: p.carimg,
            firstPay: firstPay,
            firstPayText: firstPay === 0 ? '0万' : p.shoufu_price.replace('首付', ''),
            mileage: mileage,
            mileageText: p.mileage + '公里',
            licensedDate: licensedDate,
            licensedText: p.carnotime.substr(0, 4) + '年',
            tag: p.tags_sort.map(function (item) { return item.name; }),
            source: p,
            platform: 'yx',
            carId: p.carid
        };
        result.push(data_1);
    }
    return result;
};
exports.default = youxinFormatter;
