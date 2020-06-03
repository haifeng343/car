"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var auth_1 = require("../../utils/auth");
var daysZH = {
    1: '一天',
    2: '两天',
    3: '三天',
    4: '四天',
    5: '五天'
};
var activityCouponId = [12, 13];
var UserService = (function () {
    function UserService() {
        this.authSubscription = null;
    }
    UserService.prototype.requestShare = function () {
        return http_1.default.post('/cdd/user/cddDailyShareBack.json')
            .then(function (resp) { return Promise.resolve(resp.data); })
            .then(function (item) {
            var type = item.ctype;
            var message = type === 1
                ? "\u9650\u5927\u4E8E" + item.cvalue + "\u5929\u7684\u76D1\u63A7"
                : type === 2
                    ? "\u514D\u8D39\u4F53\u9A8C" + daysZH[item.cvalue] + "\u6536\u8D39\u62A2\u7968\u529F\u80FD"
                    : "\u53EF\u5151\u6362" + item.cvalue + "\u76EF\u76EF\u5E01";
            var name = type === 3 ? item.cvalue + "\u5E01" : item.cname;
            return Promise.resolve([
                {
                    activity: activityCouponId.includes(item.couponId),
                    couponId: item.couponId,
                    message: message,
                    name: name,
                    status: item.status,
                    id: item.userCouponId,
                    expire: item.expireTime,
                    expireTime: item.expireTime.substr(0, 10),
                    canUse: false,
                    canSelect: false,
                    day: item.cvalue,
                    type: type
                }
            ]);
        });
    };
    UserService.prototype.checkFirstShare = function () {
        return http_1.default.get('/cdd/user/checkCddDailyShare.json').then(function (resp) { return resp.data; });
    };
    UserService.prototype.getBalance = function () {
        return http_1.default.get('/user/account/getAccountBalance.json').then(function (resp) {
            var money = resp.data;
            return Promise.resolve(money);
        });
    };
    UserService.prototype.getUserInfo = function () {
        return http_1.default.get('/cdd/user/userInfo.json')
            .then(function (resp) { return Promise.resolve(resp.data); })
            .then(function (userInfo) {
            var _a = userInfo.userBase, nickname = _a.nickname, mobile = _a.mobile, headPortrait = _a.headPortrait;
            var useableMoney = userInfo.userAccount.useMoney.toFixed(2);
            var useCoin = userInfo.coinAccount.useCoin;
            var app = getApp();
            app.globalData.isUserBindPhone = userInfo.phone;
            app.globalData.isUserBindPublic = userInfo.public;
            var totalMoney = (+useableMoney + userInfo.userAccount.freezeMoney).toFixed(2);
            return Promise.resolve({
                nickName: nickname,
                mobile: mobile,
                headPortrait: headPortrait,
                totalMoney: totalMoney,
                useableMoney: useableMoney,
                useCoin: useCoin
            });
        });
    };
    UserService.prototype.auth = function (data) {
        return http_1.default.post('/cddLogin/appletAuth.json', data).then(function (resp) {
            var token = resp.data;
            var app = getApp();
            app.globalData.isAuth = true;
            wx.setStorageSync('token', token);
            auth_1.authSubject.next(true);
        });
    };
    UserService.prototype.getCouponCount = function () {
        return http_1.default.get('/cdd/userCoupon/getUsable.json', { couponType: 3 })
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (couponList) { return Promise.resolve(couponList.length); });
    };
    return UserService;
}());
exports.default = UserService;
