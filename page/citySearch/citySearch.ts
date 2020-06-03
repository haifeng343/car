import SearchService from './service';


Page({
  data: {
    result: [],
    value: '',
    resultLength: 0,
    hasAsked: false,
    isFocus: false
  },
  submitFlag: false,
  service: new SearchService(),
  inputSearch(event:CustomEvent) {
    this.setData({
      value: event.detail.value
    });
    if (event.detail.value) {
      this.handleSearch()
    }
  },
  handleSearch() {
    this.setData({ hasAsked: false });
    if (!this.data.value) {
      this.setData({
        result: [],
        hasAsked: true,
        resultLength: -1
      });
      return;
    }
    if (this.submitFlag) {
      return
    }
    this.submitFlag = true;
    wx.showLoading({
      title: '搜索中...',
      mask: true
    });
    this.service.searchCity(this.data.value).then((result:any) => {
      wx.hideLoading();
      let length = result.data.length || 0;
      this.setData({
        result: result.data || [],
        hasAsked: true,
        resultLength: length
      });
      this.submitFlag = false;
    }).catch(() => {
      wx.hideLoading();
      this.submitFlag = false;
      wx.showToast({
        title: '网络异常',
        icon: 'none'
      });
    });
  },

  //选择城市
  handleSelectCity(event:BaseEvent) {
    let item = event.currentTarget.dataset.item;
    let searchData = {city:item.cityName,cityId:{}};
    if(item.json) {
      let json = JSON.parse(item.json);
      if(json.rr) {
        searchData.cityId = { ...searchData.cityId, ...{rr:{city:json.rr.city}} }
      }
      if(json.gz) {
        searchData.cityId = {
          ...searchData.cityId, ...{
            gz: {
              city_id: json.gz.city_id,
              domain: json.gz.domain
            }
          }
        }
      }
      if(json.yx) {
        searchData.cityId = {
          ...searchData.cityId, ...{
            yx:{
              cityid:json.yx.cityid,
              provinceid:json.yx.provinceid
            }
          }
        }
      }
    }
    wx.setStorageSync('cityHistory', searchData);
    const app:IAppOption = getApp();
    app.globalData.searchData = { ...app.globalData.searchData, ...searchData };
    wx.navigateBack({
      delta: 2
    });
  },

  /**返回上一级 */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**清除输入内容 */
  clearInput() {
    this.setData({
      isFocus: false,
    }, () => {
      this.setData({ value: '', hasAsked: false })
    })
  }
});