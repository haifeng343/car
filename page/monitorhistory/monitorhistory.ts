import MonitorHistroyService from './service';
import MonitorHistoryPageData from './data';

Page({
  data: new MonitorHistoryPageData(),

  service: new MonitorHistroyService(),

  submitFlag: false,

  targetMonitorId: -1,

  onLoad() {
    // wx.showLoading({
    //   mask: true
    // });
    this.getCarHistory()
  },
  getCarHistory(){
    this.service
      .getMonitorCarList()
      .then(monitorList => {
        wx.hideLoading();
        this.setData({ isLoaded: true, monitorList });
      })
      .catch(error => {
        this.setData({ isLoaded: false, monitorList: [] });
        console.error(error);
        wx.hideLoading();
        wx.showToast({
          title: `获取历史监控数据失败!${error.message}`,
          icon: 'none'
        });
      });
  },
  getmonitorEndEvent(e:any) {
    this.setData({
      monitorEndDisplay: e.detail.value,
    })
  },
  handleFundTypeChange(event:any) {
    const fundListType = +event.currentTarget.dataset.value;
    if (this.data.fundListType !== fundListType) {
      wx.showLoading({
        title: '获取历史数据...',
        mask: true
      });
      this.setData(
        {
          fundListType,
          isLoaded: false,
          monitorList: [],
        },
        () => {
          this.getCarHistory();
        }
      );
    }
  },
  handleRemove(event:any) {
    const monitorId = event.detail;
    this.targetMonitorId = monitorId;
    this.setData({
      monitorEndDisplay:'block'
    })
  },
  getmonitorEndConfirmEvent(){
    this.handleDialogConfirm();
  },
  handleDialogClose() {
    const showDialog = false;
    this.setData({ showDialog });
  },

  handleDialogConfirm() {
    if (this.submitFlag === false) {
      this.submitFlag = true;
      wx.showLoading({
        title: '请稍候...',
        mask: true
      });
      this.service
        .removeCarHistoryMonitor(this.targetMonitorId)
        .then(monitorList => {
          wx.hideLoading();
          this.submitFlag = false;
          this.setData({ monitorList, monitorEndDisplay: 'none' });
          wx.showToast({ title: '操作成功!' });
        })
        .catch(error => {
          wx.hideLoading();
          this.submitFlag = false;
          wx.showToast({
            title: `结束监控失败!${error.message}`,
            icon: 'none'
          });
        });
    }
  }
});
