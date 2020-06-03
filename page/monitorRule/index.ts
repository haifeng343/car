import monitorRuleData from './data';
import homeService from './service';
Page({
    data: new monitorRuleData(),
    service: new homeService(),
    onLoad() {
      this.service.getHourMoney().then((res:any)=>{
        this.setData({
          hourMoney:res.data.cddHourMoney,
        });
        wx.setStorageSync('hourMoney',res.data.cddHourMoney || 1);
      }).catch((error)=>{
        wx.hideLoading();
        wx.showToast({
          title:error.resultMsg || '你的网络可能开小差了~',
          icon:'none'
        })
      });
    },
  })