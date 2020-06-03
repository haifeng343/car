import { navigateToProgram } from '../../utils/monitor'
Component({
  properties: {
    list: {
      type: Array
    },
    dialogTitle:{
      type:String
    },
    dialogText: {
      type: String
    },
    dialogBtn:{
      type: String
    },
    enoughType:{ //1:查询列表页面 2：监控详情列表页面
      type:Number
    }
  },
  data: {
    gzDisplay:'none',
    plateform:'',
    cityId:{}
  },
  methods: {
    bindConfirm() {
      let detail={
        enoughShow:'none'
      }
      this.triggerEvent('enoughEvent', detail);
    },
    navigateToPlatform(e){
      let app = getApp<IAppOption>();
      let plateform = e.currentTarget.dataset.platform 
      let data: ISearchData =  this.properties.enoughType == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
      let num = wx.getStorageSync('gzjumpfirst');
      if(plateform === 'gz'){
        let city = data.cityId.gz?data.cityId.gz.city_id :''
        if(!city){
          wx.showToast({
            title: "该城市暂无瓜子车源",
            icon: "none",
            duration: 2000
          })
        }else{
          if(!num){
            wx.setStorageSync('gzjumpfirst', 1);
            this.setData({
              gzDisplay:'block',
              plateform,
              cityId:data.cityId
            })
          }else{
            navigateToProgram(plateform, '', data.cityId);
          }
        }
      }
      if(plateform === 'yx'){
        let city = data.cityId.yx?data.cityId.yx.cityid :''
        if(!city){
          wx.showToast({
            title: "该城市暂无优信车源",
            icon: "none",
            duration: 2000
          })
        }else{
          navigateToProgram(plateform,'',data.cityId)
        }
      }
      if(plateform === 'rr'){
        let city = data.cityId.rr?data.cityId.rr.city :''
        if(!city){
          wx.showToast({
            title: "该城市暂无人人车源",
            icon: "none",
            duration: 2000
          })
        }else{
          navigateToProgram(plateform,'',data.cityId)
        }
      }
    },
    getJumpCancel(){
      this.setData({gzDisplay:'none'})
    },
    getJumpConfirm(){
      this.setData({gzDisplay:'none'})
      navigateToProgram(this.data.plateform, '', this.data.cityId);
    },
    stopEvent() { },
    preventTouchMove() { }
  }
})