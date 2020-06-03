import HomeService from './service';
import HomePageData from './data';
import { getLocationSetting, getLocation, getSessionKey } from '../../utils/wx';
import { getLocationInfo } from '../../utils/map';
import { authSubject } from '../../utils/auth';
import {
  SearchDataSubject,
  MonitorSearchDataSubject,
  SearchDataObject
} from '../../utils/searchDataStream';

Page({
  service: new HomeService(),
  shortY: 0,
  submitFlag: false,
  data: new HomePageData(),
  searchSubmit() {
    const app = getApp<IAppOption>();
    let searchData = { ...this.data.searchData };
    app.globalData.searchData = { ...app.globalData.searchData, ...searchData };
    if (!searchData.city) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none'
      });
    } else if (this.data.isAuth) {
      wx.navigateTo({
        url: '../usedCarList/usedCarList'
      });
    } else {
      this.showAuthDialog();
      wx.showLoading({
        title: '获取登录授权中',
        mask: true
      });
    }
  },
  showAuthDialog() {
    getSessionKey()
      .then(() => {
        wx.hideLoading();
        this.setData({ showAuthDialog: true });
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: '获取登录授权失败',
          icon: 'none'
        });
      });
  },
  handleGetUserInfo(e: CustomEvent) {
    const userInfo = e.detail.userInfo.detail;
    const { iv, encryptedData } = userInfo;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: '为了更好的使用效果，请同意用户信息授权',
        icon: 'none'
      });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '获取授权信息...',
        mask: true
      });
      this.setData({ showAuthDialog: false });
      getSessionKey().then((sessionKey) => {
        const data = {
          session_key: sessionKey,
          iv,
          encryptedData
        };
        this.auth(data);
      });
    }
  },
  auth(data: any) {
    this.service
      .auth(data)
      .then(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录成功'
        });

        this.searchSubmit();
      })
      .catch(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        });
      });
  },
  handleCloseAuthDialog() {
    wx.showToast({
      title: '为了更好的使用效果，请同意用户信息授权',
      icon: 'none'
    });
    this.setData({
      showAuthDialog: false
    });
  },
  slideOption() {
    let spread = this.data.spread;
    this.setData({ spread: !spread });
  },
  bindTouchStart(event: TouchEvent) {
    this.shortY = event.changedTouches[0]
      ? event.changedTouches[0].pageY || 0
      : 0;
  },
  bindTouchEnd(event: TouchEvent) {
    if (this.shortY && this.shortY > event.changedTouches[0].pageY + 50) {
      console.log('上滑事件');
      this.setData({ spread: true });
    }
  },
  //亮点
  selectStarConfig(event: BaseEvent) {
    let index = +event.currentTarget.dataset.index;
    let searchData = { ...this.data.searchData };
    if (searchData.starConfig.indexOf(index) > -1) {
      searchData.starConfig.splice(searchData.starConfig.indexOf(index), 1);
    } else {
      searchData.starConfig.push(index);
      searchData.starConfig.sort();
    }
    this.setData({ searchData });
  },
  //车型、车源偏好
  selectType(event: BaseEvent) {
    let index = +event.currentTarget.dataset.index;
    let type = event.currentTarget.dataset.type;
    let searchData: IAnyObject = { ...this.data.searchData };
    if (index === searchData[type]) {
      searchData[type] = 0;
    } else {
      searchData[type] = index;
    }
    if(type === 'sortType') {
      switch (searchData['sortType']) {
        case 1: searchData.advSort = 1;break;
        case 2: searchData.advSort = 3;break;
        case 3: searchData.advSort = 2;break;
        default: searchData.advSort = 0;
      }
    }
    this.setData({ searchData: { ...this.data.searchData, ...searchData } });
  },
  //清除品牌选择
  handleClearBrand() {
    let searchData = { ...this.data.searchData };
    if (searchData.brandName) {
      searchData.brandName = '';
      searchData.brandId = {};
      searchData.seriesName = '';
      searchData.seriesID = {};
      this.setData({ searchData }, () => {
        const app = getApp<IAppOption>();
        app.globalData.searchData = {
          ...app.globalData.searchData,
          ...searchData
        };
      });
    } else {
      this.goBrandSelect();
    }
  },
  //进入品牌选择页面
  goBrandSelect() {
    wx.navigateTo({
      url: '../brandSelect/index?type=1'
    });
  },
  //进入城市选择页面
  goCitySelect() {
    wx.navigateTo({
      url: '../citySelect/citySelect'
    });
  },
  getBanner() {
    this.service.getBanner().then((resp: any) => {
      if (resp.list.length) {
        this.setData({ imgUrls: resp.list });
      }
    });
  },
  //手动定位
  handleRepos() {
    if (this.data.cityText === '定位中...') {
      return;
    }
    this.setData({ cityText: '定位中...' });
    this.getUserLocation();
  },
  getUserLocation() {
    getLocationSetting()
      .then((_) => getLocation())
      .then((location) => this.calcCityByLocation(location))
      .catch((_) => {
        console.error('获取定位授权失败啦~');
        wx.showToast({
          title: '为了更好的使用效果，请同意地理位置信息授权',
          icon: 'none'
        });
        this.calcCityByLocation(undefined);
      });
  },
  calcCityByLocation(location: any) {
    if (location) {
      getLocationInfo(location)
        .then((resp) => {
          const city = resp.result.address_component.city;
          if (city) {
            let searchData = { ...this.data.searchData };
            this.setData({
              cityText: '手动定位'
            });
            // 定位城市不是当前选中城市
            if (!city.includes(searchData.city)) {
              let cityList: any = this.data.cityList;
              if (cityList.length) {
                this.changeCity(city);
              } else {
                this.service
                  .getCityList()
                  .then((res: any) => {
                    this.setData({ cityList: res.data }, () => {
                      this.changeCity(city);
                    });
                  })
                  .catch(() => {
                    this.setData({
                      cityText: '定位失败'
                    });
                  });
              }
            }
          }
        })
        .catch(() => {
          this.setData({
            cityText: '定位失败'
          });
        });
    } else {
      this.setData({ cityText: '定位失败' });
    }
  },
  changeCity(city: string) {
    let cityList: any = this.data.cityList;
    for (const item of cityList) {
      let cityName = item.split('_')[0];
      if (city.includes(cityName) && cityName) {
        const app = getApp<IAppOption>();
        this.service
          .cityDetail(cityName)
          .then((resp: any) => {
            let searchData = { city: cityName, cityId: {} };
            if (resp.data && resp.data.json) {
              let json = JSON.parse(resp.data.json);
              if (json.rr) {
                searchData.cityId = {
                  ...searchData.cityId,
                  ...{ rr: { city: json.rr.city } }
                };
              }
              if (json.gz) {
                searchData.cityId = {
                  ...searchData.cityId,
                  ...{
                    gz: {
                      city_id: json.gz.city_id,
                      domain: json.gz.domain
                    }
                  }
                };
              }
              if (json.yx) {
                searchData.cityId = {
                  ...searchData.cityId,
                  ...{
                    yx: {
                      cityid: json.yx.cityid,
                      provinceid: json.yx.provinceid
                    }
                  }
                };
              }
            }
            wx.setStorageSync('cityHistory', searchData);
            app.globalData.searchData = {
              ...app.globalData.searchData,
              ...searchData
            };
            this.setData({
              searchData: { ...this.data.searchData, ...searchData }
            });
          })
          .catch(() => {
            this.setData({
              cityText: '定位失败'
            });
          });
        return;
      }
    }
    this.setData({ cityText: '当前城市不在列表内' });
  },
  //价格
  handlePriceChange(event: CustomEvent) {
    let data = {
      minPrice: event.detail.min,
      maxPrice: event.detail.max
    };
    let searchData = { ...this.data.searchData, ...data };
    this.setData({ searchData });
  },
  //车龄
  handleAgeChange(event: CustomEvent) {
    let data = {
      minAge: event.detail.min,
      maxAge: event.detail.max
    };
    let searchData = { ...this.data.searchData, ...data };
    this.setData({ searchData });
  },
  //里程
  handleMileageChange(event: CustomEvent) {
    let data = {
      minMileage: event.detail.min,
      maxMileage: event.detail.max
    };
    let searchData = { ...this.data.searchData, ...data };
    this.setData({ searchData });
  },
  handleShowTipDialog() {
    this.setData({ showTipDialog: true });
  },

  handleCloseTipDialog() {
    this.setData({ showTipDialog: false });
  },
  init() {
    const app = getApp<IAppOption>();
    let cityHistory = wx.getStorageSync('cityHistory');
    if (!app.globalData.searchData.city) {
      if (!cityHistory || !cityHistory.city) {
        cityHistory = {
          city: '北京',
          cityId: {
            rr: { city: '北京' },
            gz: { city_id: 12, domain: 'bj' },
            yx: { cityid: '201', provinceid: '2' }
          }
        };
      }
      app.globalData.searchData = {
        ...app.globalData.searchData,
        ...cityHistory
      };
    }
    let initData = {
      gearbox: 0,
      drive: 0,
      minDisplacement: 0,
      maxDisplacement: 4,
      fuelType: 0,
      emission: 0,
      countryType: 0,
      carColor: 0,
      starConfig: [1],
      advSort: 0
    };
    let starConfig: number[] = [1, 2, 3, 4];
    initData.starConfig = [];
    for (let index = 0; index < starConfig.length; index++) {
      let temp: number = starConfig[index];
      if (app.globalData.searchData.starConfig.indexOf(temp) > -1) {
        initData.starConfig.push(temp);
      }
    }
    switch (app.globalData.searchData.sortType) {
      case 1: initData.advSort = 1;break;
      case 2: initData.advSort = 3;break;
      case 3: initData.advSort = 2;break;
      default: initData.advSort = 0;
    }
    app.globalData.searchData = { ...app.globalData.searchData, ...initData };
    let searchData = { ...app.globalData.searchData };
    this.setData({ searchData, cityText:'手动定位' });
  },
  getUnReadCouponList() {
    this.service.getUnReadCouponList().then(couponList => {
      this.setData({ couponList, showCouponDialog: couponList.length > 0 });
    });
  },
  handleCloseCouponDialog() {
    this.setData({ showCouponDialog: false });
  },
  onShow() {
    this.init();
    if (this.data.isAuth) {
      this.getUnReadCouponList();
    } else if (!this.service.authSubscription) {
      this.service.authSubscription = authSubject.subscribe((isAuth) => {
        console.log('Home Page isAuth Subscription, isAuth = ' + isAuth);
        if (isAuth) {
          this.setData({ isAuth: isAuth });
          this.getUnReadCouponList();
        }
      });
    }
  },
  onLoad() {
    this.getBanner();
    SearchDataSubject.subscribe((next: IAnyObject | null) => {
      if (next) {
        const app = getApp<IAppOption>();
        app.globalData.searchData = { ...app.globalData.searchData, ...next };
      }
    });
    MonitorSearchDataSubject.subscribe((next) => {
      if (next) {
        const app = getApp<IAppOption>();
        app.globalData.monitorSearchData = {
          ...app.globalData.monitorSearchData,
          ...next
        };
      }
    });
    SearchDataObject.subscribe((next) => {
      if(next) {
        const app = getApp<IAppOption>();
        this.setData({ searchData: app.globalData.searchData });
      }
    })
  },
  onUnload() {
    if (this.service.authSubscription) {
      this.service.authSubscription.unsubscribe();
      this.service.authSubscription = null;
    }
  },
  onHide() {
    const app = getApp<IAppOption>();
    let searchData = { ...this.data.searchData };
    app.globalData.searchData = { ...app.globalData.searchData, ...searchData };
  },
  onShareAppMessage() {

    return {
      title: '实时监控全网二手车信息，低价品牌好车一辆不错过',
      path: 'page/home/index',
      imageUrl:
        'https://piaodingding.oss-cn-hangzhou.aliyuncs.com/images/wechat/cdd/share.png'
    };
  }
});
