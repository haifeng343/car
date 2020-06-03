Component({
  properties: {
    bottomType: {
      type: Number //1:结束监控；2：修改监控；3：屏蔽车源
    },
    taskTime:{
      type:String
    },
    totalFee:{
      type: Number
    },
    editFlag:{
      type:Boolean
    },
    selectNum:{
      type:Number
    },
    selectAllFlag:{
      type:Boolean
    },
    fee:{
      type:Number
    },
    ddCoin:{
      type:Number
    },
  },
  methods: {
    startMonitor(){
      let detail={}
      this.triggerEvent('startMonitor', detail);
    },
    stopMonitor(){
      let detail={}
      this.triggerEvent('stopMonitorEvent', detail);
    },
    goBack(){
      let detail={}
      this.triggerEvent('goBackEvent', detail);
    },
    goSave(){
      let detail={}
      this.triggerEvent('goSaveEvent', detail);
    },
    goToSelectAll(){
      let detail={}
      this.triggerEvent('selectAllEvent', detail);
    },
    deleteBatchItem(){
      let detail={}
      this.triggerEvent('deleteBatchEvent', detail);
    }
  }
})