"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var fundIconMap = {
    '1': 'uniE905',
    '6': 'uniE906',
    '7': 'uniE95F',
    '8': 'uniE93C',
    '33': 'uniE93B'
};
var coinFundIcon = {
    '1': 'uniE93B',
    '2': 'uniE93C',
    '3': 'uniE962',
    '4': 'uniE960',
    '5': 'uniE963',
    '6': 'uniE93C',
    '7': 'uniE969',
    '8': 'uniE96C'
};
var platformNameMap = {
    '1': '票盯盯',
    '2': '房盯盯',
    '3': '车盯盯'
};
var platformClassMap = {
    '1': 'pdd',
    '2': 'fdd',
    '3': 'cdd'
};
var FundService = (function () {
    function FundService() {
    }
    FundService.prototype.getFundList = function (timeRange, billType) {
        return http_1.default.get('/cdd/user/getFundLog.json', { timeRange: timeRange, billType: billType })
            .then(function (resp) { return Promise.resolve(resp.data) || {}; })
            .then(function (resp) {
            return Promise.resolve(resp.out.map(function (item) {
                var fundItem = {
                    orderNo: item.orderNo,
                    platformType: item.platformType,
                    platformName: platformNameMap[item.platformType] || '未知来源',
                    platformClass: platformClassMap[item.platformType] || 'unkclass',
                    moneyText: item.money.toFixed(2),
                    icon: fundIconMap[item.type],
                    logName: item.logName,
                    direction: item.direction,
                    type: item.type,
                    createTime: item.createTime,
                    remark: item.remark
                };
                if (item.type === 6 || item.type === 7) {
                    fundItem.desc = item.remark;
                }
                var logList = resp.in &&
                    resp.in
                        .filter(function (item) { return item.orderNo === fundItem.orderNo; })
                        .map(function (item) { return ({
                        createTime: item.createTime,
                        remark: item.remark
                    }); });
                if (logList && logList.length > 0) {
                    fundItem.logList = logList;
                }
                return fundItem;
            }));
        });
    };
    FundService.prototype.getCoinFundList = function (timeRange, billType) {
        return http_1.default.get('/cdd/user/getUserCoinLog.json', { timeRange: timeRange, billType: billType })
            .then(function (resp) { return Promise.resolve(resp.data); })
            .then(function (fundlist) {
            return Promise.resolve(fundlist.out.map(function (item) {
                var fundItem = {
                    orderNo: item.orderNo,
                    platformType: item.platformType,
                    platformName: platformNameMap[item.platformType] || '未知来源',
                    platformClass: platformClassMap[item.platformType] || 'unkclass',
                    moneyText: item.optCoin + "\u5E01",
                    icon: coinFundIcon[item.type],
                    logName: item.logName,
                    direction: item.direction,
                    type: item.type,
                    createTime: item.createTime,
                    remark: item.remark
                };
                var payList = fundlist.in &&
                    fundlist.in
                        .filter(function (item) { return item.orderNo === fundItem.orderNo; })
                        .map(function (item) { return ({
                        createTime: item.createTime,
                        moneyText: item.optCoin + "\u5E01"
                    }); });
                if (payList && payList.length > 0) {
                    fundItem.payList = payList;
                }
                return fundItem;
            }));
        });
    };
    return FundService;
}());
exports.default = FundService;
