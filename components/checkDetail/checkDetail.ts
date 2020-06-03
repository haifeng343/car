Component({
  properties: {
    allCount:{
      type: Number
    },
    showCount:{
      type: Number
    },
    sortType:{
      type: Number,
      value:0 //车源偏好：1价格最低、2里程最少、3年龄最小 单选
    },
    lowPrice:{
      type: Number,
    }
  },
  methods: {
    goToDetail(){
      let detail={}
      this.triggerEvent('detailEvent', detail);
    }
  }
})