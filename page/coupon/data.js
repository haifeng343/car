"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CouponPageData = (function () {
    function CouponPageData() {
        this.tabList = [];
        this.currentTabValue = null;
        this.couponList = [];
        this.isLoaded = false;
        this.userCouponId = -1;
        this.showActionDialog = false;
        this.currentCouponValue = 0;
    }
    return CouponPageData;
}());
exports.default = CouponPageData;
