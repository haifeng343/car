import BindPhoneService from './service';

const RegExpMap = {
  mobile: /^1[34578]\d{9}$/
};
Page({
  data: {
    countDown: 0
  },

  service: new BindPhoneService(),

  submitFlag: false,

  timer: 0,

  mobile: '',

  code: '',

  startCountDown() {
    this.setData({ countDown: 60 }, () => {
      this.timer = setInterval(() => {
        if (this.data.countDown > 0) {
          this.setData({ countDown: this.data.countDown - 1 });
        } else {
          this.stopCountDown();
        }
      }, 1000);
    });
  },

  stopCountDown() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  handleMobileChange(event: any) {
    this.mobile = event.detail.value;
  },

  handleCodeChange(event: any) {
    this.code = event.detail.value;
  },

  handleGetCode() {
    if (this.mobile.length !== 11 || !RegExpMap.mobile.test(this.mobile)) {
      wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' });
      return;
    }

    if (this.submitFlag === false && this.data.countDown === 0) {
      this.submitFlag = true;
      wx.showLoading({
        title: '获取验证码...',
        mask: true
      });

      this.service
        .getCode(this.mobile)
        .then(() => {
          this.submitFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: '验证码已发送',
            icon: 'none'
          });
          this.startCountDown();
        })
        .catch((error: BasePromiseError) => {
          this.submitFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: `获取验证码失败!${error.message}`,
            icon: 'none'
          });
        });
    }
  },

  handleBindMoblie() {
    if (this.mobile.length !== 11 || !RegExpMap.mobile.test(this.mobile)) {
      wx.showToast({ title: '请填写正确的手机号码!', icon: 'none' });
      return;
    }

    if (this.code.length !== 6) {
      wx.showToast({ title: '请填写验证码!', icon: 'none' });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;

      wx.showLoading({
        title: '绑定手机号...',
        mask: true
      });

      this.service
        .bindMoblie(this.mobile, this.code)
        .then(() => {
          const app = getApp();
          app.globalData.isUserBindPhone = true;
          this.submitFlag = false;
          wx.showToast({
            title: '绑定手机号成功!'
          });
          setTimeout(() => {
            wx.navigateBack({ delta: 1 });
          }, 1000);
        })
        .catch((error: BasePromiseError) => {
          this.submitFlag = false;
          wx.showToast({
            title: `手机号码绑定失败!${error.message}`,
            icon: 'none'
          });
        });
    }
  }
});
