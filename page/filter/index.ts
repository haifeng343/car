import FilterPageData, { FilterSearchData } from './data';
import FilterPageService from './service';
import {
  SearchDataSubject,
  MonitorSearchDataSubject
} from '../../utils/searchDataStream';

Page({
  data: new FilterPageData(),

  service: new FilterPageService(),

  changeList: new Set<keyof ISearchData>(),

  type: 1,

  onLoad(options) {
    const { type } = options;

    if (type) {
      this.type = +type;
    }

    const app = getApp<IAppOption>();

    const outsideData =
      this.type === 1
        ? app.globalData.searchData
        : app.globalData.monitorSearchData;

    const insideData = this.data.searchData;

    const assginData: IAnyObject = {};

    (Object.keys(insideData) as (keyof ISearchData)[])
      .filter((key) => typeof outsideData[key] !== 'undefined')
      .forEach((key) => {
        if (Array.isArray(outsideData[key])) {
          assginData[key] = Object.assign([], outsideData[key]);
        } else if (typeof outsideData[key] === 'object') {
          assginData[key] = Object.assign({}, outsideData[key]);
        } else {
          assginData[key] = outsideData[key];
        }
      });

    const map = this.data.map;

    Object.keys(assginData).forEach((key) => {
      const filterItem = map.find((item) => item.field === key);
      if (filterItem) {
        if (filterItem && filterItem.optionList) {
          filterItem.optionList.forEach((item) => {
            if (
              Array.isArray(assginData[key]) &&
              assginData[key].includes(item.value)
            ) {
              item.active = true;
            } else if (item.value === assginData[key]) {
              item.active = true;
            }
          });
        }
      }
    });

    this.setData({
      data: Object.assign({}, outsideData),
      searchData: assginData as FilterSearchData,
      map
    });
  },

  handleGotoView(event: BaseEvent) {
    const { value } = event.currentTarget.dataset;
    this.setData({
      currentView: value,
      indexList: this.data.indexList.map((item) => {
        if (item.value === value) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      })
    });
  },

  handleSelectFilter(event: BaseEvent) {
    const value: number = +event.currentTarget.dataset.value;

    const field: keyof FilterSearchData = event.currentTarget.dataset.field;

    const filterItem = this.data.map.find((item) => item.field === field);

    if (filterItem) {
      const optionItem = filterItem.optionList!.find(
        (item) => item.value === value
      );

      let action = '';

      if (optionItem!.active === true) {
        if (filterItem.multi) {
          action = 'cancelselectmulti';
        } else {
          action = 'cancelselect';
        }
      } else {
        if (filterItem.multi) {
          action = 'selectmulti';
        } else {
          action = 'selectandcancel';
        }
      }

      let arr: number[] = [];
      if (Array.isArray(this.data.searchData[field])) {
        arr = this.data.searchData[field] as number[];
      }

      switch (action) {
        case 'cancelselectmulti':
          optionItem!.active = false;
          arr.splice(arr.indexOf(optionItem!.value), 1);
          this.setData({
            ['searchData.' + field]: arr.slice().sort((a, b) => a - b)
          });
          break;
        case 'cancelselect':
          optionItem!.active = false;
          this.setData({
            ['searchData.' + field]: filterItem.defaultValue
          });
          break;
        case 'selectmulti':
          optionItem!.active = true;
          arr.push(optionItem!.value);
          this.setData({
            ['searchData.' + field]: arr.slice().sort((a, b) => a - b)
          });
          break;
        case 'selectandcancel':
          optionItem!.active = true;
          this.setData({
            ['searchData.' + field]: optionItem!.value
          });
          filterItem.optionList!.forEach((item) => {
            if (item.value !== optionItem!.value) {
              item.active = false;
            }
          });
          break;
      }

      this.setData({
        ['map']: this.data.map.slice()
      });

      this.changeList.add(field as keyof ISearchData);
    }
  },

  handleRangeChange(event: CustomEvent) {
    const [
      minField,
      maxField
    ]: (keyof FilterSearchData)[] = event.currentTarget.dataset.field;

    const step: string = event.currentTarget.dataset.step.toString().split('.');

    const min: number = event.detail.min;

    const max: number = event.detail.max;

    this.changeList.add(minField as keyof ISearchData);

    this.changeList.add(maxField as keyof ISearchData);

    const digit = step[1] ? step[1].length : 0;

    const minText = min.toFixed(digit);

    const maxText = max.toFixed(digit);

    this.setData({
      ['searchData.' + minField]: +minText,
      ['searchData.' + maxField]: +maxText
    });
  },

  handleResetToDefault() {
    const outsideData = this.data.data;

    const insideData = this.data.searchData;

    const assginData: IAnyObject = {};

    const { map } = this.data;

    (Object.keys(insideData) as (keyof ISearchData)[])
      .filter((key) => typeof outsideData![key] !== 'undefined')
      .filter((key) =>
        map.find((item) => {
          if (typeof item.field === 'string') {
            return item.field === key;
          } else if (Array.isArray(item.field)) {
            return item.field.includes(key);
          }
          return false;
        })
      )
      .forEach((key) => {
        this.changeList.add(key as keyof ISearchData);

        const filterItem = map.find((item) => {
          if (typeof item.field === 'string') {
            return item.field === key;
          }
          if (Array.isArray(item.field)) {
            return item.field.includes(key);
          }
          return false;
        })!;
        const { defaultValue, field } = filterItem;
        if (typeof field === 'string') {
          if (Array.isArray(defaultValue)) {
            assginData[key] = Object.assign([], defaultValue);
          } else if (typeof outsideData![key] === 'object') {
            assginData[key] = Object.assign({}, defaultValue);
          } else {
            assginData[key] = defaultValue;
          }
        } else if (Array.isArray(field)) {
          assginData[field[0]] = defaultValue[0];
          assginData[field[1]] = defaultValue[1];
        }
      });

    Object.keys(assginData).forEach((key) => {
      const filterItem = map.find((item) => item.field === key);
      if (filterItem && filterItem.optionList) {
        filterItem.optionList.forEach((item) => {
          if (
            Array.isArray(assginData[key]) &&
            assginData[key].includes(item.value)
          ) {
            item.active = true;
          } else if (item.value === assginData[key]) {
            item.active = true;
          } else {
            item.active = false;
          }
        });
      }
    });

    this.setData({ searchData: assginData as FilterSearchData, map });
  },

  handleSubmit() {
    const outsideData = this.data.data as IAnyObject;

    const insideData = this.data.searchData as IAnyObject;

    const result: IAnyObject = {};

    this.changeList.forEach((field) => {
      if (
        JSON.stringify(insideData[field]) !== JSON.stringify(outsideData[field])
      ) {
        result[field] = insideData[field];
      }
    });

    this.changeList = new Set<keyof ISearchData>();

    if (this.type === 1) {
      SearchDataSubject.next(result);
    } else if (this.type === 2) {
      MonitorSearchDataSubject.next(result);
    }

    wx.navigateBack({ delta: 1 });
  }
});
