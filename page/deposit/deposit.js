"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_js_1 = require("./service.js");
Page({
    data: {
        pay: [
            {
                disabled: false,
                label: 2,
                value: 200,
                coin: 200
            },
            {
                disabled: false,
                label: 5,
                value: 500,
                coin: 500
            },
            {
                disabled: false,
                label: 10,
                value: 1000,
                coin: 1000
            },
            {
                disabled: false,
                label: 20,
                value: 2000,
                coin: 2000
            },
            {
                disabled: false,
                label: 30,
                value: 3000,
                coin: 5000
            },
            {
                disabled: false,
                label: 50,
                value: 5000,
                coin: 5000
            },
            {
                disabled: true,
                label: 0.01,
                value: 1,
                coin: 1
            }
        ],
        money: 500,
        moneyText: '5.00',
        coin: 500,
        showType: 1,
        exchangeAmount: '',
        userMoney: '0.00',
        freezeMoney: '0.00',
        showConfirmDialog: false
    },
    service: new service_js_1.default(),
    submitFlag: false,
    inputFlag: false,
    exchangeAll: function () {
        this.inputFlag = true;
        this.setData({
            exchangeAmount: (~~this.data.userMoney).toString()
        });
    },
    changeTab: function (event) {
        var type = +event.currentTarget.dataset.type;
        this.setData({
            showType: type
        });
    },
    handleExchange: function () {
        var _this = this;
        var exchangeAmount = ~~this.data.exchangeAmount;
        if (!exchangeAmount) {
            wx.showToast({
                title: '请输入要兑换金额',
                icon: 'none'
            });
        }
        else if (this.submitFlag === false) {
            this.submitFlag = true;
            wx.showLoading({
                title: '正在兑换...',
                mask: true
            });
            this.service
                .doExchangeCoin(exchangeAmount)
                .then(function (_) {
                _this.submitFlag = false;
                wx.showToast({
                    title: '兑换成功!'
                });
                _this.setData({
                    userMoney: (+_this.data.userMoney - exchangeAmount).toFixed(2)
                });
                setTimeout(function () {
                    wx.navigateBack({ delta: 1 });
                }, 1000);
            })
                .catch(function (error) {
                _this.submitFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: "\u5151\u6362\u76EF\u76EF\u5E01\u5931\u8D25,\u8BF7\u8054\u7CFB\u5BA2\u670D!" + error.message,
                    icon: 'none'
                });
            });
        }
    },
    handleSelect: function (event) {
        var _a = event.currentTarget.dataset, money = _a.money, coin = _a.coin;
        this.setData({ money: money, coin: coin, moneyText: (money / 100).toFixed(2) });
    },
    handleInputBlur: function () {
        if (this.inputFlag === true) {
            this.inputFlag = false;
        }
    },
    handleInputFocus: function () {
        if (this.inputFlag === true) {
            this.inputFlag = false;
        }
    },
    handleExchangeAmountChange: function (event) {
        if (this.inputFlag === true) {
            this.inputFlag = false;
            return;
        }
        var value = +event.detail.value;
        if (value) {
            if (value > +this.data.userMoney) {
                this.setData({ exchangeAmount: (~~this.data.userMoney).toString() });
                wx.showToast({
                    title: "\u6700\u591A\u53EF\u4EE5\u5151\u6362" + ~~this.data.userMoney + "\u5143",
                    icon: 'none'
                });
            }
            else {
                this.setData({ exchangeAmount: value.toString() });
            }
        }
        else if (!Number.isNaN(value)) {
            this.setData({ exchangeAmount: '' });
        }
        else {
            this.setData({ exchangeAmount: this.data.exchangeAmount });
        }
    },
    handlePay: function () {
        var _this = this;
        if (this.data.coin === 0) {
            wx.showToast({
                title: "\u8BF7\u5148\u9009\u62E9\u8981\u5145\u503C\u7684\u6570\u91CF",
                icon: 'none'
            });
            return;
        }
        if (this.submitFlag === false) {
            this.submitFlag = true;
            wx.showLoading({
                title: '创建支付订单...',
                mask: true
            });
            this.service
                .createOrder(this.data.money, this.data.coin)
                .then(function (params) {
                wx.hideLoading();
                wx.requestPayment({
                    timeStamp: params.timeStamp,
                    nonceStr: params.nonceStr,
                    package: params.packageIs,
                    signType: 'MD5',
                    paySign: params.paySign,
                    success: function () {
                        _this.submitFlag = false;
                        wx.showToast({
                            title: '支付成功!'
                        });
                        setTimeout(function () {
                            wx.navigateBack({ delta: 1 });
                        }, 1000);
                    },
                    fail: function () {
                        _this.submitFlag = false;
                        wx.hideLoading();
                        wx.showToast({
                            title: '支付失败，请稍后重试',
                            icon: 'none'
                        });
                    }
                });
            })
                .catch(function (error) {
                _this.submitFlag = false;
                wx.hideLoading();
                wx.showToast({
                    title: "\u521B\u5EFA\u652F\u4ED8\u8BA2\u5355\u5931\u8D25,\u8BF7\u8054\u7CFB\u5BA2\u670D!" + error.message,
                    icon: 'none'
                });
            });
        }
    },
    handleShowConfirmdialog: function () {
        var exchangeAmount = ~~this.data.exchangeAmount;
        if (!exchangeAmount) {
            wx.showToast({
                title: '请输入要兑换金额',
                icon: 'none'
            });
        }
        else {
            this.setData({ showConfirmDialog: true });
        }
    },
    getmonitorEndEvent: function () {
        this.setData({ showConfirmDialog: false });
    },
    getmonitorEndConfirmEvent: function () {
        this.setData({ showConfirmDialog: false });
        this.handleExchange();
    },
    onLoad: function (options) {
        var _this = this;
        var type = options.type;
        this.service.getUserInfo().then(function (userInfo) {
            var _a = userInfo.userAccount, useMoney = _a.useMoney, freezeMoney = _a.freezeMoney;
            _this.setData({
                userMoney: useMoney.toFixed(2),
                freezeMoney: freezeMoney.toFixed(2)
            });
        });
        if (type) {
            this.setData({
                showType: +type
            });
        }
    }
});
