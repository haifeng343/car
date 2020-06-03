import { getGuaZiCarData, getYouxinCarData, getRenRenCarData } from '../../api/getUsedCarData'
import { getUsedCardAllData,getMonitorAllData, getMonitorMSelect,getBatchFilter,updateMonitorParam } from '../../utils/car'
import { compareSort, objectDiff} from '../../utils/util'
import { taskTime, startTimeName,jsonForm} from '../../utils/monitor'
import transformFilter from '../../utils/transformFilter'
import { MonitorSearchDataSubject } from '../../utils/searchDataStream';
import UsedCarPageData from  './data'
import UsedCarService from  './service'
Page({
  data:new UsedCarPageData(),
  service: new UsedCarService(),
  onLoad(options){
    const app = getApp<IAppOption>();
    if(options.monitorId){
      this.setData({
        monitorId:+options.monitorId
      })
      this.service.serchDataSubscription = MonitorSearchDataSubject.subscribe((next: IAnyObject) => {
        if (next) {
          let arr = Object.keys(next)
          if(arr.length){
            const monitorSearchData = app.globalData.monitorSearchData;
            app.globalData.monitorSearchData = Object.assign(monitorSearchData, next);
            if(arr.indexOf('sortType')>-1){
              if(next.sortType === 1||next.sortType === 0){
                app.globalData.monitorSearchData = Object.assign(monitorSearchData, {'advSort':next.sortType});
              }
              if(next.sortType === 2){
                app.globalData.monitorSearchData = Object.assign(monitorSearchData, {'advSort':3});
              }
              if(next.sortType === 3){
                app.globalData.monitorSearchData = Object.assign(monitorSearchData, {'advSort':2});
              }
            }
            this.setData({
              loadingDisplay: "block",
              dataFlag: 0,
              allData: [],
              editFlag: false,
              selectAllFlag: false,
            });
            if(objectDiff(app.globalData.monitorSearchData,app.globalData.monitorDefaultSearchData)){
              this.onCarLoad()
            }else{
              this.onCarShow();
            }
          }
        }
      });
      this.onCarLoad()
    }else{
      this.setData({
        loadingDisplay: 'none',
        dataFlag: 4,
      })
    }
  },
  onUnload() {
    if (this.service.serchDataSubscription) {
      this.service.serchDataSubscription.unsubscribe();
    }
  },
  onCarLoad(){
    this.getMonitorData(false)
  },
  onCarShow(){
    const app = getApp<IAppOption>();
    this.setData({
      mSelect: 1,
      updateData:Object.assign({}, app.globalData.monitorSearchData)
    })
    this.getUsedCarData()
  },
  submit(e:CustomEvent) {
    const app = getApp<IAppOption>();
    let allArr = [...this.data.allOriginalData];
    let arr = Object.keys(e.detail);
    if (arr.length) {
      //1 = 车价最低;11 = 车价最高; 2 = 车龄最低; 3 = 里程最少; 4 = 首付最少
      if (arr.length == 1 && arr[0] == 'advSort'){
        app.globalData.monitorSearchData['advSort'] = e.detail['advSort'];
        this.setData({
          loadingDisplay: "block",
          allData: [],
          advSort: e.detail['advSort']
        });
        if (e.detail['advSort'] === 1) {
          allArr.sort(compareSort("price", "asc"));
        }
        if (e.detail['advSort'] === 11) {
          allArr.sort(compareSort("price", "desc"));
        }
        if (e.detail['advSort'] === 2) {
          allArr.sort(compareSort("licensedDate", "desc"));
        }
        if (e.detail['advSort'] === 3) {
          allArr.sort(compareSort("mileage", "asc"));
        }
        if (e.detail['advSort'] === 4) {
          allArr.sort(compareSort("firstPay", "asc"));
        }
        this.setData({
          loadingDisplay: "none",
          allOriginalData: allArr,
          allData: allArr.slice(0, 5),
          updateData:Object.assign({}, app.globalData.monitorSearchData)
        })
      }else{
        const monitorSearchData = app.globalData.monitorSearchData;
        app.globalData.monitorSearchData = Object.assign(monitorSearchData, e.detail);
        this.setData({
          loadingDisplay: "block",
          dataFlag: 0,
          allData: [],
          editFlag: false,
          selectAllFlag: false,
        });
        if(objectDiff(app.globalData.monitorSearchData,app.globalData.monitorDefaultSearchData)){
          this.onCarLoad()
        }else{
          this.onCarShow();
        }
      }
    }
  },
  
  onReachBottom() {
    console.log("到底了");
    if (this.data.allData < this.data.allOriginalData) {
      this.setData({
        loadingShow: true
      });
      let timers = setTimeout(() => {
        this.addDataToArray()
        clearTimeout(timers)
      }, 500)
    } else {
      this.setData({
        loadingShow: false
      });
      if(this.data.bottomType === 2){
        if(this.data.allCount > 50){
          if (!this.data.enoughBottom) {
            if (this.data.editFlag) { return }
            this.setData({
              monitorenoughDisplay: 'block',
              dialogTitle: '哎呀，到底了',
              dialogText: '已看完筛选出的'+this.data.allOriginalData.length+'辆车源，各平台还有更多车源可供选择, 您可以前往继续查询。',
              dialogBtn: '取消',
              enoughBottom: true,
            })
          }else{
            wx.showToast({
              title: "到底了",
              icon: "none",
              duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: "到底了",
            icon: "none",
            duration: 2000
          })
        }
      }else{
        wx.showToast({
          title: "到底了",
          icon: "none",
          duration: 2000
        })
      }
    }
  },
  addDataToArray() {
    if (this.data.allData.length < this.data.allOriginalData.length) {
      const a:IFormatResult[] = []
      const index = this.data.allData.length;
      const addArr = this.data.allOriginalData.slice(index, index + 5);
      const newArr = a.concat(this.data.allData).concat(addArr);
      this.setData({
        allData: newArr,
        loadingShow: false
      });
    }
  },
  onPageScroll(e:any) {
    this.setData({
      scrollTop: e.scrollTop,
      scrollIng: true
    })
    let timer = setTimeout(() => {
      if (this.data.scrollTop === e.scrollTop) {
        this.setData({
          scrollTop: e.scrollTop,
          scrollIng: false
        })
        clearTimeout(timer)
      }
    }, 300)
  },
  getMonitorData(detail:any){
    const app = getApp<IAppOption>();
    this.service.getCarDetail(this.data.monitorId).then((res:any)=>{
      wx.hideLoading();
      let carList = res.data.carList; //监控车源
      let monitorDetail = res.data.monitorDetail; //监控条件
      let monitorCount = res.data.monitorCount; //监控计算
      let relation = JSON.parse(monitorDetail.relationJson||'{}')
      app.globalData.monitorSearchData = {
        city: monitorDetail.cityName, //城市名
        cityId:relation.cityId, //城市ID
        brandName:monitorDetail.brandName, //品牌名称
        brandId:relation.brandId, //品牌ID
        seriesName: monitorDetail.seriesName, //车系名称
        seriesID:relation.seriesID, //车系ID
        searchJson: monitorDetail.searchJson, //对应搜索参数{"gz":{},"yx":{},"rr":{}}
        relationJson: '',//对应搜索参数（前端用，长租、二手车用到，此处不一定用到）
        minPrice:monitorDetail.minPrice, //最低价 单位万元
        maxPrice:monitorDetail.maxPrice === 9999? 50:monitorDetail.maxPrice, //最高价 单位万元
        autoType:monitorDetail.autoType||0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
        gearbox:monitorDetail.gearbox||0, //变速箱：1:手动,2:自动 单选
        drive:monitorDetail.drive||0, //驱动 3四驱 单选
        minAge:monitorDetail.minAge, //最低车龄
        maxAge:monitorDetail.maxAge === 99? 6:monitorDetail.maxAge, //最高车龄
        minMileage:monitorDetail.minMileage, //最低里程 单位万公里
        maxMileage:monitorDetail.maxMileage === 9999 ? 14:monitorDetail.maxMileage, //最高里程 单位万公里
        minDisplacement:monitorDetail.minDisplacement, //最低排量 单位升
        maxDisplacement:monitorDetail.maxDisplacement === 99 ? 4:monitorDetail.maxDisplacement, //最高排量 单位升
        fuelType:monitorDetail.fuelType||0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
        emission:monitorDetail.emission||0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
        countryType:monitorDetail.countryType||0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
        carColor:monitorDetail.carColor||0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
        starConfig:monitorDetail.starConfig?monitorDetail.starConfig.split(',').map((item:string) => +item):[], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
        sortType: monitorDetail.sortType||0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
        advSort: this.data.advSort ? this.data.advSort:this.advSortType(monitorDetail.sortType)
      }
      
      app.globalData.monitorDefaultSearchData = {
        city: monitorDetail.cityName, //城市名
        cityId:relation.cityId, //城市ID
        brandName:monitorDetail.brandName, //品牌名称
        brandId:relation.brandId, //品牌ID
        seriesName: monitorDetail.seriesName, //车系名称
        seriesID:relation.seriesID, //车系ID
        searchJson: monitorDetail.searchJson, //对应搜索参数{"gz":{},"yx":{},"rr":{}}
        relationJson: '',//对应搜索参数（前端用，长租、二手车用到，此处不一定用到）
        minPrice:monitorDetail.minPrice, //最低价 单位万元
        maxPrice:monitorDetail.maxPrice === 9999? 50:monitorDetail.maxPrice, //最高价 单位万元
        autoType:monitorDetail.autoType||0, //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡 单选
        gearbox:monitorDetail.gearbox||0, //变速箱：1:手动,2:自动 单选
        drive:monitorDetail.drive||0, //驱动 3四驱 单选
        minAge:monitorDetail.minAge, //最低车龄
        maxAge:monitorDetail.maxAge === 99? 6:monitorDetail.maxAge, //最高车龄
        minMileage:monitorDetail.minMileage, //最低里程 单位万公里
        maxMileage:monitorDetail.maxMileage === 9999 ? 14:monitorDetail.maxMileage, //最高里程 单位万公里
        minDisplacement:monitorDetail.minDisplacement, //最低排量 单位升
        maxDisplacement:monitorDetail.maxDisplacement === 99 ? 4:monitorDetail.maxDisplacement, //最高排量 单位升
        fuelType:monitorDetail.fuelType||0, //燃料类型1：汽油，2：柴油，3：电动，4：油电混合 单选
        emission:monitorDetail.emission||0, //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六 单选
        countryType:monitorDetail.countryType||0, //国别：1法系,2美系,3国产,4德系,5日系,6韩系 单选
        carColor:monitorDetail.carColor||0, //颜色：1黑、2白、3银灰、6红、7蓝 、10橙 单选
        starConfig:monitorDetail.starConfig?monitorDetail.starConfig.split(',').map((item:string) => +item):[], //亮点:1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙(多选逗号隔开存)
        sortType: monitorDetail.sortType||0, //车源偏好：1价格最低、2里程最少、3年龄最小 单选
        advSort: this.data.advSort ? this.data.advSort:this.advSortType(monitorDetail.sortType)
      }
      if (!monitorCount || !monitorCount.allTotal || monitorCount.allTotal == 0 || !carList ||carList.length == 0) {
        this.setData({
          dataFlag: 2,
          loadingDisplay: 'none',
          bottomType: 1, //1=底部是关闭监控 2：底部是修改保存监控 3：底部是屏蔽车源
          taskTime: taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
          startTimeName: startTimeName(monitorDetail.startTime),
          fee: monitorDetail.fee,
          monitorId: monitorDetail.id,
          totalFee: monitorDetail.totalFee, //消耗盯盯币
          allOriginalData: [],
          allData: [],
          allCount: 0,
          updateData: Object.assign({}, app.globalData.monitorSearchData),
          defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect
        })
        return
      }
      if (!this.data.isMtype) {
        let mType = getMonitorMSelect(carList);
        this.setData({
          mSelect: mType,
          isMtype: true
        })
      }
      let monitorCarData = getMonitorAllData(carList, detail ? detail : this.data.mSelect);//监控车源列表
      if(monitorCarData.filterData.length === 0){
        this.setData({
          dataFlag: 2,
          loadingDisplay: 'none',
          bottomType: 1, //1=底部是关闭监控 2：底部是修改保存监控 3：底部是屏蔽车源
          taskTime: taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
          startTimeName: startTimeName(monitorDetail.startTime),
          fee: monitorDetail.fee,
          monitorId: monitorDetail.id,
          totalFee: monitorDetail.totalFee, //消耗盯盯币
          allOriginalData: [],
          allData: [],
          allCount: 0,
          updateData: Object.assign({}, app.globalData.monitorSearchData),
          defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
          editFlag: false,
          mSelect: detail ? detail : this.data.mSelect
        })
        return
      }
      let enoughList=[{key:'gz',name:'瓜子',value:monitorCount.gzTotal},{key:'yx',name:'优信',value:monitorCount.yxTotal},{key:'rr',name:'人人',value:monitorCount.rrTotal}]
      enoughList.sort(compareSort('value', 'desc'));
      this.setData({
        loadingDisplay: "none",
        dataFlag:1,
        allCount: monitorCount.allTotal,
        allOriginalData: monitorCarData.filterData,
        allData:monitorCarData.filterData.slice(0, 5),
        gzFilterData:monitorCarData.gzFilterData,
        yxFilterData:monitorCarData.yxFilterData,
        rrFilterData:monitorCarData.rrFilterData,
        averagePrice:monitorCarData.averagePrice,
        lowPrice:monitorCarData.lowPrice,
        lowPriceData:monitorCarData.lowPriceData?monitorCarData.lowPriceData:null,
        gzlowPriceData:monitorCarData.gzlowPriceData?monitorCarData.gzlowPriceData:null,
        yxlowPriceData:monitorCarData.yxlowPriceData?monitorCarData.yxlowPriceData:null,
        rrlowPriceData:monitorCarData.rrlowPriceData?monitorCarData.rrlowPriceData:null,
        firstlowPriceData:monitorCarData.firstlowPriceData?monitorCarData.firstlowPriceData:null,
        enoughList,
        gzCount:monitorCount.gzTotal,
        yxCount:monitorCount.yxTotal,
        rrCount:monitorCount.rrTotal,
        taskTime: taskTime(monitorDetail.monitorTime, monitorDetail.minutes),
        startTimeName: startTimeName(monitorDetail.startTime),
        fee: monitorDetail.fee,
        monitorId: monitorDetail.id,
        totalFee: monitorDetail.totalFee, //消耗盯盯币
        bottomType:1,
        sortType: monitorDetail.sortType||0,
        updateData: Object.assign({}, app.globalData.monitorSearchData),
        defalutData: Object.assign({}, app.globalData.monitorDefaultSearchData),
        mSelect: detail ? detail : this.data.mSelect
      })
      
    }).catch((res:any)=>{
      console.log(res)
      wx.hideLoading();
      this.setData({
        loadingDisplay: 'none',
        dataFlag: 4,
      })
    })
  },
  //高级筛选类型判断
  advSortType(value:any):number{
    if(value){
      if(value === 1){
        return 1
      }else if(value === 2){
        return 3
      }else if(value === 3){
        return 2
      }else{
        return 0 
      }
    }else{
      return 0 
    }
  },
  //单个不再关注
  deleteItem(e:any) {
    let num = wx.getStorageSync('followNum');
    let index = e.detail.index;
    if (!num) {
      this.setData({
        followText: '屏蔽车源后，该车源将不会在后续监控中出现！',
        followType: 1,
        followDisplay: 'block',
        followIndex: index
      })
    }else{
      this.setData({
        followText: "是否确认屏蔽此车源！",
        followType: 1,
        followDisplay: "block",
        followIndex: index
      });
    }
  },
  //单个不再关注取消
  followCancelEvent(e:any) {
    if (e.detail.followType == 1) {
      wx.setStorageSync('followNum', 1)
    }
    this.setData({
      followDisplay: e.detail.show
    })
  },
  //单个不再关注确认
  followKnowEvent(e:any) {
    wx.setStorageSync('followNum', 1)
    let index = this.data.followIndex
    let item = this.data.allData[index];
    let allData = [...this.data.allOriginalData]
    let allData2 = [...this.data.allData]
    let data = {monitorId: this.data.monitorId,blockData:{}}
    if(item.platform=='gz'){
      data.blockData = {gz :[item.carId],yx : [],rr : []}
    }
    if(item.platform=='yx'){
      data.blockData = {gz :[],yx : [item.carId],rr : []}
    }
    if(item.platform=='rr'){
      data.blockData = {gz :[],yx : [],rr : [item.carId]}
    }
    this.service.batchAddBlack(jsonForm(data)).then((res:any)=>{
      allData.splice(index, 1)
      allData2.splice(index, 1)
      let carData = getBatchFilter(allData)
      this.setData({
        singleEditFlag: true
      })
      if (allData.length > 0) {
        if (allData.length > allData2.length) {
          allData2.push(allData[allData2.length])
        }
        this.setData({
          dataFlag: 1
        });
      } else {
        this.setData({
          dataFlag: 2,
        });
      }
      this.setData({
        allOriginalData: allData,
        allData: allData2,
        averagePrice: carData.averagePrice,
        lowPrice: carData.lowPrice,
        lowPriceData: carData.lowPriceData?carData.lowPriceData:null,
        gzlowPriceData: carData.gzlowPriceData?carData.gzlowPriceData:null,
        yxlowPriceData: carData.yxlowPriceData?carData.yxlowPriceData:null,
        rrlowPriceData: carData.rrlowPriceData?carData.rrlowPriceData:null,
        firstlowPriceData: carData.firstlowPriceData?carData.firstlowPriceData:null,
        followDisplay: e.detail.show,
        singleEditFlag: false
      })
      wx.showToast({
        title: res.resultMsg,
        icon: "none",
        duration: 2000
      });
    }).catch((res:any)=>{
      wx.showToast({
        title: res.resultMsg||res.message,
        icon: "none",
        duration: 2000
      });
    })
  },
  //进入选择模式
  goEdit() {
    this.setData({
      editFlag: !this.data.editFlag
    })
    if (!this.data.editFlag) {
      this.setData({
        selectAllFlag: true
      })
      this.goToSelectAll()
    }
  },
  goToSelect(e:any) {
    let num = 0
    let indexArr = []
    let index = e.detail.index;
    let item = 'allData[' + index + '].collection';
    let items = 'allOriginalData[' + index + '].collection';
    let a = [...this.data.allOriginalData]
    this.setData({
      [item]: !this.data.allData[index].collection,
      [items]: !this.data.allOriginalData[index].collection
    });
    for (let i = 0; i < a.length; i++) {
      if (a[i]['collection']) {
        num++
        indexArr.push(i)
      }
    }
    if (num == this.data.allOriginalData.length) {
      this.setData({
        selectAllFlag: true,
        selectNum: num,
        indexArr
      })
    } else {
      this.setData({
        selectAllFlag: false,
        selectNum: num,
        indexArr
      })
    }
  },
  //全选
  goToSelectAll() {
    let num = 0
    let indexArr = []
    let d = [...this.data.allData]
    let a = [...this.data.allOriginalData]
    for (let i = 0; i < d.length; i++) {
      d[i]['collection'] = !this.data.selectAllFlag
    }
    for (let i = 0; i < a.length; i++) {
      a[i]['collection'] = !this.data.selectAllFlag
      indexArr.push(i)
    }
    if (!this.data.selectAllFlag) {
      num = this.data.allOriginalData.length
      indexArr
    } else {
      num = 0
      indexArr = []
    }
    this.setData({
      allOriginalData: a,
      allData: d,
      selectAllFlag: !this.data.selectAllFlag,
      selectNum: num,
      indexArr
    })
  },
  //批量不再关注
  deleteBatchItem() {
    let indexArr = this.data.indexArr
    if (indexArr.length == 0) {
      this.setData({
        editFlag: false
      })
      return;
    }
    this.setData({
      followText: '即将屏蔽' + this.data.selectNum + '辆车源，屏蔽后本次监控将不再获取该车源信息',
      followType: 2,
      followDisplay: 'block'
    })
  },
  //批量不再关注 确认
  followConfirmEvent(e:any){
    let indexArr = this.data.indexArr
    let arr = [...this.data.allOriginalData]
    //a 不再关注之后 遗留的车源数据
    // let a = arr.filter((item, index) => {
    //   return indexArr.indexOf(index) == -1
    // })
    //b 不再关注的车源，添加黑名单
    let b = arr.filter((item, index) => {
      return item&&indexArr.indexOf(index) > -1
    })
    let gzId = [];
    let yxId = [];
    let rrId = [];
    for (let i = 0; i < b.length; i++) {
      if (b[i].platform == 'gz') {
        gzId.push(b[i].carId)
      }
      if (b[i].platform == 'yx') {
        yxId.push(b[i].carId)
      }
      if (b[i].platform == 'rr') {
        rrId.push(b[i].carId)
      }
    }
    let data = {monitorId: this.data.monitorId,blockData:{}}
    data.blockData = {gz: gzId,yx: yxId,rr:rrId}
    this.service.batchAddBlack(jsonForm(data)).then((res:any)=>{
      this.setData({
        followDisplay: e.detail.show,
        editFlag: false,
        allData: []
      })
      wx.showToast({
        title: res.resultMsg,
        icon: "none",
        duration: 2000
      });
      this.getMonitorData(false)
    }).catch((res:any)=>{
      wx.showToast({
        title: res.resultMsg||res.message,
        icon: "none",
        duration: 2000
      });
    })
  },
  //查找无数据，点击文字查看全部
  goToMAllSelect(e:any) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(e.detail.index)
  },
  //右边edit组件筛选
  goMselect(e:any) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(e.detail)
  },
  //列表加载完，底部文字查看全部
  goTocheckAll() {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.setData({
      allData: []
    })
    this.getMonitorData(1)
  },
  getUsedCarData(){
    const app = getApp<IAppOption>();
    let searchData = app.globalData.monitorSearchData;
    let enoughList:any = [];
    Promise.all([getGuaZiCarData(2, transformFilter.transformFilter(searchData,'gz')),getYouxinCarData(2, transformFilter.transformFilter(searchData,'yx') ),getRenRenCarData(2, transformFilter.transformFilter(searchData,'rr'))].map((promiseItem:any)=>{
      return promiseItem.catch((err:any)=>{
        return err
      })
    })).then(res=>{
      let r0:any = res[0];
      let r1:any = res[1];
      let r2:any = res[2];
      if([r0, r1, r2].filter((item) => item.code && (item.code === -100||item.code === -200)).length === 3){
        this.setData({
          loadingDisplay: "none",
          dataFlag:3
        })
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
          sortType: searchData.sortType,
          bottomType: 2,
        });
      }else{
        if(r0&&r0.data){
          enoughList.push({
            key: "gz",
            name: "瓜子",
            value: r0.count
          });
        }
        if(r1&&r1.data){
          enoughList.push({
            key: "yx",
            name: "优信",
            value: r1.count
          });
        }
        if(r2&&r2.data){
          enoughList.push({
            key: "rr",
            name: "人人",
            value: r2.count
          });
        }
        enoughList.sort(compareSort("value", "desc"));
        // -1 表示车辆数未知；接口请求失败或者其他原因
        if(r0&&r0.code<0){enoughList.push({key:'gz',name:'瓜子',value:-1})}
        if(r1&&r1.code<0){enoughList.push({key:'yx',name:'优信',value:-1})}
        if(r2&&r2.code<0){enoughList.push({key:'rr',name:'人人',value:-1})}
        let carData=getUsedCardAllData({
          gzCount:r0.count||-1,
          gzData:r0.data||[],
          yxCount:r1.count||-1,
          yxData:r1.data||[],
          rrCount:r2.count||-1,
          rrData:r2.data||[],
          type: 2
        })
        if(carData.allCount&&carData.allCount>0&&carData.filterData.length>0){
          this.setData({
            dataFlag:1,
          })
        }else{
          this.setData({
            dataFlag:2,
          })
        }
        this.setData({
          loadingDisplay: "none",
          allCount: carData.allCount,
          allOriginalData: carData.filterData,
          allData:carData.filterData.slice(0, 5),
          gzFilterData:carData.gzFilterData,
          yxFilterData:carData.yxFilterData,
          rrFilterData:carData.rrFilterData,
          sourceData:carData.sourceData,
          averagePrice:carData.averagePrice,
          lowPrice:carData.lowPrice,
          lowPriceData: carData.lowPriceData?carData.lowPriceData:null,
          gzlowPriceData: carData.gzlowPriceData?carData.gzlowPriceData:null,
          yxlowPriceData: carData.yxlowPriceData?carData.yxlowPriceData:null,
          rrlowPriceData: carData.rrlowPriceData?carData.rrlowPriceData:null,
          firstlowPriceData:carData.firstlowPriceData?carData.firstlowPriceData:null,
          gzCount:carData.gzCount,
          yxCount:carData.yxCount,
          rrCount:carData.rrCount,
          enoughList,
          enoughBottom: false,
          bottomType: 2,
        })
      }
    }).catch(res=>{
      console.log(res)
      this.setData({
        loadingDisplay: "none",
        dataFlag:3
      })
    })
  },
  //结束监控
  getStopMonitor(){
    //this.getUsedCarData()
    this.setData({
      stopDisplay: 'block',
    })
  },
  //结束监控-取消
  getStop(e:any){
    this.setData({
      stopDisplay: e.detail.stopShow,
    })
  },
  //结束监控确认
  getStopConfirm(e:any) {
    this.service.endMonitor(this.data.monitorId).then((res:any)=>{
      wx.showToast({
        title: res.resultMsg||res.message,
        icon: "none",
        duration: 2000
      })
      this.setData({
        stopDisplay: e.detail.stopShow,
      })
      wx.navigateBack({
        delta: 1
      })
    }).catch((res:any)=>{
      wx.showToast({
        title: res.resultMsg||res.message,
        icon: "none",
        duration: 2000
      })
    })
    
  },
  //保存修改
  goSave() {
    let count = this.data.allCount
    if (count > 50) {
      this.setData({
        monitorenoughDisplay: 'block',
        dialogTitle: '车源充足',
        dialogText: '符合条件的车源过多,无法保存修改 您可以重新查询,也可以直接前往各平台 查看具体车源。',
        dialogBtn: '知道了'
      })
    } else {
      this.setData({
        updateMonitorDisplay: 'block'
      })
    }
  },
  //保存修改-取消
  getUpdateCancelEvent(e:any) {
    this.setData({
      updateMonitorDisplay: e.detail.updateShow
    })
  },
  //保存修改-确认
  getUpdateConfrimEvent(e:any){
    this.setData({
      updateMonitorDisplay: e.detail.updateShow
    })
    this.getUpdateMonitor()
  },
  getUpdateMonitor(){
    let data={
      monitorId: this.data.monitorId,
      sourceData: this.data.sourceData,
      allOriginalData: this.data.allOriginalData,
      lowPrice: this.data.lowPrice,
      allCount: this.data.allCount,
      gzCount: this.data.gzCount,
      yxCount: this.data.yxCount,
      rrCount: this.data.rrCount,
    }
    let updateParam=jsonForm(updateMonitorParam(data))
    //console.log(updateParam)
    wx.showLoading({
      title: '正在修改监控...',
      mask: true
    });
    this.service.updateMonitor(updateParam).then((res:any)=>{
      wx.hideLoading();
      wx.showToast({
        title: res.resultMsg,
        duration: 2000,
        icon:'none'
      })
      wx.navigateBack({
        delta: 1
      })
    }).catch((error:any)=>{
      wx.showToast({
        title: error.message||error.resultMsg,
        duration: 2000,
        icon:'none'
      })
    })
  },
  goToDetail() {
    const app = getApp<IAppOption>();
    app.globalData.usedCarListData = {
      allCount: this.data.allCount,
      gzCount:this.data.gzCount,
      yxCount:this.data.yxCount,
      rrCount:this.data.rrCount,
      showCount: this.data.allOriginalData.length,
      averagePrice: this.data.averagePrice,
      lowPrice: this.data.lowPrice,
      lowPriceData: this.data.lowPriceData,
      gzlowPriceData: this.data.gzlowPriceData,
      yxlowPriceData: this.data.yxlowPriceData,
      rrlowPriceData: this.data.rrlowPriceData,
      firstlowPriceData: this.data.firstlowPriceData,
      enoughList: this.data.enoughList,
      bottomType: this.data.bottomType,
      taskTime: this.data.taskTime,
      startTimeName: this.data.startTimeName,
      fee: this.data.fee,
      monitorId: this.data.monitorId,
      totalFee: this.data.totalFee, //消耗盯盯币
      sortType: this.data.sortType,
      allOriginalData: this.data.allOriginalData,
      sourceData: this.data.sourceData,
      gzSelectCount:this.data.gzCount>-1?this.data.gzFilterData.length:-1,
      yxSelectCount:this.data.yxCount>-1?this.data.yxFilterData.length:-1,
      rrSelectCount:this.data.rrCount>-1?this.data.rrFilterData.length:-1,
    };
    this.setData({
      editFlag: false,
      selectAllFlag: true
    })
    this.goToSelectAll()
    wx.navigateTo({
      url: "../statistics/statistics"
    });
  },
  //立即刷新
  goRefresh(){
    this.onCarShow()
  },
  //返回到监控列表页面
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  //车源充足
  getEnoughEvent(e:any){
    this.setData({
      monitorenoughDisplay: e.detail.enoughShow
    });
  },
});