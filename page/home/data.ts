export default class  HomePageData {
  imgUrls = [
    {
      imagePath: "../../assets/image/banner.png",
      id: 0
    }
  ];
  searchData:ISearchData={
    city: "", //城市名
    cityId:{}, //城市ID
    brandName:"奥迪", //品牌名称
    brandId:{
      icon:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=660156855,1063523123&fm=26&gp=0.jpg"
    }, //品牌ID
    seriesName: 'A3', //车系名称
    seriesID:{}, //车系ID
    searchJson: '', //对应搜索参数{"gz":{},"yx":{},"rr":{}}
    relationJson: '',//对应搜索参数（前端用到，此处不一定用到）
    minPrice:0, //最低价 单位万元
    maxPrice:50, //最高价 单位万元
    autoType:0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
    gearbox:0, //变速箱：1:手动,2:自动 单选
    drive:0, //驱动 3四驱 单选
    minAge:0, //最低车龄
    maxAge:6, //最高车龄
    minMileage:0, //最低里程 单位万公里
    maxMileage:14, //最高里程 单位万公里
    minDisplacement:0, //最低排量 单位升
    maxDisplacement:4, //最高排量 单位升
    fuelType:0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
    emission:0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
    countryType:0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
    carColor:0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
    starConfig:[], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
    sortType: 0, //车源偏好：1价格最低、2里程最少、3车龄最小 单选
    advSort: 0
  };
  autoTypeMap = {1:'轿车',2:'SUV',3:'MPV',4:'跑车',7:'面包车',8:'皮卡'};//车型map
  starConfigMap = {1:'准新车',2:'新上',3:'超值',4:'严选'};//亮点map
  sortTypeMap = {1:'价格最低',2:'里程最少',3:'车龄最小'};//车源偏好map
  cityText = '手动定位';
  spread = true;//是否显示全部
  cityList = [];
  isAuth = false; //是否登录
  showAuthDialog = false; //弹窗是否显示
  showTipDialog = false; //弹窗是否显示
  couponList = []; //优惠券
  showCouponDialog = false;
}