"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fecha = require("../utils/fecha");
var guaziFormatter = function (data) {
    var result = [];
    for (var _i = 0, _a = data.postList; _i < _a.length; _i++) {
        var p = _a[_i];
        var price = +p.price.replace('万', '') * 10000;
        var firstPay = +p.first_pay.replace('万', '') * 10000;
        var mileage = p.road_haul.includes('万公里')
            ? +p.road_haul.replace('万公里', '') * 10000
            : +(+p.road_haul.replace('公里', '') / 10000).toFixed(2);
        var licenseDateString = p.license_date.replace('年', '') + '-01-01 00:00:00';
        var licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss');
        var data_1 = {
            title: p.title,
            price: price,
            priceText: p.price,
            thumb: p.thumb_img,
            firstPay: firstPay,
            firstPayText: p.first_pay,
            mileage: mileage,
            mileageText: p.road_haul,
            licensedDate: licensedDate,
            licensedText: p.license_date,
            tag: p.list_tags ? p.list_tags.map(function (item) { return item.text; }) : [],
            source: p,
            platform: 'gz',
            carId: p.puid
        };
        result.push(data_1);
    }
    return result;
};
exports.default = guaziFormatter;
