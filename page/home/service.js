"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var auth_1 = require("../../utils/auth");
var daysZH = {
    1: "一天",
    2: "两天",
    3: "三天",
    4: "四天",
    5: "五天"
};
var activityCouponId = [12, 13];
var HomeService = (function () {
    function HomeService() {
        this.authSubscription = null;
    }
    HomeService.prototype.getBanner = function () {
        return http_1.default.get("/cdd/banner/index.json");
    };
    HomeService.prototype.getCityList = function () {
        return http_1.default.get('/cityList.json');
    };
    HomeService.prototype.cityDetail = function (cityName) {
        return http_1.default.get('/cityDetail.json', { cityName: cityName });
    };
    HomeService.prototype.auth = function (data) {
        return http_1.default.post("/cddLogin/appletAuth.json", data).then(function (resp) {
            var token = resp.data;
            var app = getApp();
            app.globalData.isAuth = true;
            wx.setStorageSync("token", token);
            auth_1.authSubject.next(true);
        });
    };
    HomeService.prototype.getUnReadCouponList = function () {
        return http_1.default.get("/cdd/userCoupon/getUnRead.json")
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            return resp.map(function (item) {
                var type = item.ctype;
                var message = type === 1
                    ? "\u9650\u5927\u4E8E" + item.cvalue + "\u5929\u7684\u76D1\u63A7"
                    : type === 2
                        ? "\u514D\u8D39\u4F53\u9A8C" + daysZH[item.cvalue] + "\u6536\u8D39\u62A2\u7968\u529F\u80FD"
                        : "\u53EF\u5151\u6362" + item.cvalue + "\u76EF\u76EF\u5E01";
                var name = type === 1
                    ? item.cname
                    : type === 2
                        ? item.cvalue + "\u5929"
                        : item.cvalue + "\u5E01";
                return {
                    activity: activityCouponId.includes(item.couponId),
                    couponId: item.couponId,
                    type: type,
                    message: message,
                    name: name,
                    id: item.userCouponId,
                    expireTime: item.expireTime.substr(0, 10)
                };
            });
        });
    };
    return HomeService;
}());
exports.default = HomeService;
