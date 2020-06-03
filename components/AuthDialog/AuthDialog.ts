Component({
  methods: {
    handleGetUserInfo: function(userInfo) {
      this.triggerEvent('onConfirm', { userInfo });
    },
    handleCancel: function() {
      this.triggerEvent('onCancel');
    }
  }
});
