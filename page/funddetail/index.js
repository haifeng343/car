"use strict";
Page({
    data: { fundData: null, isLoaded: false },
    onLoad: function () {
        var app = getApp();
        var fundData = app.fundData;
        this.setData({ fundData: fundData, isLoaded: true });
    },
});
