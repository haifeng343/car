import { authSubject } from '../../utils/auth';
import { getSessionKey } from '../../utils/wx';
import MineService from './service';
import MinePageData from './data';
const app = getApp();

Page({
  data: new MinePageData(),

  service: new MineService(),

  action: '',

  submitFlag: false,

  shareFlag: false,

  isFirstShare: false,

  depositType: '',

  checkFirstShare() {
    return this.service.checkFirstShare().then((resp) => {
      const { isFirstShare } = resp;
      this.isFirstShare = isFirstShare;
      this.setData({
        shareDesc: isFirstShare ? '可获得兑换券' : ''
      });
    });
  },

  getUserInfo() {
    return this.service
      .getUserInfo()
      .then((userInfo) => {
        this.setData(userInfo);
        if (this.action) {
          this.handleAction();
          this.action = '';
        }
      })
      .catch((error: BasePromiseError) => {
        wx.showToast({
          title: `获取用户信息失败!${error.message}`,
          icon: 'none'
        });
      });
  },

  getCouponCount() {
    return this.service.getCouponCount().then((couponCount) => {
      if (couponCount > 0) {
        this.setData({ couponDesc: `${couponCount}张兑换券可用` });
      } else {
        this.setData({ couponDesc: '' });
      }
    });
  },

  handleClickDeposit(event: BaseEvent) {
    const { type } = event.currentTarget.dataset;
    this.depositType = type;
  },

  handleGotoDeposit(e: any) {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/page/deposit/deposit?type=' + e.currentTarget.dataset.type
      });
    } else {
      this.action = 'gotodeposit';
      this.showAuthDialog();
    }
  },

  handleShowTipDialog() {
    this.setData({ showTipDialog: true });
  },

  handleCloseTipDialog() {
    this.setData({ showTipDialog: false });
  },

  handleGotoCoupon() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/page/coupon/coupon'
      });
    } else {
      this.action = 'gotocoupon';
      this.showAuthDialog();
    }
  },

  handleGotoHistory() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/page/monitorhistory/monitorhistory'
      });
    } else {
      this.action = 'gotohistory';
      this.showAuthDialog();
    }
  },
  handleGotoFeedBack() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/page/feedback/index'
      });
    } else {
      this.action = 'gotofeedback';
      this.showAuthDialog();
    }
  },
  handleGotoFund() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/page/fund/fund'
      });
    } else {
      this.action = 'gotofund';
      this.showAuthDialog();
    }
  },
  handleAction() {
    const { action } = this;
    this.action = '';

    switch (action) {
      case 'gotodeposit':
        this.handleGotoDeposit(action);
        break;

      case 'gotofund':
        this.handleGotoFund();
        break;

      case 'gotohistory':
        this.handleGotoHistory();
        break;

      case 'share':
        this.handleGotoHistory();
        break;

      case 'gotocoupon':
        this.handleGotoCoupon();
        break;
    }
  },
  handleAuth() {
    this.action = '';
    this.showAuthDialog();
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
  handleCloseCouponDialog() {
    this.setData({ showCouponDialog: false });
  },
  showAuthDialog() {
    wx.showLoading({
      title: '获取登录授权中',
      mask: true
    });

    getSessionKey()
      .then(() => {
        wx.hideLoading();
        this.setData({ showAuthDialog: true });
      })
      .catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: '获取登录授权失败',
          icon: 'none'
        });
      });
  },

  handleShare() {
    this.setData({ showShareCard: true });
  },

  handleCloseShareCard() {
    this.setData({ showShareCard: false });
  },

  handleGetUserInfo(event: CustomEvent) {
    const userInfo = event.detail.userInfo.detail;
    const iv: string = userInfo.iv;
    const encryptedData: string = userInfo.encryptedData;

    if (!iv || !encryptedData) {
      wx.showToast({
        title: '为了更好的使用效果，请同意用户信息授权',
        icon: 'none'
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
    this.service
      .auth(data)
      .then(() => {
        this.submitFlag = false;
        wx.hideLoading();
        wx.showToast({
          title: '登录成功'
        });
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

  onShow() {
    if (this.data.isAuth) {
      this.getCouponCount();
      this.getUserInfo();
      this.checkFirstShare();
    } else if (!this.service.authSubscription) {
      this.service.authSubscription = authSubject.subscribe((isAuth) => {
        console.log('Mine Page isAuth Subscription, isAuth = ' + isAuth);
        this.setData({ isAuth });
        if (isAuth) {
          this.getCouponCount();
          this.getUserInfo();
          this.checkFirstShare();
        }
      });
    }
    console.log(this.data)
    if(app.globalData.isUserBindPhone){
      this.setData({
        IsMobile:true
      })
    }
    if (this.shareFlag === true) {
      this.requestShare();
    }
  },

  onUnload() {
    if (this.service.authSubscription) {
      this.service.authSubscription.unsubscribe();
      this.service.authSubscription = null;
    }
  },

  requestShare() {
    if (this.isFirstShare === false) {
      return;
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    this.service
      .requestShare()
      .then((couponList) => {
        wx.hideLoading();
        this.isFirstShare = false;
        this.setData({ shareDesc: '', showCouponDialog: true, couponList });
      })
      .catch((error: BasePromiseError) => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: error.message,
          icon: 'none'
        });
      });
  },
  gotoBindPhone(){
    wx.navigateTo({
      url:'/page/bindPhone/bindPhone'
    })
  },
  onShareAppMessage() {
    return {
      title: '实时监控全网二手车信息，低价品牌好车一辆不错过',
      path: 'page/home/index',
      imageUrl:
        'https://piaodingding.oss-cn-hangzhou.aliyuncs.com/images/wechat/cdd/share.png'
    };
  }
});
