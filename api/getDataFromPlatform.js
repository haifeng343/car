"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpAddress_1 = require("../utils/httpAddress");
var md5_1 = require("../utils/md5");
var DEFAULT_PAGE = { size: 50, num: 1 };
var buildParams = function (data, encodeUrl) {
    if (encodeUrl === void 0) { encodeUrl = false; }
    var params = [];
    for (var _i = 0, _a = Object.getOwnPropertyNames(data); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = data[key];
        if (typeof value === 'object') {
            value = JSON.stringify(value);
            params.push(key + '=' + (encodeUrl ? encodeURIComponent(value) : value));
        }
        else if (typeof value !== 'undefined') {
            params.push(key + '=' + (encodeUrl ? encodeURIComponent(value) : value));
        }
    }
    return params.join('&');
};
var appVer = '6.1.6.0';
var baseParams = {
    appid: 12,
    ca_n: 'xiaomimarket01',
    ca_s: 'app_tg',
    customerId: 879,
    deviceId: '866135030723842',
    dpi: '3.0',
    lat: '30.000000',
    lng: '120.000000',
    mac: '50:8f:4c:5b:e5:0a',
    model: 'Redmi Note 4X',
    osv: '7.0',
    platform: 'armeabi-v7a',
    screenWH: '1080X1920',
    versionId: appVer
};
var baseHeaders = {
    'X-Ganji-Agency': 'xiaomimarket01',
    contentformat: 'json2',
    'GjData-Version': '1.0',
    versionId: appVer,
    'X-Ganji-CustomerId': 879,
    'X-Ganji-VersionId': appVer,
    model: 'Redmi Note 4X',
    CustomerId: 879
};
var sign = function (obj) {
    if (obj === void 0) { obj = {}; }
    var keys = Object.keys(obj).sort();
    var signStr = '';
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var val = obj[key] + '';
        val = val.replace(/ /gi, '');
        signStr += key + '=' + encodeURIComponent(val);
    }
    signStr += 'd9628ffb2557c1e9362fd7e88604c3be';
    var sign1 = md5_1.Md5.hashStr(signStr);
    return md5_1.Md5.hashStr(sign1 + 'd9628ffb2557c1e9362fd7e88604c3be');
};
var guazi = {
    searchList: function (city, page, filter) {
        if (page === void 0) { page = DEFAULT_PAGE; }
        if (filter === void 0) { filter = {}; }
        var params = Object.assign({
            city: city,
            city_filter: city,
            guazi_city: city,
            page: page.num,
            pageSize: page.size
        }, baseParams, filter);
        params.sign = sign(params);
        return new Promise(function (resolve, reject) {
            wx.request({
                url: httpAddress_1.guazi_address +
                    '/clientc/post/getCarList' +
                    '?' +
                    buildParams(params, true),
                method: 'GET',
                header: baseHeaders,
                success: function (res) {
                    if (res.statusCode !== 200) {
                        reject({ code: -100, msg: '超时或接口访问失败！' });
                    }
                    else if (res.data && res.data.code >= 0) {
                        resolve(res.data);
                    }
                    else {
                        reject({ code: -200, msg: '接口返回数据有误！' });
                    }
                },
                fail: function () {
                    reject({ code: -100, msg: '超时或接口访问失败！' });
                }
            });
        });
    }
};
exports.guazi = guazi;
var baseParamsRenren = {
    uuid: '75F2FFC0-25E8-42C1-B346-3246C125A726',
    appkey: 'rrc-openapi-xcx-3TT9FFma'
};
var renren = {
    searchList: function (city, page, filter) {
        if (page === void 0) { page = DEFAULT_PAGE; }
        if (filter === void 0) { filter = {}; }
        var params = Object.assign({ city: city, rows: page.size, start: (page.num - 1) * 40 }, baseParamsRenren, filter);
        return new Promise(function (resolve, reject) {
            wx.request({
                url: httpAddress_1.renren_address + '/xcx/search/list' + '?' + buildParams(params, true),
                method: 'GET',
                success: function (res) {
                    if (res.statusCode !== 200) {
                        reject({ code: -100, msg: '超时或接口访问失败！' });
                    }
                    else if (res.data && res.data.status >= 0) {
                        res.data.code = 0;
                        resolve(res.data);
                    }
                    else {
                        reject({ code: -200, msg: '接口返回数据有误！' });
                    }
                },
                fail: function () {
                    reject({ code: -100, msg: '超时或接口访问失败！' });
                }
            });
        });
    }
};
exports.renren = renren;
var signKey = 'm1K5@BcxUn!';
var youxinSign = function (parmas) {
    if (parmas === void 0) { parmas = {}; }
    var keys = Object.keys(parmas).sort();
    var sbArr = [];
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key_1 = keys_2[_i];
        var val = parmas[key_1];
        if (key_1 != 'content_version') {
            var sb = key_1 + '=';
            if (val || val === 0) {
                sb += encodeURIComponent(val + '');
            }
            sbArr.push(sb);
        }
    }
    var key = sbArr.join('&') + signKey;
    var signStr = md5_1.Md5.hashStr(key);
    var str = signStr.charAt(20) +
        signStr.charAt(15) +
        signStr.charAt(0) +
        signStr.charAt(3) +
        signStr.charAt(1) +
        signStr.charAt(5);
    return str;
};
var youxinHeader = {
    'Content-Type': 'application/x-www-form-urlencoded'
};
var youxinbaseParams = {
    app_source: 3,
    appver: '10.15.0',
    channel: 'xiaomi',
    gps_type: 1,
    imei: 866135030723842,
    ip: '192.168.137.25',
    nb: '0b8dac435dff841eeb48a9bafa6913b9',
    net: 'wifi',
    oaid: '67bd3b1a21e58cb1',
    os: 'android',
    source_type: 1,
    sysver: 24,
    uuid: 'c47b7c93-83ce-4f03-8996-376744267497',
    xdid: '6ee251d37b93cb7b961e28ae71a87631'
};
var youxin = {
    searchList: function (city, page, filter) {
        if (page === void 0) { page = DEFAULT_PAGE; }
        if (filter === void 0) { filter = {}; }
        var ts = new Date().getTime();
        var params = Object.assign({}, youxinbaseParams, {
            cityid: city,
            gps_type: '2',
            latitude: '30.276733',
            list_type: '1',
            n_p: "0",
            offset: (page.num - 1) * 20,
            ref: 'HomeFragment',
            search_cityid: city,
            ts: ts,
            url: 'VehicleDetailsActivity'
        }, filter);
        params._apikey = youxinSign(params);
        var bodyStr = buildParams(params, true);
        return new Promise(function (resolve, reject) {
            wx.request({
                url: httpAddress_1.youxin_address + '/car_search/search',
                method: 'POST',
                header: youxinHeader,
                data: bodyStr,
                success: function (res) {
                    if (res.statusCode !== 200) {
                        reject({ code: -100, msg: '超时或接口访问失败！' });
                    }
                    else if (res.data && res.data.code >= 0) {
                        resolve(res.data);
                    }
                    else {
                        reject({ code: -200, msg: '接口返回数据有误！' });
                    }
                },
                fail: function () {
                    reject({ code: -100, msg: '超时或接口访问失败！' });
                }
            });
        });
    }
};
exports.youxin = youxin;
