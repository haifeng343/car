"use strict";
Component({
    data: {
        currentPanel: '',
        animationFlag: false,
        showTopPanel: false,
        minPrice: 0,
        maxPrice: 50,
        sortList: [
            {
                label: '车价最低',
                value: 1,
                active: false
            },
            {
                label: '车价最高',
                value: 11,
                active: false
            },
            {
                label: '车龄最小',
                value: 2,
                active: false
            },
            {
                label: '里程最少',
                value: 3,
                active: false
            },
            {
                label: '首付最低',
                value: 4,
                active: false
            }
        ],
        filterList: [
            {
                title: '排序',
                action: 'sort',
                class: '',
                active: false,
                id: 1
            },
            {
                title: '品牌',
                action: 'brand',
                class: '',
                active: false,
                id: 2
            },
            {
                title: '车价',
                action: 'price',
                class: '',
                active: false,
                id: 3
            },
            {
                title: '筛选',
                action: 'advance',
                class: '',
                active: false,
                id: 4
            }
        ]
    },
    properties: {
        type: {
            type: Number,
            value: 1
        },
        data: {
            type: Object,
            value: {},
            observer: function (newvalue) {
                if (newvalue) {
                    var minPrice = newvalue.minPrice, maxPrice = newvalue.maxPrice, advSort_1 = newvalue.advSort;
                    var sortList = this.data.sortList;
                    this.setData({
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        sortList: sortList.map(function (item) {
                            if (item.value === advSort_1) {
                                item.active = true;
                            }
                            else {
                                item.active = false;
                            }
                            return item;
                        })
                    });
                }
            }
        }
    },
    methods: {
        handleResetPrice: function () {
            var _a = this.data.data, minPrice = _a.minPrice, maxPrice = _a.maxPrice;
            this.setData({ minPrice: minPrice, maxPrice: maxPrice });
            var _this = this;
            _this.changeList.add('minPrice');
            _this.changeList.add('maxPrice');
        },
        handleHideTopPanel: function () {
            this.setData({
                showTopPanel: false,
                sortPanelActive: false,
                animationFlag: false,
                filterList: this.data.filterList.map(function (item) {
                    item.active = false;
                    return item;
                })
            });
            this.handleResetPrice();
        },
        closeTopPanel: function () {
            this.setData({ animationFlag: true });
            var topPanel = this.selectComponent('#TopPanel');
            if (topPanel) {
                topPanel.handleClosePanel();
            }
            else {
                this.setData({ animationFlag: false });
            }
        },
        handleClickTabitem: function (event) {
            if (this.data.animationFlag === true) {
                return;
            }
            var tabItem = event.currentTarget.dataset.item;
            if (tabItem.active === true) {
                this.closeTopPanel();
            }
            else {
                this.setData({
                    filterList: this.data.filterList.map(function (item) {
                        if (item.id === tabItem.id) {
                            item.active = true;
                        }
                        else {
                            item.active = false;
                        }
                        return item;
                    })
                });
                this.handleTabitemAction(tabItem);
            }
        },
        handleTabitemAction: function (tabItem) {
            var type = this.data.type;
            switch (tabItem.action) {
                case 'sort':
                    this.setData({ showTopPanel: true, currentPanel: 'sort' });
                    break;
                case 'price':
                    this.setData({ showTopPanel: true, currentPanel: 'price' });
                    break;
                case 'brand':
                    this.setData({ showTopPanel: false, currentPanel: '' });
                    wx.navigateTo({ url: "/page/brandSelect/index?type=" + type });
                    this.setData({
                        filterList: this.data.filterList.map(function (item) {
                            item.active = false;
                            return item;
                        })
                    });
                    break;
                case 'advance':
                    this.setData({ showTopPanel: false, currentPanel: '' });
                    wx.navigateTo({ url: "/page/filter/index?type=" + type });
                    this.setData({
                        filterList: this.data.filterList.map(function (item) {
                            item.active = false;
                            return item;
                        })
                    });
                    break;
            }
        },
        handlePriceChange: function (event) {
            var _a = event.detail, max = _a.max, min = _a.min;
            this.setData({ maxPrice: max, minPrice: min });
            var _this = this;
            _this.changeList.add('minPrice');
            _this.changeList.add('maxPrice');
        },
        handleSelectSort: function (event) {
            var value = event.currentTarget.dataset.value;
            var sortItem = this.data.sortList.find(function (item) { return item.value === value; });
            if (sortItem.active === false) {
                this.setData({
                    sortList: this.data.sortList.map(function (item) {
                        if (item === sortItem) {
                            item.active = true;
                        }
                        else {
                            item.active = false;
                        }
                        return item;
                    }),
                    advSort: value
                });
                var _this = this;
                _this.changeList.add('advSort');
                this.handleSubmit();
            }
        },
        handleSubmit: function () {
            this.setData({
                showTopPanel: false,
                filterList: this.data.filterList.map(function (item) {
                    item.active = false;
                    return item;
                })
            });
            var _this = this;
            var changeList = _this.changeList;
            var outsideData = this.data.data;
            var insideData = this.data;
            var result = {};
            changeList.forEach(function (field) {
                if (JSON.stringify(insideData[field]) !==
                    JSON.stringify(outsideData[field])) {
                    result[field] = insideData[field];
                }
            });
            _this.changeList = new Set();
            this.triggerEvent('onSubmit', result);
        }
    },
    lifetimes: {
        created: function () {
            var _this = this;
            _this.changeList = new Set();
        }
    }
});
