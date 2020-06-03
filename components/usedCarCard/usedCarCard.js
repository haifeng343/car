"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monitor_1 = require("../../utils/monitor");
var rx_1 = require("../../rx/rx");
Component({
    properties: {
        item: {
            type: Object
        },
        movable: {
            type: Boolean,
            value: false
        },
        idx: {
            type: Number
        },
        cardType: {
            type: Number,
            value: 1
        },
        editFlag: {
            type: Boolean,
            observer: function (newValue) {
                if (newValue) {
                    this.setData({
                        x: 30
                    });
                }
                else {
                    var _this = this;
                    _this.touchmoveStream.next(0);
                    _this.touchendStream.next(true);
                }
            }
        },
        singleEditFlag: {
            type: Boolean,
            observer: function (newValue) {
                if (newValue === true) {
                    var _this = this;
                    _this.touchmoveStream.next(0);
                    _this.touchendStream.next(true);
                }
            }
        }
    },
    data: {
        x: 0,
        gzDisplay: 'none',
        plateform: '',
        carid: '',
        cityId: {}
    },
    lifetimes: {
        created: function () {
            var _this_1 = this;
            var _this = this;
            _this.touchmoveStream = new rx_1.BehaviorSubject(0);
            _this.touchendStream = new rx_1.BehaviorSubject(false);
            var moveDirectionStream = _this.touchmoveStream.pipe(rx_1.operators.pairwise(), rx_1.operators.map(function (_a) {
                var p = _a[0], n = _a[1];
                return (n - p >= 0 ? 1 : -1);
            }), rx_1.operators.startWith(1));
            var xStream = _this.touchendStream.pipe(rx_1.operators.withLatestFrom(moveDirectionStream), rx_1.operators.filter(function (_a) {
                var touchend = _a[0];
                return touchend === true;
            }), rx_1.operators.map(function (_a) {
                var direction = _a[1];
                return (direction > 0 ? 0 : -64);
            }));
            _this.xSubscription = xStream.subscribe(function (x) {
                _this_1.setData({ x: x });
            });
        },
        detached: function () {
            var _this = this;
            _this.touchmoveStream.complete();
            _this.touchendStream.complete();
            if (_this.xSubscription) {
                _this.xSubscription.unsubscribe();
            }
        },
        ready: function () {
            var _this_1 = this;
            var num = wx.getStorageSync('autoswiperNum');
            if (this.properties.idx == 0 && !num && this.properties.movable) {
                wx.setStorageSync('autoswiperNum', 1);
                this.setData({
                    x: -64
                });
                setTimeout(function () {
                    _this_1.setData({
                        x: 0
                    });
                }, 2000);
            }
        }
    },
    methods: {
        handleMovableChange: function (e) {
            if (this.properties.editFlag) {
                return;
            }
            if (e.detail.source === 'touch') {
                var _this = this;
                var x = e.detail.x;
                if (x > 0) {
                    x = 0;
                }
                if (x < -64) {
                    x = -64;
                }
                _this.touchmoveStream.next(x);
            }
        },
        handleTouchend: function () {
            if (this.data.editFlag) {
                return;
            }
            var _this = this;
            _this.touchendStream.next(true);
        },
        goToPlatformDetail: function (e) {
            var app = getApp();
            var plateform = e.currentTarget.dataset.platform;
            var carid = e.currentTarget.dataset.carid;
            var data = this.data.cardType == 1
                ? app.globalData.searchData
                : app.globalData.monitorSearchData;
            if (this.properties.editFlag) {
                this.selectItem(e);
                return;
            }
            if (plateform === 'gz') {
                var num = wx.getStorageSync('gzjumpfirst');
                if (!num) {
                    wx.setStorageSync('gzjumpfirst', 1);
                    this.setData({
                        gzDisplay: 'block',
                        plateform: plateform,
                        carid: carid,
                        cityId: data.cityId
                    });
                }
                else {
                    monitor_1.navigateToProgram(plateform, carid, data.cityId);
                }
            }
            else {
                monitor_1.navigateToProgram(plateform, carid, data.cityId);
            }
        },
        delItem: function (e) {
            var detail = {
                index: e.currentTarget.dataset.index
            };
            this.triggerEvent('deleteEvent', detail);
        },
        selectItem: function (e) {
            var detail = {
                index: e.currentTarget.dataset.index
            };
            this.triggerEvent('selectItemEvent', detail);
        },
        getJumpCancel: function () {
            this.setData({ gzDisplay: 'none' });
        },
        getJumpConfirm: function () {
            this.setData({ gzDisplay: 'none' });
            monitor_1.navigateToProgram(this.data.plateform, this.data.carid, this.data.cityId);
        }
    }
});
