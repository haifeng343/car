"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fecha = require("../utils/fecha");
var renrenFormatter = function (data) {
    var result = [];
    for (var _i = 0, _a = data.docs; _i < _a.length; _i++) {
        var p = _a[_i];
        var price = p.price * 10000;
        var firstPay = p.down_payment * 10000;
        var mileage = p.mileage * 10000;
        var licenseDateString = p.licensed_date.substr(0, 10) + ' 00:00:00';
        var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
        var data_1 = {
            title: p.title,
            price: price,
            priceText: p.price + '万',
            thumb: p.search_image_url[0],
            firstPay: firstPay,
            firstPayText: p.down_payment + '万',
            mileage: mileage,
            mileageText: p.mileage + '万公里',
            licensedDate: licensedDate,
            licensedText: p.licensed_date.substr(0, 4) + '年',
            tag: p.tags.map(function (item) { return item.txt; }),
            source: p,
            platform: 'rr',
            carId: p.id
        };
        result.push(data_1);
    }
    return result;
};
exports.default = renrenFormatter;
