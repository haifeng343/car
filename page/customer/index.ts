import MineService from '../mine/service';
import { getSessionKey } from '../../utils/wx';

Page({
  data: {
    wechatid: 'bangdingding01'
  },

  isAuth: false,

  submitFlag: false,

  mineService: new MineService(),

  handleSetClipboardData() {
    wx.setClipboardData({
      data: this.data.wechatid,
      success: () => {
        wx.showToast({
          title: '复制成功!'
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败!'
        });
      }
    });
  },

  handleGotoGuide() {
    wx.navigateTo({ url: '/page/public/public' });
  },

  gotoFeedBack() {
    wx.navigateTo({ url: '/page/feedback/index' });
  },

  handleClickFeedBack() {
    if (this.isAuth === true) {
      this.gotoFeedBack();
    } else {
      this.setData({ showAuthDialog: true });
    }
  },

  handleGetUserInfo(event: CustomEvent) {
    const userInfo = event.detail.userInfo.detail;

    const { iv, encryptedData } = userInfo;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: '为了更好的使用效果，请同意用户信息授权',
        icon: 'none'
      });
      this.setData({
        showAuthDialog: false
      });
      return;
    }

    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '获取授权信息...',
        mask: true
      });
      this.setData({ showAuthDialog: false });
      getSessionKey().then((sessionKey) => {
        const data = {
          session_key: sessionKey,
          iv,
          encryptedData
        };
        this.auth(data);
      });
    }
  },

  auth(data: AuthData) {
    this.mineService
      .auth(data)
      .then(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录成功'
        });
        this.gotoFeedBack();
      })
      .catch((error: BasePromiseError) => {
        console.error(error);
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        });
      });
  },

  handleCloseAuthDialog() {
    wx.showToast({
      title: '为了更好的使用效果，请同意用户信息授权',
      icon: 'none'
    });
    this.setData({
      showAuthDialog: false
    });
  },

  onLoad() {
    const app = getApp();
    const { isAuth } = app.globalData;
    this.isAuth = isAuth;
  }
});
