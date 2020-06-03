"use strict";
Component({
    properties: {
        value: {
            type: Number
        },
        optionList: {
            type: Array
        }
    },
    data: {
        expand: false,
        label: ''
    },
    methods: {
        calcLabel: function (value) {
            var optionList = this.properties.optionList;
            if (this.properties.optionList.length === 0) {
                return;
            }
            var label = optionList[0].label;
            if (typeof value !== 'undefined') {
                var selectedItem = optionList.find(function (item) { return item.value === value; });
                if (selectedItem) {
                    label = selectedItem.label;
                }
            }
            return label;
        },
        handleExpand: function () {
            this.setData({ expand: !this.data.expand });
        },
        handleChange: function (event) {
            var value = event.currentTarget.dataset.item.value;
            var label = event.currentTarget.dataset.item.label;
            this.setData({ label: label });
            this.triggerEvent('change', { value: value });
        }
    },
    lifetimes: {
        ready: function () {
            var label = this.calcLabel(this.properties.value);
            this.setData({ label: label });
        }
    }
});
