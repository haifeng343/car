import { registerFormatter } from './formatter/formatter';
import renrenFormatter from './formatter/renren-formatter';
import Http from './utils/http';
import { authSubject } from './utils/auth';
import { doWechatLogin } from './utils/wx';
import youxinFormatter from './formatter/youxin-formatter';
import guaziFormatter from './formatter/guazi-formatter';

App<IAppOption>({
  globalData: {
    searchData: {
      city: '', //城市名
      cityId: {}, //城市ID
      brandName: '', //品牌名称
      brandId: {}, //品牌ID
      seriesName: '', //车系名称
      seriesID: {}, //车系ID
      searchJson: '', //对应搜索参数{"gz":{},"yx":{},"rr":{}}
      relationJson: '', //对应搜索参数（前端用到，此处不一定用到）
      minPrice: 0, //最低价 单位万元
      maxPrice: 50, //最高价 单位万元
      autoType: 0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
      gearbox: 0, //变速箱：1:手动,2:自动 单选
      drive: 0, //驱动 3四驱 单选
      minAge: 0, //最低车龄
      maxAge: 6, //最高车龄
      minMileage: 0, //最低里程 单位万公里
      maxMileage: 14, //最高里程 单位万公里
      minDisplacement: 0, //最低排量 单位升
      maxDisplacement: 4, //最高排量 单位升
      fuelType: 0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
      emission: 0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
      countryType: 0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
      carColor: 0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
      starConfig: [], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
      sortType: 0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
      advSort: 0 // 排序: 1 = 车价最低;11 = 车价最高; 2 = 车龄最低; 3 = 里程最少; 4 = 首付最少
    },
    monitorSearchData: {
      city: '', //城市名
      cityId: {}, //城市ID
      brandName: '', //品牌名称
      brandId: {}, //品牌ID
      seriesName: '', //车系名称
      seriesID: {}, //车系ID
      searchJson: '', //对应搜索参数{"gz":{},"yx":{},"rr":{}}
      relationJson: '', //对应搜索参数（前端用到，此处不一定用到）
      minPrice: 0, //最低价 单位万元
      maxPrice: 50, //最高价 单位万元
      autoType: 0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
      gearbox: 0, //变速箱：1:手动,2:自动 单选
      drive: 0, //驱动 3四驱 单选
      minAge: 0, //最低车龄
      maxAge: 6, //最高车龄
      minMileage: 0, //最低里程 单位万公里
      maxMileage: 14, //最高里程 单位万公里
      minDisplacement: 0, //最低排量 单位升
      maxDisplacement: 4, //最高排量 单位升
      fuelType: 0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
      emission: 0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
      countryType: 0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
      carColor: 0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
      starConfig: [], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
      sortType: 0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
      advSort: 0 // 排序: 1 = 车价最低;11 = 车价最高; 2 = 车龄最低; 3 = 里程最少; 4 = 首付最少
    },
    monitorDefaultSearchData: {
      city: '', //城市名
      cityId: {}, //城市ID
      brandName: '', //品牌名称
      brandId: {}, //品牌ID
      seriesName: '', //车系名称
      seriesID: {}, //车系ID
      searchJson: '', //对应搜索参数{"gz":{},"yx":{},"rr":{}}
      relationJson: '', //对应搜索参数（前端用用到，此处不一定用到）
      minPrice: 0, //最低价 单位万元
      maxPrice: 50, //最高价 单位万元
      autoType: 0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
      gearbox: 0, //变速箱：1:手动,2:自动 单选
      drive: 0, //驱动 3四驱 单选
      minAge: 0, //最低车龄
      maxAge: 6, //最高车龄
      minMileage: 0, //最低里程 单位万公里
      maxMileage: 14, //最高里程 单位万公里
      minDisplacement: 0, //最低排量 单位升
      maxDisplacement: 4, //最高排量 单位升
      fuelType: 0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
      emission: 0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
      countryType: 0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
      carColor: 0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
      starConfig: [], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
      sortType: 0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
      advSort: 0 // 排序: 1 = 车价最低;11 = 车价最高; 2 = 车龄最低; 3 = 里程最少; 4 = 首付最少
    },
    isUserBindPhone: false,
    isUserBindPublic: false,
    isAuth: false,
    usedCarListData: {
      //跳转详情页数据
      allCount: 0, //总数
      gzCount: 0, //瓜子数
      yxCount: 0, //优信数
      rrCount: 0, //人人数
      showCount: 0, //车源展示数
      averagePrice: 0, //车源平均价
      lowPrice: 0, //车源最低总价
      lowPriceData: null, //车源最低总价价格 数据
      gzlowPriceData: null, //瓜子车源最低总价价格 数据
      yxlowPriceData: null, //优信车源最低总价价格 数据
      rrlowPriceData: null, //人人车源最低总价价格 数据
      firstlowPriceData: null, //车源最低收费价格 数据
      enoughList: [], //3个平台车源数组
      ddCoin: 0, //钉钉币
      bindPhone: false, //是否绑定手机
      bindPublic: false, //是否绑定公众号
      bottomType: 0, //1=底部是关闭监控 2：底部是修改保存监控 3：底部是屏蔽车源 4:开启监控
      taskTime: '', //任务时长
      startTimeName: '', //任务开启时间
      monitorId: 0, //监控id
      fee: 0, //监控收费
      totalFee: 0, //监控总费用
      sortType: 0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
      allOriginalData: [], //车源列表-处理后
      sourceData: [], //车源列表-源数据
      gzSelectCount:0,
      yxSelectCount:0,
      rrSelectCount:0,
    }
  },
  onLaunch() {
    registerFormatter('rr', renrenFormatter);
    registerFormatter('yx', youxinFormatter);
    registerFormatter('gz', guaziFormatter);
    doWechatLogin()
      .then((resp) => {
        console.log('登录成功啦');
        const token = resp.token;
        this.globalData.isAuth = true;
        wx.setStorageSync('token', token);
        // 注意: 不要把这代码段放在存储token之前
        authSubject.next(true);
        Http.get('/cdd/user/userInfo.json', { token }).then((resp: any) => {
          this.globalData.isUserBindPhone = !!resp.data.userBase.mobile;
          this.globalData.isUserBindPublic = !!resp.data.publicOpenId;
        });
      })
      .catch((error) => {
        console.error(error);
        console.error('登录失败啦!789');
        this.globalData.isAuth = false;
      });
  }
});
