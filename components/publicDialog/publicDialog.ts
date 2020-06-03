Component({
  properties: {

  },
  data: {

  },
  methods: {
    bindClose(){
      let detail={
        publicShow:'none',
      }
      this.triggerEvent('publicEvent', detail)
    },
    bindConfirm(){
      let detail={
        publicShow:'none',
      }
      this.triggerEvent('publicConfrimEvent', detail)
    },
    stopEvent() {},
    preventTouchMove() { }
  }
})
