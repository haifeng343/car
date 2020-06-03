"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx_1 = require("../../rx/rx");
Component({
    properties: {
        item: {
            type: Object,
            value: {}
        },
        ddCoin: {
            type: Number
        }
    },
    data: {
        x: 0
    },
    lifetimes: {
        created: function () {
            var _this_1 = this;
            var _this = this;
            _this.touchmoveStream = new rx_1.BehaviorSubject(0);
            _this.touchendStream = new rx_1.BehaviorSubject(false);
            var moveDirectionStream = _this.touchmoveStream.pipe(rx_1.operators.pairwise(), rx_1.operators.map(function (_a) {
                var p = _a[0], n = _a[1];
                return (n - p > 0 ? 1 : -1);
            }), rx_1.operators.startWith(1));
            var xStream = _this.touchendStream.pipe(rx_1.operators.withLatestFrom(moveDirectionStream), rx_1.operators.filter(function (_a) {
                var touchend = _a[0];
                return touchend === true;
            }), rx_1.operators.map(function (_a) {
                var direction = _a[1];
                return (direction > 0 ? 0 : -67);
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
        }
    },
    methods: {
        handleMovableChange: function (e) {
            var _this = this;
            if (e.detail.source === 'touch') {
                _this.touchmoveStream.next(e.detail.x);
            }
        },
        handleTouchend: function () {
            var _this = this;
            _this.touchendStream.next(true);
        },
        handleClick: function (e) {
            var detail = {
                index: e.currentTarget.dataset.index,
                type: e.currentTarget.dataset.type
            };
            this.triggerEvent('clickEvent', detail);
        },
        delItem: function (e) {
            var detail = {
                index: e.currentTarget.dataset.index
            };
            this.triggerEvent('clickDelete', detail);
        },
        openTask: function (e) {
            var detail = {
                index: e.currentTarget.dataset.index
            };
            this.triggerEvent('clickOpen', detail);
        },
        recharge: function (e) {
            var detail = {
                type: e.currentTarget.dataset.type
            };
            this.triggerEvent('clickRecharge', detail);
        }
    }
});
