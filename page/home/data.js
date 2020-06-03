"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HomePageData = (function () {
    function HomePageData() {
        this.imgUrls = [
            {
                imagePath: "../../assets/image/banner.png",
                id: 0
            }
        ];
        this.searchData = {
            city: "",
            cityId: {},
            brandName: "奥迪",
            brandId: {
                icon: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=660156855,1063523123&fm=26&gp=0.jpg"
            },
            seriesName: 'A3',
            seriesID: {},
            searchJson: '',
            relationJson: '',
            minPrice: 0,
            maxPrice: 50,
            autoType: 0,
            gearbox: 0,
            drive: 0,
            minAge: 0,
            maxAge: 6,
            minMileage: 0,
            maxMileage: 14,
            minDisplacement: 0,
            maxDisplacement: 4,
            fuelType: 0,
            emission: 0,
            countryType: 0,
            carColor: 0,
            starConfig: [],
            sortType: 0,
            advSort: 0
        };
        this.autoTypeMap = { 1: '轿车', 2: 'SUV', 3: 'MPV', 4: '跑车', 7: '面包车', 8: '皮卡' };
        this.starConfigMap = { 1: '准新车', 2: '新上', 3: '超值', 4: '严选' };
        this.sortTypeMap = { 1: '价格最低', 2: '里程最少', 3: '车龄最小' };
        this.cityText = '手动定位';
        this.spread = true;
        this.cityList = [];
        this.isAuth = false;
        this.showAuthDialog = false;
        this.showTipDialog = false;
        this.couponList = [];
        this.showCouponDialog = false;
    }
    return HomePageData;
}());
exports.default = HomePageData;
