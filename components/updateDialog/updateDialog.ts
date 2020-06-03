Component({
  properties: {
    updateData:{
      type:Object
    },
    defalutData: {
      type: Object
    },
  },
  methods: {
    bindCancel() {
      let detail={updateShow:'none'}
      this.triggerEvent('updateCancelEvent', detail)
    },
    bindConfirm() {
      let detail={updateShow:'none'}
      this.triggerEvent('updateConfrimEvent', detail)
    },
    stopEvent() { },
    preventTouchMove() { }
  }
})