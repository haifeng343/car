"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5_1 = require("./md5");
var http_1 = require("./http");
var key = 'DR3BZ-H4SLR-EICWG-WGVGO-37IC6-5DBUA';
var secret = 'yF1RvcDhPWJi63Zy3A1RfJPR4ClxbcXh';
var getLocationInfo = function (location) {
    var latitude = location.latitude, longitude = location.longitude;
    var sig = md5_1.Md5.hashStr("/ws/geocoder/v1/?key=" + key + "&location=" + latitude + "," + longitude + secret);
    return http_1.default.request("https://apis.map.qq.com/ws/geocoder/v1/?key=" + key + "&location=" + latitude + "," + longitude + "&sig=" + sig, 'GET', {}, {});
};
exports.getLocationInfo = getLocationInfo;
