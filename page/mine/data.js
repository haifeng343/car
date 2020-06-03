"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MinePageData = (function () {
    function MinePageData() {
        this.nickName = '';
        this.mobile = '';
        this.IsMobile = false;
        this.headPortrait = '';
        this.useCoin = 0;
        this.totalMoney = '0.00';
        this.isAuth = false;
        this.showAuthDialog = false;
        this.submitFlag = false;
        this.showShareCard = false;
        this.showTipDialog = false;
        this.shareDesc = '';
        this.couponList = [];
        this.showCouponDialog = false;
        this.couponDesc = '';
    }
    return MinePageData;
}());
exports.default = MinePageData;
