"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FundPageData = (function () {
    function FundPageData() {
        this.fundList = [];
        this.fundTimeList = [
            {
                value: 1,
                label: '近一周'
            },
            {
                value: 2,
                label: '近一个月'
            },
            {
                value: 3,
                label: '近三个月'
            }
        ];
        this.coinFundTimeList = [
            {
                value: 0,
                label: '全部'
            },
            {
                value: 1,
                label: '近三天'
            },
            {
                value: 2,
                label: '近一周'
            },
            {
                value: 3,
                label: '近一个月'
            }
        ];
        this.fundTypeList = [
            {
                value: 0,
                label: '全部'
            },
            {
                value: 1,
                label: '充值'
            },
            {
                value: 33,
                label: '提现'
            },
            {
                value: 6,
                label: '支付'
            },
            {
                value: 7,
                label: '退款'
            },
            {
                value: 8,
                label: '兑换'
            }
        ];
        this.coinTypeList = [
            {
                value: 0,
                label: '全部'
            },
            {
                value: 1,
                label: '充值'
            },
            {
                value: 2,
                label: '兑换'
            },
            {
                value: 3,
                label: '消耗'
            }
        ];
        this.timeRange = 1;
        this.billType = 0;
        this.fundListType = 1;
        this.isLoaded = false;
    }
    return FundPageData;
}());
exports.default = FundPageData;
