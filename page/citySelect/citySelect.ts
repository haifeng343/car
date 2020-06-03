// pages/citySelect/citySelect.js
import { getLocationSetting, getLocation } from "../../utils/wx";
import { getLocationInfo } from "../../utils/map";
import CitySelectService from "./service";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    hotCity: [],
    searchList: [],
    currentTabValue: 0,
    userCity: { name: "定位中...", code: "" },
    viewIndex: "",
    indexList: ["#", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    topText: '已支持全国购，将从全国帮您搜寻本城市可购买的二手车'
  },
  service: new CitySelectService(),
  getHotCityList() {
    this.service.indexParam().then((resp:any) => {
      let data = '';
      let hotCity:any = [];
      if(resp.data && resp.data.cddUsedHotCity) {
        data = resp.data.cddUsedHotCity
      }
      data.split(',').map(item=>{
        let array = item.split('_');
        if(array[0]) {
          hotCity.push({ name: array[0], value: item })
        }
      });
      this.setData({ hotCity: hotCity })
    })
  },
  getCityList() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    this.getHotCityList();
    return this.service.getCityList().then(resp => {
      wx.hideLoading();
      this.formatData(resp.data);
    });
  },
  formatData(data:any) {
    var pl:any = [];
    this.data.indexList.forEach((item) => {
      if (item != "#") {
        pl.push({
          p: item,
          cl: []
        });
      }
    });
    for (let item of data) {
      let array = item.split('_');
      if(array.length === 3) {
        let firstLetter = array[1][0].toUpperCase();
        for (const py of pl) {
          if (py.p === firstLetter) {
            py.cl.push({name:array[0],value:item});
            break;
          }
        }
      }
    }
    this.setData({ data: pl }, () => {
      this.getUserLocation();
      this.setData({
        viewIndex: ""
      });
    });
  },

  handleGetCityInfo(event:BaseEvent) {
    let name = event.currentTarget.dataset.name;
    let value = event.currentTarget.dataset.value;
    if(value) {
      const app:IAppOption = getApp();
      if(app.globalData.searchData.city === name) {
        wx.navigateBack({delta: 1});
        return
      }
      this.service.cityDetail(name).then((resp:any)=>{
        let searchData = {city:name,cityId:{}};
        if(resp.data && resp.data.json) {
          let json = JSON.parse(resp.data.json)
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
        wx.setStorageSync('cityHistory', searchData)
        app.globalData.searchData = { ...app.globalData.searchData, ...searchData }
        wx.navigateBack({delta: 1})
      })
    }
  },

  getUserLocation() {
    getLocationSetting()
      .then(_ => getLocation())
      .then(location => this.calcCityByLocation(location))
      .catch(_ => {
        console.error("获取定位授权失败啦~");
        wx.showToast({
          title: "为了更好的使用效果，请同意地理位置信息授权",
          icon: "none"
        });
        this.calcCityByLocation(undefined);
      });
  },

  calcCityByLocation(location:any) {
    const userCity = {
      name: "定位失败",
      code: ""
    };
    if (location) {
      getLocationInfo(location).then(resp => {
        const city = resp.result.address_component.city;
        if (city) {
          let data:any = this.data.data;
          let temp:boolean = false;
          for (const pl of data) {
            const cityInfo = pl.cl.find((cl:any) => city.includes(cl.name));
            if (cityInfo) {
              userCity.name = cityInfo.name;
              userCity.code = cityInfo.value;
              temp = true;
              break;
            }
          }
          if(!temp) {
            userCity.name = "当前城市不在列表内";
            userCity.code = '';
          }
          this.setData({ userCity });
        }
      }).catch(()=>{
        this.setData({ userCity });
      });
    } else {
      this.setData({ userCity });
    }
  },

  handleRepos() {
    this.setData({
      userCity: {
        name: "定位中...",
        code: ""
      }
    });
    this.getUserLocation();
  },

  handleScrollToIndex(event:BaseEvent) {
    let item = event.currentTarget.dataset.item;
    if (item === "#") {
      this.setData({ viewIndex: "topview" });
    } else {
      this.setData({ viewIndex: `city${item}` });
    }
  },

  goToSearch() {
    wx.navigateTo({
      url: "../citySearch/citySearch"
    });
  },

  onLoad: function() {
    this.getCityList();
  }
});
