"use strict";
Component({
    properties: {
        countFlag: {
            type: Number
        },
        scrollIng: {
            type: Boolean,
            observer: function (scrollIng) {
                if (scrollIng) {
                    this.setData({
                        show: false
                    });
                }
            }
        },
        editFlag: {
            type: Boolean
        },
        listType: {
            type: Number,
        },
        bottomType: {
            type: Number,
        },
    },
    data: {
        list: ['全部', '新上', '降价'],
        show: false
    },
    methods: {
        goEdit: function () {
            this.setData({
                show: false
            });
            this.triggerEvent('editEvent', undefined);
        },
        showSelect: function () {
            this.setData({
                show: !this.data.show
            });
        },
        changeSelect: function (event) {
            this.setData({
                show: false
            });
            var index = +event.currentTarget.dataset.index;
            this.triggerEvent('selectEvent', index);
        }
    }
});
