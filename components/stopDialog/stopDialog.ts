Component({
  properties: {
    startTimeName:{
      type:String
    },
    taskTime: {
      type: String
    },
    fee: {
      type: String
    },
    totalFee: {
      type: String
    }
  },
  methods:{
    bindCancel() {
      let detail={
        stopShow:'none'
      }
      this.triggerEvent('stopCancelEvent', detail)
    },
    bindConfirm() {
      let detail={
        stopShow:'none'
      }
      this.triggerEvent('stopConfrimEvent', detail)
    },
    stopEvent() { },
    preventTouchMove() {}
  }
})