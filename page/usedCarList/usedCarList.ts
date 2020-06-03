import {
  getGuaZiCarData,
  getYouxinCarData,
  getRenRenCarData
} from '../../api/getUsedCarData';
import { getUsedCardAllData, addMonitorParam } from '../../utils/car';
import { compareSort } from '../../utils/util';
import { jsonForm } from '../../utils/monitor';
import UsedCarPageData from './data';
import UsedCarService from './service';
import transformFilter from '../../utils/transformFilter';
import { SearchDataSubject, SearchDataObject } from '../../utils/searchDataStream';
Page({
  data: new UsedCarPageData(),
  service: new UsedCarService(),
  onLoad() {
    const app = getApp<IAppOption>();
    this.service.serchDataSubscription = SearchDataSubject.subscribe(
      (next: IAnyObject | null) => {
        if (next) {
          let arr = Object.keys(next);
          if (arr.length) {
            const searchData = app.globalData.searchData;
            app.globalData.searchData = Object.assign(searchData, next);
            if(arr.indexOf('sortType')>-1){
              if(next.sortType === 1||next.sortType === 0){
                app.globalData.searchData = Object.assign(searchData, {'advSort':next.sortType});
              }
              if(next.sortType === 2){
                app.globalData.searchData = Object.assign(searchData, {'advSort':3});
              }
              if(next.sortType === 3){
                app.globalData.searchData = Object.assign(searchData, {'advSort':2});
              }
            }
            this.setData({
              loadingDisplay: 'block',
              dataFlag: 0,
              allData: [],
              editFlag: false,
              selectAllFlag: false
            });
            this.onCarLoad();
          }
        }
      }
    );
    this.onCarLoad();
  },
  onShow: function() {
    this.getUserInfo();
  },
  onUnload() {
    if (this.service.serchDataSubscription) {
      this.service.serchDataSubscription.unsubscribe();
    }
  },
  onCarLoad() {
    const app = getApp<IAppOption>();
    let x = app.globalData.searchData;
    this.setData({
      updateData: Object.assign({}, x)
    });
    this.getUsedCarData();
    this.getIndexData();
  },
  submit(e: CustomEvent) {
    const app = getApp<IAppOption>();
    let allArr = [...this.data.allOriginalData];
    let arr = Object.keys(e.detail);
    console.log(e.detail);
    if (arr.length) {
      //1 = 车价最低;11 = 车价最高; 2 = 车龄最低; 3 = 里程最少; 4 = 首付最少
      if (arr.length == 1 && arr[0] == 'advSort') {
        app.globalData.searchData['advSort'] = e.detail['advSort'];
        this.setData({
          loadingDisplay: 'block',
          allData: []
        });
        if (e.detail['advSort'] === 1) {
          allArr.sort(compareSort('price', 'asc'));
        }
        if (e.detail['advSort'] === 11) {
          allArr.sort(compareSort('price', 'desc'));
        }
        if (e.detail['advSort'] === 2) {
          allArr.sort(compareSort('licensedDate', 'desc'));
        }
        if (e.detail['advSort'] === 3) {
          allArr.sort(compareSort('mileage', 'asc'));
        }
        if (e.detail['advSort'] === 4) {
          allArr.sort(compareSort('firstPay', 'asc'));
        }
        this.setData({
          loadingDisplay: 'none',
          allOriginalData: allArr,
          allData: allArr.slice(0, 5),
          updateData: Object.assign({}, app.globalData.searchData)
        });
      } else {
        const searchData = app.globalData.searchData;
        app.globalData.searchData = Object.assign(searchData, e.detail);
        this.setData({
          loadingDisplay: 'block',
          dataFlag: 0,
          allData: [],
          editFlag: false,
          selectAllFlag: false
        });
        SearchDataObject.next(true);
        this.onLoad();
      }
    }
  },
  getUserInfo() {
    this.service.userInfo().then((res: any) => {
      this.setData({
        ddCoin: res.data.coinAccount.useCoin,
        bindPhone: res.data.phone, // 是否绑定手机号
        bindPublic: res.data.public // 是否绑定公众号
      });
    });
  },
  getIndexData() {
    this.service.indexParam().then((res: any) => {
      const cddHourMoney = res.data.cddHourMoney || '1';
      wx.setStorageSync('hourMoney', cddHourMoney);
      this.setData({
        fee: res.data.cddHourMoney
      });
    });
  },
  onReachBottom() {
    console.log('到底了');
    if (this.data.allData < this.data.allOriginalData) {
      this.setData({
        loadingShow: true
      });
      let timers = setTimeout(() => {
        this.addDataToArray();
        clearTimeout(timers);
      }, 500);
    } else {
      this.setData({
        loadingShow: false
      });
      if (this.data.allCount > 50) {
        if (!this.data.enoughBottom) {
          this.setData({
            monitorenoughDisplay: 'block',
            dialogTitle: '哎呀，到底了',
            dialogText: '您已查看全部车源，更多车源可前往各平台查看。',
            dialogBtn: '取消',
            enoughBottom: true
          });
        } else {
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 2000
          });
        }
      }
      if (this.data.allCount <= 50) {
        if (!this.data.monitorBottom) {
          this.setData({
            monitorDisplay: 'block',
            monitorTitle: '到底了!你可以开启监控',
            monitorBottom: true
          });
        } else {
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 2000
          });
        }
      }
    }
  },
  addDataToArray() {
    if (this.data.allData.length < this.data.allOriginalData.length) {
      const a: IFormatResult[] = [];
      const index = this.data.allData.length;
      const addArr = this.data.allOriginalData.slice(index, index + 5);
      const newArr = a.concat(this.data.allData).concat(addArr);
      this.setData({
        allData: newArr,
        loadingShow: false
      });
    }
  },
  getUsedCarData() {
    const app = getApp<IAppOption>();
    let searchData = app.globalData.searchData;
    let enoughList: any = [];
    Promise.all(
      [
        getGuaZiCarData(1, transformFilter.transformFilter(searchData, 'gz')),
        getYouxinCarData(1, transformFilter.transformFilter(searchData, 'yx')),
        getRenRenCarData(1, transformFilter.transformFilter(searchData, 'rr'))
      ].map((promiseItem: any) => {
        return promiseItem.catch((err: any) => {
          return err;
        });
      })
    )
      .then((res) => {
        let r0: any = res[0];
        let r1: any = res[1];
        let r2: any = res[2];
        if (
          [r0, r1, r2].filter((item) => item.code && (item.code === -100||item.code === -200)).length === 3
        ) {
          this.setData({
            loadingDisplay: 'none',
            dataFlag: 3
          });
        }else if([r0, r1, r2].filter((item) => item.code && item.code === -101).length === 3){
          this.setData({
            loadingDisplay: 'none',
            dataFlag: 2,
            allCount:0,
            allOriginalData: [],
            allData: [],
            gzFilterData: [],
            yxFilterData: [],
            rrFilterData: [],
            sourceData:[],
            gzCount:-1,
            yxCount:-1,
            rrCount:-1,
            averagePrice:0,
            lowPrice:0,
            lowPriceData:null,
            gzlowPriceData:null,
            yxlowPriceData:null,
            rrlowPriceData:null,
            firstlowPriceData:null,
            sortType: searchData.sortType
          });
        } else {
          if (r0 && r0.data) {
            enoughList.push({
              key: 'gz',
              name: '瓜子',
              value: r0.count
            });
          }
          if (r1 && r1.data) {
            enoughList.push({
              key: 'yx',
              name: '优信',
              value: r1.count
            });
          }
          if (r2 && r2.data) {
            enoughList.push({
              key: 'rr',
              name: '人人',
              value: r2.count
            });
          }
          enoughList.sort(compareSort('value', 'desc'));
          // -1 表示车辆数未知；接口请求失败或者其他原因
          if (r0 && r0.code < 0) {
            enoughList.push({ key: 'gz', name: '瓜子', value: -1 });
          }
          if (r1 && r1.code < 0) {
            enoughList.push({ key: 'yx', name: '优信', value: -1 });
          }
          if (r2 && r2.code < 0) {
            enoughList.push({ key: 'rr', name: '人人', value: -1 });
          }
          let carData = getUsedCardAllData({
            gzCount: (r0 && r0.count) || -1,
            gzData: (r0 && r0.data) || [],
            yxCount: (r1 && r1.count) || -1,
            yxData: (r1 && r1.data) || [],
            rrCount: (r2 && r2.count) || -1,
            rrData: (r2 && r2.data) || [],
            type: 1
          });
          if (carData.allCount &&carData.allCount > 0 &&carData.filterData.length > 0 ) {
            this.setData({
              dataFlag: 1,
            });
          } else {
            this.setData({
              dataFlag: 2,
            });
          }
          this.setData({
            loadingDisplay: 'none',
            allCount: carData.allCount,
            allOriginalData: carData.filterData,
            allData: carData.filterData.slice(0, 5),
            gzFilterData: carData.gzFilterData,
            yxFilterData: carData.yxFilterData,
            rrFilterData: carData.rrFilterData,
            sourceData: carData.sourceData,
            averagePrice: carData.averagePrice,
            lowPrice: carData.lowPrice,
            lowPriceData: carData.lowPriceData?carData.lowPriceData:null,
            gzlowPriceData: carData.gzlowPriceData?carData.gzlowPriceData:null,
            yxlowPriceData: carData.yxlowPriceData?carData.yxlowPriceData:null,
            rrlowPriceData: carData.rrlowPriceData?carData.rrlowPriceData:null,
            firstlowPriceData: carData.firstlowPriceData?carData.firstlowPriceData:null,
            enoughList,
            gzCount: carData.gzCount,
            yxCount: carData.yxCount,
            rrCount: carData.rrCount,
            sortType: searchData.sortType
          });
        }
      })
      .catch((res) => {
        console.log(res);
        this.setData({
          loadingDisplay: 'none',
          dataFlag: 3
        });
      });
  },
  //开启监控
  startMonitor() {
    let count = this.data.allCount;
    const app = getApp<IAppOption>();
    if (count > 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '车源充足',
        dialogText:
          '已帮您甄选' +
          this.data.allOriginalData.length +
          '辆车源，若想查看更多车源，请点击前往各平台查看',
        dialogBtn: '知道了'
      });
    } else {
      // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        wx.navigateTo({
          url: '../bindPhone/bindPhone'
        });
        return;
      }
      this.setData({
        monitorDisplay: 'block',
        monitorTitle: '车源监控确认'
      });
    }
  },
  // 开启监控取消
  getMonitorEvent(e: any) {
    this.setData({
      monitorDisplay: e.detail.monitorShow
    });
  },
  // 开启监控确认
  getmonitorConfirmEvent(e: any) {
    const app = getApp<IAppOption>();
    if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
      // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
      wx.navigateTo({
        url: '../bindPhone/bindPhone'
      });
      return;
    }
    this.setData({
      monitorDisplay: e.detail.monitorShow
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },
  getStartMonitor(noteSelect: boolean, publicSelect: boolean) {
    let data = {
      noteSelect,
      publicSelect,
      sourceData: this.data.sourceData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      gzCount: this.data.gzCount,
      yxCount: this.data.yxCount,
      rrCount: this.data.rrCount
    };
    let addParam = jsonForm(addMonitorParam(data));
    //console.log(addParam)
    wx.showLoading({
      title: '正在添加监控...',
      mask: true
    });
    this.service
      .addMonitor(addParam)
      .then((res: any) => {
        wx.hideLoading();
        wx.showToast({
          title: res.resultMsg,
          duration: 2000,
          icon: 'none'
        });
        wx.switchTab({
          url: '/page/monitors/index'
        });
      })
      .catch((error: any) => {
        wx.showToast({
          title: error.message || error.resultMsg,
          duration: 2000,
          icon: 'none'
        });
      });
  },
  //开启监控-未绑定公众号-点击关注公众号
  getMonitorPublicEvent(e: any) {
    this.setData({
      monitorDisplay: e.detail.monitorShow,
      publicDisplay: e.detail.publicShow
    });
  },
  //公众号取消
  getPublicEvent(e: any) {
    this.setData({
      monitorDisplay: 'block',
      publicDisplay: e.detail.publicShow
    });
  },
  //公众号关注
  getPublicConfrimEvent(e: any) {
    this.setData({
      publicDisplay: e.detail.publicShow
    });
  },
  //车源充足
  getEnoughEvent(e: any) {
    this.setData({
      monitorenoughDisplay: e.detail.enoughShow
    });
  },
  goToDetail() {
    const app = getApp<IAppOption>();
    app.globalData.usedCarListData = {
      allCount: this.data.allCount,
      gzCount: this.data.gzCount,
      yxCount: this.data.yxCount,
      rrCount: this.data.rrCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowPrice: this.data.lowPrice,
      lowPriceData: this.data.lowPriceData,
      gzlowPriceData: this.data.gzlowPriceData,
      yxlowPriceData: this.data.yxlowPriceData,
      rrlowPriceData: this.data.rrlowPriceData,
      firstlowPriceData: this.data.firstlowPriceData,
      enoughList: this.data.enoughList,
      ddCoin: this.data.ddCoin,
      bindPhone: this.data.bindPhone,
      bindPublic: this.data.bindPublic,
      bottomType: 4,
      sortType: this.data.sortType,
      allOriginalData: this.data.allOriginalData,
      sourceData: this.data.sourceData,
      gzSelectCount:
        this.data.gzCount > -1 ? this.data.gzFilterData.length : -1,
      yxSelectCount:
        this.data.yxCount > -1 ? this.data.yxFilterData.length : -1,
      rrSelectCount: this.data.rrCount > -1 ? this.data.rrFilterData.length : -1
    };
    wx.navigateTo({
      url: '../statistics/statistics'
    });
  },
  //跳转到监控规则
  navtoMonitorRule() {
    wx.navigateTo({
      url: '../monitorRule/index'
    });
  },
  //立即刷新
  goRefresh() {
    this.setData({
      loadingDisplay: 'block',
      dataFlag: 0,
      allData: []
    });
    this.onCarLoad();
  }
});
