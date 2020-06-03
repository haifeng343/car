import BrandPageData, { IBrandData, ISeriesData } from './data';
import BrandSelectService from './service';
import {
  SearchDataSubject,
  MonitorSearchDataSubject
} from '../../utils/searchDataStream';

interface ISubmitData {
  brandName: string;
  brandId: IBrandId;
  seriesName: string;
  seriesID: ISeriesID;
  searchJson: string;
}

Page({
  data: new BrandPageData(),

  service: new BrandSelectService(),

  type: 1,

  scrollFlag: false,

  onLoad(options) {
    const { type } = options;

    if (type) {
      this.type = +type;
    }

    this.service
      .getBrandList()
      .then((brandList) => {
        const indexList = [{ label: '热门', value: 'top' }];
        brandList.forEach((item) => {
          indexList.push({ label: item.pinyin, value: item.pinyin });
        });
        this.setData({ brandList, indexList, isLoaded: true });
        wx.nextTick(() => {
          const app = getApp<IAppOption>();
          const searchData =
            this.type === 1
              ? app.globalData.searchData
              : app.globalData.monitorSearchData;
          const bid = searchData.brandId.id;
          const sid = searchData.seriesID.id;
          if (bid) {
            let currentBrand: IBrandData;
            for (const item of brandList) {
              for (const item2 of item.brandList) {
                if (item2.id === bid) {
                  currentBrand = item2;
                }
              }
            }

            this.scrollFlag = true;
            if (typeof currentBrand! !== 'undefined') {
              this.setData({
                currentBrand
              });
              this.getSeriesListByBrandId(currentBrand.id)
                .then(() => {
                  this.setData({
                    showSeries: true,
                    currentView: `brandId-${bid}`
                  });

                  wx.nextTick(() => {
                    this.setData({
                      currentSeries: this.data.seriesList.find(
                        (item) => item.id === sid
                      ),
                      currentSeriesView: `seriesId-${sid}`
                    });
                  });
                })
                .catch((error) => {
                  console.error(`获取车系列表失败, 品牌ID: ${currentBrand.id}`);
                  console.error(error);
                });
            }
          }
        });
      })
      .catch((error) => {
        console.error(error);
        this.setData({ isLoaded: true });
        wx.showToast({
          title: `获取品牌失败!请联系客服!`,
          icon: 'none'
        });
      });
    this.service
      .getHotBrand()
      .then((hotList) => {
        this.setData({ hotList });
      })
      .catch((error) => {
        console.error(error);
        wx.showToast({
          title: `获取热门品牌失败!请联系客服!`,
          icon: 'none'
        });
      });
  },

  handlePageScroll() {
    if (this.scrollFlag === true) {
      this.scrollFlag = false;
      return;
    }
    if (this.data.showSeries === true) {
      this.setData({ showSeries: false });
    }
  },

  handleSubmit(data: ISubmitData) {
    const app = getApp<IAppOption>();

    const searchData =
      this.type === 1
        ? app.globalData.searchData
        : app.globalData.monitorSearchData;

    const result: IAnyObject = {};

    (Object.keys(data) as (keyof ISubmitData)[]).forEach((key) => {
      if (JSON.stringify(data[key]) !== JSON.stringify(searchData[key])) {
        result[key] = data[key];
      }
    });

    if (this.type === 1) {
      SearchDataSubject.next(result);
    } else if (this.type === 2) {
      MonitorSearchDataSubject.next(result);
    }
  },

  handleSelectAllBrand() {
    const data: ISubmitData = {
      brandName: '',
      brandId: {},
      seriesName: '',
      seriesID: {},
      searchJson: ''
    };

    this.handleSubmit(data);

    wx.navigateBack({ delta: 1 });
  },

  handleSelectBrand(event: BaseEvent) {
    const item = event.currentTarget.dataset.item as IBrandData;
    this.setData({ showSeries: true, currentBrand: item, currentSeries: null });
    this.getSeriesListByBrandId(item.id);
  },

  getSeriesListByBrandId(id: number) {
    return this.service
      .getSeriesListByBrandId(id)
      .then((seriesList) => {
        this.setData({ seriesList });
      })
      .catch((error) => {
        console.error(`获取车系列表失败, 品牌ID: ${id}`);
        console.error(error);
        wx.showToast({
          title: `获取车系失败!请联系客服!`,
          icon: 'none'
        });
      });
  },

  handleSelectSeries(event: BaseEvent) {
    const item = event.currentTarget.dataset.item as ISeriesData;

    const searchObject: ISearchObject = {};

    const brandData = this.data.currentBrand!.value;

    if (brandData.rr) {
      searchObject.rr = { brand: brandData.rr.name };
    }

    if (brandData.gz) {
      searchObject.gz = { minor: brandData.gz.value };
    }

    if (brandData.yx) {
      searchObject.yx = { brandid: brandData.yx.brandid };
    }

    const seriesData = item.value;

    if (seriesData.rr) {
      searchObject.rr!.car_series = seriesData.rr.name;
    }

    if (seriesData.gz) {
      searchObject.gz!.tag = seriesData.gz.value;
    }

    if (seriesData.yx) {
      searchObject.yx!.serieid = seriesData.yx.serieid;
    }

    const data = {
      brandName: this.data.currentBrand!.name,
      brandId: this.data.currentBrand!.value,
      seriesName: item.seriesName,
      seriesID: seriesData,
      searchJson: JSON.stringify(searchObject)
    };

    this.handleSubmit(data);

    wx.navigateBack({ delta: 1 });
  },

  handleGotoView(event: BaseEvent) {
    const { value } = event.currentTarget.dataset;
    this.setData({ currentView: value });
  }
});
