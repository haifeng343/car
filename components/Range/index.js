"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx_1 = require("../../rx/rx");
var data_1 = require("./data");
Component({
    data: new data_1.default(),
    properties: {
        min: {
            type: Number,
            value: 0,
            observer: function (newvalue) {
                var _this_1 = this;
                var _this = this;
                if (_this.isTouchEnd === true) {
                    this.calcLeftX(newvalue);
                    _this.minValue = newvalue;
                    wx.nextTick(function () {
                        _this_1.setData({
                            distanceStyle: "left:" + _this_1.data.leftX + "px;width:" + (_this_1.data
                                .rightX - _this_1.data.leftX) + "px;"
                        });
                        _this_1.calcIcon();
                    });
                }
            }
        },
        max: {
            type: Number,
            value: 10000,
            observer: function (newvalue) {
                var _this_1 = this;
                var _this = this;
                if (_this.isTouchEnd === true) {
                    this.calcRightX(newvalue);
                    _this.maxValue = newvalue;
                    wx.nextTick(function () {
                        _this_1.setData({
                            distanceStyle: "left:" + _this_1.data.leftX + "px;width:" + (_this_1.data
                                .rightX - _this_1.data.leftX) + "px;"
                        });
                        _this_1.calcIcon();
                    });
                }
            }
        },
        maxStep: {
            type: Number,
            value: 10000
        },
        minStep: {
            type: Number,
            value: 0
        },
        step: {
            type: Number,
            value: 100
        },
        tick: {
            type: Array,
            value: []
        }
    },
    methods: {
        handleLeftTouchStart: function () {
            var _this = this;
            _this.moveDirectionStream.next('left');
            _this.moveDirection = 'left';
            _this.touchendStream.next(false);
        },
        handleLeftTouchMove: function (event) {
            var leftX = event.value;
            var _this = this;
            if (_this.eventId < event.id) {
                _this.eventId = event.id;
                _this.touchmoveStream.next(leftX);
                this.setData({
                    leftX: leftX
                });
            }
        },
        handleTouchEnd: function () {
            var _this = this;
            _this.touchendStream.next(true);
        },
        handleRightTouchStart: function () {
            var _this = this;
            _this.moveDirection = 'right';
            _this.moveDirectionStream.next('right');
            _this.touchendStream.next(false);
        },
        handleRightTouchMove: function (event) {
            var rightX = event.value;
            var _this = this;
            if (_this.eventId < event.id) {
                _this.eventId = event.id;
                _this.touchmoveStream.next(rightX);
                this.setData({
                    rightX: rightX
                });
            }
        },
        calcIcon: function () {
            var _a = this.data, leftX = _a.leftX, rightX = _a.rightX, containerWidth = _a.containerWidth, stepWidth = _a.stepWidth;
            var leftIcon = 'uniE953';
            var rightIcon = 'uniE954';
            if (leftX > 0) {
                leftIcon = 'uniE955';
            }
            if (rightX < containerWidth) {
                rightIcon = 'uniE955';
            }
            if (rightX - leftX - stepWidth < 0.01) {
                leftIcon = 'uniE954';
                rightIcon = 'uniE953';
            }
            this.setData({ leftIcon: leftIcon, rightIcon: rightIcon });
        },
        calcLeftX: function (min) {
            var leftX = this.calcX(min);
            this.setData({
                leftX: leftX,
                leftStyle: "transform: translateX(" + leftX + "px);"
            });
        },
        calcRightX: function (max) {
            var rightX = this.calcX(max);
            this.setData({
                rightX: rightX,
                rightStyle: "transform: translateX(" + rightX + "px);"
            });
        },
        calcX: function (value) {
            var _a = this.data, minStep = _a.minStep, maxStep = _a.maxStep, containerWidth = _a.containerWidth;
            if (value === minStep) {
                return 0;
            }
            return (value / maxStep) * containerWidth;
        }
    },
    lifetimes: {
        ready: function () {
            var _this_1 = this;
            setTimeout(function () {
                var _this = _this_1;
                _this.eventId = 0;
                _this.moveDirection = 'right';
                _this.isTouchEnd = true;
                _this.minValue = _this_1.data.min;
                _this.maxValue = _this_1.data.max;
                _this.touchmoveStream = new rx_1.Subject();
                _this.moveDirectionStream = new rx_1.Subject();
                _this.touchendStream = new rx_1.Subject();
                _this.containerWidthStream = new rx_1.Subject();
                _this.blockWidthStream = new rx_1.Subject();
                _this_1.createSelectorQuery()
                    .select(".move-view")
                    .boundingClientRect(function (rect) {
                    if (rect) {
                        var blockWidth = rect.width;
                        var blockHalfWidth = blockWidth / 2;
                        _this_1.setData({ blockWidth: blockWidth, blockHalfWidth: blockHalfWidth });
                        _this.blockWidthStream.next(blockWidth);
                    }
                })
                    .exec();
                _this.widthSubscription = _this.containerWidthStream.subscribe(function (containerWidth) {
                    var _a = _this_1.data, step = _a.step, maxStep = _a.maxStep, tick = _a.tick, min = _a.min, max = _a.max;
                    var stepWidth = +((step / maxStep) * containerWidth).toFixed(2);
                    var tickList = tick.map(function (item) {
                        if (item === '不限') {
                            return {
                                pos: containerWidth,
                                label: '不限'
                            };
                        }
                        else {
                            return {
                                pos: (+item / maxStep) * containerWidth,
                                label: item
                            };
                        }
                    });
                    _this_1.setData({
                        stepWidth: stepWidth,
                        tickList: tickList
                    });
                    _this_1.calcLeftX(min);
                    _this_1.calcRightX(max);
                    wx.nextTick(function () {
                        _this_1.calcIcon();
                        _this_1.setData({
                            distanceStyle: "left:" + _this_1.data.leftX + "px;width:" + (_this_1.data
                                .rightX - _this_1.data.leftX) + "px;"
                        }, function () {
                            _this_1.setData({ isLoaded: true });
                        });
                    });
                });
                _this_1.createSelectorQuery()
                    .select(".background-line")
                    .boundingClientRect(function (rect) {
                    if (rect) {
                        var containerWidth = rect.width;
                        _this_1.setData({
                            rightX: containerWidth,
                            leftX: 0,
                            containerWidth: containerWidth
                        });
                        _this.containerWidthStream.next(containerWidth);
                    }
                })
                    .exec();
                _this_1.createSelectorQuery()
                    .select(".container")
                    .boundingClientRect(function (rect) {
                    if (rect) {
                        var containerLeft = rect.left;
                        _this_1.setData({
                            containerLeft: containerLeft
                        });
                    }
                })
                    .exec();
                _this.touchmoveSubscription = _this.touchmoveStream
                    .pipe(rx_1.operators.withLatestFrom(_this.moveDirectionStream))
                    .subscribe(function (_a) {
                    var x = _a[0], dir = _a[1];
                    var _b = _this_1.data, stepWidth = _b.stepWidth, step = _b.step;
                    var minValue = _this.minValue, maxValue = _this.maxValue;
                    if (dir === 'left') {
                        var minRound = Math.round(x / stepWidth);
                        minValue = minRound * step;
                        if (minValue >= maxValue) {
                            minValue = maxValue - step;
                        }
                    }
                    else if (dir === 'right') {
                        var maxRound = Math.round(x / stepWidth);
                        maxValue = maxRound * step;
                        if (minValue >= maxValue) {
                            maxValue = minValue + step;
                        }
                    }
                    _this.minValue = minValue;
                    _this.maxValue = maxValue;
                    _this_1.triggerEvent('onChange', {
                        min: minValue,
                        max: maxValue
                    });
                });
                var xStream = _this.touchendStream.pipe(rx_1.operators.tap(function (touchend) { return (_this.isTouchEnd = touchend); }), rx_1.operators.withLatestFrom(_this.touchmoveStream, _this.moveDirectionStream), rx_1.operators.filter(function (_a) {
                    var touchend = _a[0];
                    return touchend === true;
                }), rx_1.operators.map(function (_a) {
                    var x = _a[1], dir = _a[2];
                    return [x, dir];
                }));
                _this.xSubscription = xStream.subscribe(function () {
                    var minValue = _this.minValue, maxValue = _this.maxValue;
                    _this_1.triggerEvent('onChange', {
                        min: minValue,
                        max: maxValue
                    });
                });
            });
        },
        detached: function () {
            var _this = this;
            if (_this.xSubscription) {
                _this.xSubscription.unsubscribe();
            }
            if (_this.touchmoveSubscription) {
                _this.touchmoveSubscription.unsubscribe();
            }
            if (_this.widthSubscription) {
                _this.widthSubscription.unsubscribe();
            }
            _this.touchmoveStream.complete();
            _this.moveDirectionStream.complete();
            _this.touchendStream.complete();
            _this.containerWidthStream.complete();
            _this.blockWidthStream.complete();
        }
    }
});
