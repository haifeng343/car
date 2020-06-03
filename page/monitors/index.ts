import HomeService from './service';
import monitorData from './data';

const monitor = require("../../utils/monitor.js");
const app = getApp();
Page({
  data: new monitorData(),
  homeServise: new HomeService(),

  onShow: function () {
    let token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        data: []
      })
      this.getLongMonitorData()
      this.getUserInfo()
    } else {
      this.setData({
        show: 0
      })
    }
  },
  getLongMonitorData() {
    let data = {}
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.homeServise.getMonitorCarList(data).then((res: any) => {
      wx.hideLoading();
      if (res.data.length) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].dayNum = monitor.setDay(res.data[i].monitorTime)
          res.data[i].hourNum = monitor.setHour(res.data[i].monitorTime)
          res.data[i].index = i
          res.data[i].longRentType = res.data[i].rentType
          res.data[i].rentType = 2
        }
        this.setData({
          data: res.data,
          show: 1
        })
      } else {
        this.setData({
          show: 0
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
  /**
   * 获取用户信息，盯盯币，是否绑定微信公众号 和 手机绑定
   */
  getUserInfo() {
    let data = {}
    this.homeServise.userInfo(data).then((res: any) => {
      this.setData({
        ddCoin: res.data.coinAccount.useCoin,
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
   * 监控删除弹窗
   */
  delItem(e: any) {
    var item = this.data.data[e.detail.index]
    let deleteItem = {
      startTimeName: item.startTime ? monitor.startTimeName(item.startTime) : '',
      createTime: monitor.startTimeName(item.createTime),
      taskTime: monitor.taskTime(item.monitorTime, item.minutes),
      fee: item.fee,
      totalFee: item.totalFee || 0,
      id: item.id
    }
    //未开启-无监控开始时间，消费记录；已过期-无监控开始时间，消费记录
    if (!item.startTime && (item.status == 12 || item.status == 0)) {
      this.setData({
        monitorEndDisplay: 'block',
        deleteItem
      })
    } else {
      this.setData({
        monitorStopDisplay: 'block',
        deleteItem
      })
    }

  },
  getmonitorStopEvent(e: any) {
    this.setData({
      monitorStopDisplay: e.detail.value,
    })
  },
  /**
   * 监控删除确认--已开启有监控记录
   */
  getmonitorConfirmEvent(e: any) {
    let data = {
      monitorId: this.data.deleteItem.id
    }
    this.homeServise.endCarMonitor(data).then((res: any) => {
      if (res.success) {
        wx.showToast({
          title: res.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.setData({
          monitorStopDisplay: e.detail.value,
          data: []
        })
        this.getLongMonitorData();
      }
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
  getmonitorEndEvent(e: any) {
    this.setData({
      monitorEndDisplay: e.detail.value,
    })
  },
  /**
   * 监控删除确认--未开启无监控任务
   */
  getmonitorEndConfirmEvent(e: any) {
    let data = {
      monitorId: this.data.deleteItem.id
    }
    this.homeServise.endCarMonitor(data).then((res: any) => {
      if (res.success) {
        wx.showToast({
          title: res.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.setData({
          monitorEndDisplay: e.detail.value,
          data: []
        })
        this.getLongMonitorData();
      }
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
  /**
   * 立即充值，跳转到充值页面
   */
  recharge(e: any) {
    var type = e.detail.type
    wx.navigateTo({
      url: '/page/deposit/deposit?type=' + type
    });
  },

  getmonitorStartEvent(e: any) {
    this.setData({
      monitorStartDisplay: e.detail.value,
    })
  },
  getmonitorStartConfirmEvent(e: any) {
    this.setData({
      monitorStartDisplay: e.detail.value,
    })
    this.getMonitorStart()
  },
  //立即开启
  getMonitorStart() {
    let data = {
      monitorId: this.data.startItem.id//传入id
    }
    wx.showLoading({
      title: '正在开启监控...',
      mask: true
    });
    this.homeServise.startCarMonitor(data).then((res: any) => {
      wx.hideLoading();
      if (res.success) {
        wx.showToast({
          title: res.resultMsg,
          icon: 'success',
          duration: 2000
        })
        this.getLongMonitorData();
      }
    }).catch((error)=>{
      wx.hideLoading();
      wx.showToast({
        title:error.resultMsg || '你的网络可能开小差了~',
        icon:'none'
      })
    })
  },
  /**
   * 立即开启弹窗
   */
  openTask(e: any) {
    var item = this.data.data[e.detail.index]
    this.setData({
      monitorStartDisplay: 'block',
      startItem: item
    })
  },
  /**
   * 点击整个灰色卡片事件
   */
  goToClick(e: any) {
    var type = e.detail.type
    var item = this.data.data[e.detail.index]
    if (item.status == 12) {
      this.delItem(e)
    }
    if ((item.status == 11 || item.status == 0) && this.data.ddCoin < item.fee) {
      wx.navigateTo({
        url: '/page/deposit/deposit?type=' + type
      });
    }
    if ((item.status == 11 || item.status == 0) && this.data.ddCoin >= item.fee) {
      this.openTask(e)
    }
  },
  /**
   * 查看详情
   */
  checkDetail(e: any) {
    var item = this.data.data[e.detail.index]
      app.globalData.monitorSearchData= {
      city: "", //城市名
      cityId:{}, //城市ID
      brandName:"", //品牌名称
      brandId:{}, //品牌ID
      seriesName: '', //车系名称
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
      sortType: 0 //车源偏好：1价格最低、2里程最少、3年龄最小 单选
    }
      app.globalData.monitorDefaultSearchData= {
      city: "", //城市名
      cityId:{}, //城市ID
      brandName:"", //品牌名称
      brandId:{}, //品牌ID
      seriesName: '', //车系名称
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
      sortType: 0 //车源偏好：1价格最低、2里程最少、3年龄最小 单选
    }
      // app.globalData.monitorLongData = {  不需要了
      //   item: item
      // }
      wx.navigateTo({
        url: '../monitorCarList/monitorCarList?monitorId='+item.id,
      })
  },
  //跳转监控规则页面
  handleGoToRule() {
    wx.navigateTo({
      url: '../monitorRule/index',
    })
  }
})