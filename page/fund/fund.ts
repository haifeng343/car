import FundService from './service';
import FundPageData from './data';

Page({
  data: new FundPageData(),

  service: new FundService(),

  requestFlag: false,

  handleSelectExpand(event: CustomEvent) {
    const { expand } = event.detail;
    this.setData({ canScroll: expand === false });
  },

  handletimeRangeChange(event: CustomEvent) {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });
    const timeRange = event.detail.value;
    this.setData({ timeRange, isLoaded: false, fundList: [] }, () => {
      if (this.data.fundListType === 1) {
        this.getFundList();
      } else {
        this.getCoinFundList();
      }
    });
  },

  handlebillTypeChange(event: CustomEvent) {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });
    const billType = event.detail.value;
    this.setData({ billType, isLoaded: false, fundList: [] }, () => {
      if (this.data.fundListType === 1) {
        this.getFundList();
      } else {
        this.getCoinFundList();
      }
    });
  },

  handleFundTypeChange(event: CustomEvent) {
    const fundListType = +event.currentTarget.dataset.value;
    if (this.data.fundListType !== fundListType) {
      wx.showLoading({
        title: '获取账单数据...',
        mask: true
      });
      this.setData(
        {
          fundListType,
          isLoaded: false,
          fundList: [],
          billType: 0,
          timeRange: fundListType === 1 ? 1 : 0
        },
        () => {
          if (fundListType === 1) {
            this.getFundList();
          } else {
            this.getCoinFundList();
          }
        }
      );
    }
  },

  handleGotoFundDetail(event: CustomEvent) {
    const app = getApp();
    app.fundData = event.detail;
    wx.navigateTo({ url: '/page/funddetail/index' });
  },

  getFundList() {
    this.service
      .getFundList(this.data.timeRange, this.data.billType)
      .then((fundList) => {
        wx.hideLoading();
        this.setData({ fundList, isLoaded: true });
      })
      .catch((error: BasePromiseError) => {
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: '获取账单数据失败',
          icon: 'none'
        });
      });
  },
  getCoinFundList() {
    if (this.requestFlag === false) {
      this.requestFlag = true;
      this.service
        .getCoinFundList(this.data.timeRange, this.data.billType)
        .then((fundList) => {
          this.requestFlag = false;
          wx.hideLoading();
          this.setData({ fundList, isLoaded: true });
        })
        .catch((error: BasePromiseError) => {
          console.error(error);
          this.requestFlag = false;
          wx.hideLoading();
          wx.showToast({
            title: '获取账单数据失败',
            icon: 'none'
          });
        });
    }
  },
  onLoad() {
    wx.showLoading({
      title: '获取账单数据...',
      mask: true
    });

    this.getFundList();
  }
});
