"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var fetch = require("../../utils/fecha");
var daysZH = {
    1: '一天',
    2: '两天',
    3: '三天',
    4: '四天',
    5: '五天'
};
var activityCouponId = [12, 13];
var CouponService = (function () {
    function CouponService() {
    }
    CouponService.prototype.getUseableCouponList = function () {
        return http_1.default.get('/cdd/userCoupon/getUsable.json', { couponType: 1 })
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            return resp.map(function (item) {
                return {
                    activity: activityCouponId.includes(item.couponId),
                    couponId: item.couponId,
                    message: "\u9650\u5927\u4E8E" + item.cvalue + "\u5929\u7684\u76D1\u63A7",
                    name: item.cname,
                    status: item.status,
                    id: item.userCouponId,
                    expire: item.expireTime,
                    expireTime: item.expireTime.substr(0, 10),
                    canUse: true,
                    canSelect: true,
                    day: item.cvalue,
                    type: item.ctype
                };
            });
        });
    };
    CouponService.prototype.getUseableFreeCouponList = function () {
        return http_1.default.get('/cdd/userCoupon/getUsable.json', { couponType: 2 })
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            return resp.map(function (item) {
                return {
                    activity: activityCouponId.includes(item.couponId),
                    couponId: item.couponId,
                    message: "\u514D\u8D39\u4F53\u9A8C" + daysZH[item.cvalue] + "\u6536\u8D39\u62A2\u7968\u529F\u80FD",
                    name: item.cname,
                    status: item.status,
                    id: item.userCouponId,
                    expire: item.expireTime,
                    expireTime: item.expireTime.substr(0, 10),
                    canUse: true,
                    canSelect: true,
                    day: item.cvalue,
                    type: item.ctype
                };
            });
        });
    };
    CouponService.prototype.getUseableFDDCouponList = function () {
        return http_1.default.get('/cdd/userCoupon/getUsable.json', { couponType: 3 })
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            return resp.map(function (item) {
                return {
                    activity: activityCouponId.includes(item.couponId),
                    couponId: item.couponId,
                    message: "\u53EF\u5151\u6362" + item.cvalue + "\u76EF\u76EF\u5E01",
                    name: item.cvalue + "\u5E01",
                    status: item.status,
                    id: item.userCouponId,
                    expire: item.expireTime,
                    expireTime: item.expireTime.substr(0, 10),
                    canUse: true,
                    canSelect: true,
                    day: item.cvalue,
                    type: item.ctype
                };
            });
        });
    };
    CouponService.prototype.getUnuseableCouponList = function () {
        return http_1.default.get('/cdd/userCoupon/getExpired.json')
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            return resp.map(function (item) {
                var type = item.ctype;
                var message = type === 1
                    ? "\u9650\u5927\u4E8E" + item.cvalue + "\u5929\u7684\u76D1\u63A7"
                    : type === 2
                        ? "\u514D\u8D39\u4F53\u9A8C" + daysZH[item.cvalue] + "\u6536\u8D39\u62A2\u7968\u529F\u80FD"
                        : "\u53EF\u5151\u6362" + item.cvalue + "\u76EF\u76EF\u5E01";
                var name = type === 3 ? item.cvalue + "\u5E01" : item.cname;
                return {
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
                };
            });
        });
    };
    CouponService.prototype.getCouponList = function () {
        var _this = this;
        var pddList = [];
        var fddList = [];
        return this.getUseableCouponList()
            .then(function (couponList) {
            pddList = couponList;
            return _this.getUseableFDDCouponList();
        })
            .then(function (couponList) { return (fddList = couponList); })
            .then(function (_) {
            var couponList = []
                .concat(pddList)
                .concat(fddList)
                .sort(function (a, b) {
                return fetch.parse(a.expire, 'YYYY-MM-DD HH:mm:ss').getTime() -
                    fetch.parse(b.expire, 'YYYY-MM-DD HH:mm:ss').getTime();
            });
            return Promise.resolve(couponList);
        });
    };
    CouponService.prototype.getData = function (tabValue) {
        var _this = this;
        if (typeof tabValue !== 'number') {
            var tabList_1 = [
                { label: '券包', value: 1 },
                { label: '历史卡券', value: 2 }
            ];
            return this.getUseableFreeCouponList().then(function (freeCouponList) {
                if (freeCouponList.length > 0) {
                    tabList_1.unshift({ label: '卡包', value: 0 });
                }
                return _this.getCouponList().then(function (couponList) {
                    return Promise.resolve({ couponList: couponList, tabList: tabList_1 });
                });
            });
        }
        if (tabValue === 0) {
            return this.getUseableFreeCouponList().then(function (couponList) {
                return Promise.resolve({ couponList: couponList });
            });
        }
        else if (tabValue === 1) {
            return this.getCouponList().then(function (couponList) {
                return Promise.resolve({ couponList: couponList });
            });
        }
        else if (tabValue === 2) {
            return this.getUnuseableCouponList().then(function (couponList) {
                return Promise.resolve({ couponList: couponList });
            });
        }
        return Promise.resolve({ couponList: [], tabList: [] });
    };
    CouponService.prototype.exchangeCoupon = function (userCouponId) {
        return http_1.default.post('/cdd/user/cddUseCoupon.json', { userCouponId: userCouponId });
    };
    return CouponService;
}());
exports.default = CouponService;
