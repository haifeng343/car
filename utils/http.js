"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpAddress_js_1 = require("./httpAddress.js");
var baseUrl = httpAddress_js_1.default_address;
var get = function (url, data) {
    if (data === void 0) { data = {}; }
    return request(url, 'GET', data);
};
var post = function (url, data, header) {
    if (data === void 0) { data = {}; }
    return request(url, 'POST', data, header);
};
var del = function (url, data, header) {
    if (data === void 0) { data = {}; }
    return request(url, 'DELETE', data, header);
};
var put = function (url, data, header) {
    if (data === void 0) { data = {}; }
    return request(url, 'PUT', data, header);
};
var request = function (url, method, data, header) {
    if (method === void 0) { method = 'GET'; }
    if (data === void 0) { data = {}; }
    if (header === void 0) { header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }; }
    var token = wx.getStorageSync('token');
    if (url.startsWith('/')) {
        url = "" + baseUrl + url;
        data = Object.assign({
            token: token
        }, data);
    }
    var requestData = {};
    if (data) {
        Object.keys(data)
            .filter(function (key) {
            return typeof data[key] !== 'undefined' &&
                data[key] !== null &&
                data[key] !== 'undefined';
        })
            .forEach(function (key) { return (requestData[key] = data[key]); });
    }
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            method: method,
            header: header,
            data: requestData,
            success: function (resp) {
                if (resp.statusCode !== 200) {
                    return reject({
                        code: resp.statusCode,
                        message: '接口请求失败'
                    });
                }
                var data = resp.data;
                if (typeof data.code === 'number') {
                    if (data.code !== 200) {
                        return reject({
                            code: data.code,
                            message: data.resultMsg,
                            data: data.data
                        });
                    }
                }
                resolve(data);
            },
            fail: function () {
                reject({
                    message: '你的网络可能开小差了~'
                });
            }
        });
    });
};
var Http = {
    get: get,
    post: post,
    del: del,
    put: put,
    request: request
};
exports.default = Http;
