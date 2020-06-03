Component({
  properties: {
    type: {
      type: Number,
      value: 1
    },
    data: {
      type: Object
    },
    showDetail: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isLoaded: false,
    expand: false,
    height: 'auto',
    isListInit: false,
    listHeight: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleShowDetail() {
      this.triggerEvent('onGotoDetail', this.data.data);
    },
    handleExpandClick() {
      const { expand, listHeight } = this.data;
      const height = expand ? '0PX' : `${listHeight}PX`;
      this.setData({
        expand: !expand,
        height
      });
    }
  },
  lifetimes: {
    ready() {
      setTimeout(() => {
        if (this.data.data.logList && this.data.data.logList.length > 0) {
          this.createSelectorQuery()
            .select('.withdraw-list.init')
            .boundingClientRect((rect) => {
              if (rect) {
                const listHeight = rect.height;
                this.setData({ isListInit: true, height: '0PX', listHeight });
              }
            })
            .exec();
        }
        this.setData({ isLoaded: true });
      });
    }
  }
});
