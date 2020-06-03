Component({
  properties: {},

  data: {},
  methods: {
    bindCancel() {
      this.triggerEvent('monitorStartEvent', { value: 'none' });
    },
    bindConfirm() {
      this.triggerEvent('monitorStartConfirmEvent', { value: 'none' });
    },
    stopEvent() {},
    preventTouchMove() {}
  }
});
