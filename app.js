"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatter_1 = require("./formatter/formatter");
var renren_formatter_1 = require("./formatter/renren-formatter");
var http_1 = require("./utils/http");
var auth_1 = require("./utils/auth");
var wx_1 = require("./utils/wx");
var youxin_formatter_1 = require("./formatter/youxin-formatter");
var guazi_formatter_1 = require("./formatter/guazi-formatter");
App({
    globalData: {
        searchData: {
            city: '',
            cityId: {},
            brandName: '',
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
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
            sortType: 0,
            advSort: 0
        },
        monitorSearchData: {
            city: '',
            cityId: {},
            brandName: '',
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
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
            sortType: 0,
            advSort: 0
        },
        monitorDefaultSearchData: {
            city: '',
            cityId: {},
            brandName: '',
            brandId: {},
            seriesName: '',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
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
            sortType: 0,
            advSort: 0
        },
        isUserBindPhone: false,
        isUserBindPublic: false,
        isAuth: false,
        usedCarListData: {
            allCount: 0,
            gzCount: 0,
            yxCount: 0,
            rrCount: 0,
            showCount: 0,
            averagePrice: 0,
            lowPrice: 0,
            lowPriceData: null,
            gzlowPriceData: null,
            yxlowPriceData: null,
            rrlowPriceData: null,
            firstlowPriceData: null,
            enoughList: [],
            ddCoin: 0,
            bindPhone: false,
            bindPublic: false,
            bottomType: 0,
            taskTime: '',
            startTimeName: '',
            monitorId: 0,
            fee: 0,
            totalFee: 0,
            sortType: 0,
            allOriginalData: [],
            sourceData: [],
            gzSelectCount: 0,
            yxSelectCount: 0,
            rrSelectCount: 0,
        }
    },
    onLaunch: function () {
        var _this = this;
        formatter_1.registerFormatter('rr', renren_formatter_1.default);
        formatter_1.registerFormatter('yx', youxin_formatter_1.default);
        formatter_1.registerFormatter('gz', guazi_formatter_1.default);
        wx_1.doWechatLogin()
            .then(function (resp) {
            console.log('登录成功啦');
            var token = resp.token;
            _this.globalData.isAuth = true;
            wx.setStorageSync('token', token);
            auth_1.authSubject.next(true);
            http_1.default.get('/cdd/user/userInfo.json', { token: token }).then(function (resp) {
                _this.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
                _this.globalData.isUserBindPublic = !!resp.data.publicOpenId;
            });
        })
            .catch(function (error) {
            console.error(error);
            console.error('登录失败啦!789');
            _this.globalData.isAuth = false;
        });
    }
});
