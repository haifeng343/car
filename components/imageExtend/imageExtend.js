"use strict";
Component({
    properties: {
        src: {
            type: String
        },
        defaultImage: {
            type: String,
            value: "../../assets/image/default_image.png"
        },
        defaultNoneImage: {
            type: String,
            value: "../../assets/image/long_default_image.png"
        },
        mode: {
            type: String,
            value: "aspectFill"
        },
        defaultTime: {
            type: Number,
            value: 3000
        }
    },
    data: {
        isLoaded: false,
        isDestroyBase: false
    },
    methods: {
        handleImageLoaded: function () {
            var _this = this;
            this.setData({
                isLoaded: true
            }, function () {
                setTimeout(function () {
                    _this.setData({ isDestroyBase: true });
                }, _this.data.defaultTime);
            });
        }
    }
});
