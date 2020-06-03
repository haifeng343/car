"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var DepositService = (function () {
    function DepositService() {
    }
    DepositService.prototype.createOrder = function (money, coinAmount) {
        return http_1.default.post('/wechat/cdd/wxUnifiedOrder.json', {
            money: money,
            coinAmount: coinAmount
        }).then(function (resp) { return Promise.resolve(resp.data); });
    };
    DepositService.prototype.getUserInfo = function () {
        return http_1.default.get('/cdd/user/userInfo.json').then(function (resp) {
            return Promise.resolve(resp.data);
        });
    };
    DepositService.prototype.doExchangeCoin = function (exchangeAmount) {
        return http_1.default.post('/cdd/user/cddExchangeUserCoin.json', {
            exchangeAmount: exchangeAmount
        });
    };
    return DepositService;
}());
exports.default = DepositService;
