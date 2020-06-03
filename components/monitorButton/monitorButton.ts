Component({
  properties: {
    buttonType: {
      type: Number //1:车查询列表；2：监控详情列表
    },
    dataFlag: {
      type: Number,
    },
    allCount: {
      type: Number,
    }
  },
  methods: {
    startMonitor(){
      let detail = {}
      this.triggerEvent('startMonitorEvent', detail);
    },
    goRefresh(){
      let detail = {}
      this.triggerEvent('goRefreshEvent', detail);
    },
    goBack(){
      let detail = {}
      this.triggerEvent('goBackEvent', detail);
    }
  }
})