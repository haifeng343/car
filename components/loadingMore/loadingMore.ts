import LoadingMoreComponentData from './data';

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    show: {
      type: Boolean,
      value: true,
      observer: function observer(newValue) {
        this.computedStyle(newValue, this.data.animated);
      }
    },
    animated: {
      type: Boolean,
      value: false,
      observer: function observer(newValue) {
        this.computedStyle(this.data.show, newValue);
      }
    },
    duration: {
      type: Number,
      value: 350
    },
    type: {
      type: String,
      value: 'dot-gray'
    },
    tips: {
      type: String,
      value: '加载中'
    }
  },
  data: new LoadingMoreComponentData(),
  methods: {
    computedStyle(show, animated) {
      if (!show) {
        if (!animated) {
          this.setData({
            displayStyle: 'none'
          });
        } else {
          this.startAnimation();
        }
      } else {
        this.setData({
          displayStyle: ''
        });
      }
    },
    startAnimation() {
      setTimeout(() => {
        const data = this.data;
        const animation = data.animationInstance;
        if (!!animation) {
          animation.height(0).step();
          this.setData({
            animationData: animation.export()
          });
        }
      });
    }
  },
  lifetimes: {
    attached() {
      const animationInstance = wx.createAnimation({
        duration: this.data.duration,
        timingFunction: 'ease'
      });
      this.setData({ animationInstance: animationInstance });
      this.computedStyle(this.data.show, this.data.animated);
    }
  }
});
