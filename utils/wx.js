"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var loginUrl = '/cddLogin/appletLogin.json';
var doWechatLogin = function () {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (resp) {
                return resp.code ? resolve(resp.code) : reject(new Error('no code'));
            },
            fail: function (error) { return reject(error); }
        });
    })
        .then(function (code) {
        return http_1.default.post(loginUrl, { code: code })
            .then(function (resp) { return Promise.resolve(resp.data); })
            .then(function (data) {
            wx.hideLoading();
            var sessionKey = data.session_key;
            wx.setStorageSync('sessionKey', sessionKey);
            return Promise.resolve(data);
        });
    })
        .catch(function (error) {
        if (error.data && error.data.session_key) {
            var sessionKey = error.data.session_key;
            wx.setStorageSync('sessionKey', sessionKey);
        }
        else {
            wx.removeStorageSync('sessionKey');
        }
        return Promise.reject(error);
    });
};
exports.doWechatLogin = doWechatLogin;
var getSessionKey = function () {
    return new Promise(function (resolve) {
        var sessionKey = wx.getStorageSync('sessionKey');
        if (sessionKey) {
            wx.checkSession({
                success: function () {
                    console.log('sessionkey 有效');
                    resolve(sessionKey);
                },
                fail: function () {
                    console.log('sessionkey 无效');
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    }).then(function (sessionKey) {
        console.log("sessionkey \u6709\u503C = " + !!sessionKey);
        if (!sessionKey) {
            return doWechatLogin().then(function (resp) { return resp.session_key; });
        }
        return Promise.resolve(sessionKey);
    });
};
exports.getSessionKey = getSessionKey;
var getLocation = function () {
    return new Promise(function (resolve, reject) {
        wx.getLocation({
            type: 'wgs84',
            success: function (resp) { return resolve(resp); },
            fail: function () { return reject(); }
        });
    });
};
exports.getLocation = getLocation;
var getLocationSetting = function () {
    return new Promise(function (resolve, reject) {
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userLocation'] === false) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting['scope.userLocation'] == true) {
                                            resolve();
                                        }
                                        else {
                                            reject();
                                        }
                                    }
                                });
                            }
                            else {
                                reject();
                            }
                        }
                    });
                }
                else {
                    resolve();
                }
            }
        });
    });
};
exports.getLocationSetting = getLocationSetting;
