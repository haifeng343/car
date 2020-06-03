Component({
  properties: {
    src: {
      type: String
    },
    defaultImage:{ //图片预加载图
      type: String,
      value:"../../assets/image/default_image.png"
    },
    defaultNoneImage:{ //图片无展示图
      type: String,
      value:"../../assets/image/long_default_image.png"
    },
    mode: {
      type: String,
      value:"aspectFill"
    },
    defaultTime: {
      type: Number,
      value: 3000
    }
  },
  data: {
    isLoaded: false,
    isDestroyBase: false
  },
  methods: {
    handleImageLoaded() {
      this.setData(
        {
          isLoaded: true
        },
        () => {
          setTimeout(() => {
            this.setData({ isDestroyBase: true });
          }, this.data.defaultTime);
        }
      );
    }
  }
})