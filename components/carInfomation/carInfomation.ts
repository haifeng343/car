Component({
  data: {
    showDialog: false
  },
  properties: {},
  methods: {
    closeDialog() {
      this.setData({
        showDialog: false
      });
    }
  }
});
