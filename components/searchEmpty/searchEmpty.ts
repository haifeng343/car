Component({
  properties:{
    searchType:{
      type:Number,
      value:1,//1:查询列表；2：监控详情列表
    },
    mSelect: {
      type: Number
    },
  },
  methods: {
    goSelect(e){
      let index = e.currentTarget.dataset.index
      let detail={
        index:index
      }
      this.triggerEvent('selectEvent', detail);
    }
  }
})