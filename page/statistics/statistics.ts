// import { getGuaZiCarData, getYouxinCarData, getRenRenCarData } from '../../api/getUsedCarData'
import { addMonitorParam ,updateMonitorParam} from '../../utils/car';
import { jsonForm } from '../../utils/monitor'
import StatisticsService from './service';
import statisicsData from './data';
const app = getApp();
Page({
  data: new statisicsData(),

  service: new StatisticsService(),

  onLoad(){
    let data = app.globalData.usedCarListData;
    console.log(data)
    if(data.enoughList){
      for (let i = 0; i < data.enoughList.length; i++) {
        if (data.enoughList[i].key == 'yx') {
          if(data.yxlowPriceData){
            data.enoughList[i]['firstPayText'] = data.yxlowPriceData.firstPayText
            data.enoughList[i]['priceText'] = data.yxlowPriceData.priceText
            data.enoughList[i]['selectCount'] = data.yxSelectCount
          }
        }
        if (data.enoughList[i].key == 'gz') {
          if(data.gzlowPriceData){
            data.enoughList[i]['firstPayText'] = data.gzlowPriceData.firstPayText
            data.enoughList[i]['priceText'] = data.gzlowPriceData.priceText
            data.enoughList[i]['selectCount'] = data.gzSelectCount
          }
        }
        if (data.enoughList[i].key == 'rr') {
          if(data.rrlowPriceData){
            data.enoughList[i]['firstPayText'] = data.rrlowPriceData.firstPayText
            data.enoughList[i]['priceText'] = data.rrlowPriceData.priceText
            data.enoughList[i]['selectCount'] = data.rrSelectCount
          }
        }
      }
    }
      this.setData({
        allCount: data.allCount,
        gzCount:data.gzCount,
        yxCount:data.yxCount,
        rrCount:data.rrCount,
        showCount: data.showCount,
        averagePrice: data.averagePrice,
        firstlowPriceData:data.firstlowPriceData,
        lowPriceData: data.lowPriceData,
        lowPrice: data.lowPrice,
        enoughList: data.enoughList,
        monitorId: data.monitorId || '',
        totalFee: data.totalFee || '', //消耗盯盯币
        taskTime: data.taskTime || '',
        startTimeName: data.startTimeName || '',
        allOriginalData: data.allOriginalData,
        ddCoin: data.ddCoin || 0,
        bindPhone: data.bindPhone || false,
        bindPublic: data.bindPublic || false,
        sourceData:data.sourceData,
        sortType:data.sortType || 0,
        fee:wx.getStorageSync('hourMoney'),
        bottomType:data.bottomType || 0,
        cardType:data.bottomType==4?1:2,
      })
  },
   onShow: function() {
    this.getUserInfo();
  },
  getUserInfo(){
    this.service.userInfo().then((res:any)=>{
      this.setData({
        ddCoin: res.data.coinAccount.useCoin,
        bindPhone: res.data.phone, // 是否绑定手机号
        bindPublic: res.data.public // 是否绑定公众号
      });
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    });
    this.service.getHourMoney().then((res:any)=>{
      this.setData({
        fee:res.data.cddHourMoney || 1
      })
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
  /**
   * 立即开始----开启监控
   */
  startMonitor() {
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '车源充足',
        dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
        dialogBtn: '知道了',
      })
    } else {
      const app = getApp()
      if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
        wx.navigateTo({
          url: '/page/bindPhone/bindPhone'
        })
        return;
      }
      this.setData({
        monitorShow: 'block',
        monitorTitle: '车源监控确认',
      })
    }
  },
  /**
   * 立即开始----开启监控取消
   */
  getMonitorEvent(e:any) {
    this.setData({
      monitorShow: e.detail.monitorShow,
    })
  },
    // 立即开始----开启监控确认
  getmonitorConfirmEvent(e:any) {
    const app = getApp<IAppOption>();
    if (!this.data.bindPhone && !app.globalData.isUserBindPhone) {
      // 数据绑定手机号，如果未绑定，跳转到手机号绑定页面
      wx.navigateTo({
        url: "../bindPhone/bindPhone"
      });
      return;
    }
    this.setData({
      monitorDisplay: e.detail.monitorShow
    });
    this.getStartMonitor(e.detail.noteSelect, e.detail.publicSelect);
  },
  /**
   * 立即开始----开启监控--未关注公众号时
   */
  getMonitorPublicEvent(e:any) {
    this.setData({
      monitorShow: 'none',
      publicDisplay: e.detail
    })
  },
  /**
   * 公众号隐藏
   */
  getPublicEvent(e:any) {
    this.setData({
      publicDisplay: e.detail.publicShow,
      monitorShow:'block'
    })
  },
  getPublicConfrimEvent(e:any) {
    this.setData({
      publicDisplay: e.detail.publicShow,
    })
  },
  // 添加监控，开启监控
  getStartMonitor(noteSelect:boolean , publicSelect:boolean ) {
    console.log(noteSelect)
    console.log(publicSelect)
    let data:any={
      noteSelect,
      publicSelect,
      sourceData: this.data.sourceData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      gzCount: this.data.gzCount,
      yxCount: this.data.yxCount,
      rrCount: this.data.rrCount,
    }
    
    let addParam=jsonForm(addMonitorParam(data));
    console.log(addParam);
    this.service.addCarMonitor(addParam).then((res:any) => {
      wx.hideLoading();
      wx.showToast({
        title: res.resultMsg,
        duration: 2000
      })
      wx.switchTab({
        url: '/page/monitors/index'
      })
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
  /**
   * 结束监控
   */
  stopMonitor() {
    this.setData({
      stopDisplay: 'block',
    })
  },
  /**
   * 继续监控
   */
  stopCancelEvent() {
    console.log(111)
    this.setData({
      stopDisplay: 'none',
    })
  },
//   /**
//    * 结束监控确认
//    */
  getstopConfirmEventEvent(e:CustomEvent) {
    console.log(this.data)
    let data = {
      monitorId: this.data.monitorId,
    }
      this.service.endCarMonitor(data).then(res => {
        if (res.success) {
          wx.showToast({
            title: res.resultMsg,
            icon: 'success',
            duration: 2000
          })
          this.setData({
            stopDisplay: e.detail.value,
          })
          wx.navigateBack({
            delta: 2
          })
        }
      }).catch((error)=>{
        wx.hideLoading();
        wx.showToast({
          title:error.resultMsg || '你的网络可能开小差了~',
          icon:'none'
        })
      })
    
  },
  goBackEvent() {
    //返回到监控列表页面
    wx.navigateBack({
      delta: 1
    })
  },
//   //保存修改
  goSave() {
    let app = getApp()
    let count = this.data.allCount
    if (count >= 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '车源充足',
        dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
        dialogBtn: '知道了'
      })
    } else {
      this.setData({
        updateMonitorDisplay: 'block',
        updateData: app.globalData.monitorSearchData,
        defalutData: app.globalData.monitorDefaultSearchData
      })
    }
    

  },
//   //保存修改 --取消，再看看
  getUpdateCancelEvent(e:CustomEvent) {
    this.setData({
      updateMonitorDisplay: e.detail.updateShow,
    })
  },
//   //保存修改 --确认
  getUpdateConfrimEvent(e:CustomEvent){
    this.setData({
      updateMonitorDisplay: e.detail.updateShow,
    })
    this.getUpdateMonitor()
  },
//    //修改监控
  getUpdateMonitor() {
    let data:any = {
      monitorId: this.data.monitorId,
      sourceData: this.data.sourceData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      gzCount: this.data.gzCount,
      yxCount: this.data.yxCount,
      rrCount: this.data.rrCount,
    }
    let addParam=jsonForm(updateMonitorParam(data));
    wx.showLoading({
      title: '正在修改监控...',
      mask: true
    });
    this.service.updateCarMonitor(addParam).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: res.resultMsg,
        duration: 2000
      })
      wx.navigateBack({
        delta: 2
      })
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
navigateToPlatform(e:any) {
      let p = e.currentTarget.dataset.platform
      if (p == 'gz') { 
        wx.navigateToMiniProgram({
          appId: 'wx2f40778ca2a8c6b0',
        })
      }
      if (p == 'yx') { 
        wx.navigateToMiniProgram({
          appId: 'wx66d9d754ae654ee0',
        })
       }
      if (p == 'rr') { 
        wx.navigateToMiniProgram({
          appId: 'wx2d80f009df8d7aaa',
        })
      }
  },

  getEnoughEvent() {
    this.setData({
      monitorenoughDisplay: 'none',
    })
  },
});