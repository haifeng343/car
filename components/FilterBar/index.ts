interface ITabItem {
  title: string;
  action: 'sort' | 'brand' | 'price' | 'advance';
  class: string;
  active: boolean;
  id: number;
}

Component({
  data: {
    currentPanel: '',
    animationFlag: false,
    showTopPanel: false,
    minPrice: 0,
    maxPrice: 50,
    sortList: [
      {
        label: '车价最低',
        value: 1,
        active: false
      },
      {
        label: '车价最高',
        value: 11,
        active: false
      },
      {
        label: '车龄最小',
        value: 2,
        active: false
      },
      {
        label: '里程最少',
        value: 3,
        active: false
      },
      {
        label: '首付最低',
        value: 4,
        active: false
      }
    ],
    filterList: [
      {
        title: '排序',
        action: 'sort',
        class: '',
        active: false,
        id: 1
      },
      {
        title: '品牌',
        action: 'brand',
        class: '',
        active: false,
        id: 2
      },
      {
        title: '车价',
        action: 'price',
        class: '',
        active: false,
        id: 3
      },
      {
        title: '筛选',
        action: 'advance',
        class: '',
        active: false,
        id: 4
      }
    ]
  },

  properties: {
    type: {
      type: Number,
      value: 1
    },
    data: {
      type: Object,
      value: {},
      observer(newvalue: ISearchData) {
        if (newvalue) {
          const { minPrice, maxPrice, advSort } = newvalue;
          const { sortList } = this.data;
          this.setData({
            minPrice,
            maxPrice,
            sortList: sortList.map((item) => {
              if (item.value === advSort) {
                item.active = true;
              } else {
                item.active = false;
              }
              return item;
            })
          });
        }
      }
    }
  },

  methods: {
    handleResetPrice() {
      const { minPrice, maxPrice } = this.data.data;
      this.setData({ minPrice, maxPrice });
      const _this: {
        changeList: Set<keyof ISearchData>;
      } = this as any;
      _this.changeList.add('minPrice');
      _this.changeList.add('maxPrice');
    },
    handleHideTopPanel() {
      this.setData({
        showTopPanel: false,
        sortPanelActive: false,
        animationFlag: false,
        filterList: this.data.filterList.map((item) => {
          item.active = false;
          return item;
        })
      });
      this.handleResetPrice();
    },
    closeTopPanel() {
      this.setData({ animationFlag: true });
      const topPanel = this.selectComponent('#TopPanel');
      if (topPanel) {
        topPanel.handleClosePanel();
      } else {
        this.setData({ animationFlag: false });
      }
    },
    handleClickTabitem(event: BaseEvent) {
      if (this.data.animationFlag === true) {
        return;
      }
      const tabItem = event.currentTarget.dataset.item as ITabItem;
      if (tabItem.active === true) {
        this.closeTopPanel();
      } else {
        this.setData({
          filterList: this.data.filterList.map((item) => {
            if (item.id === tabItem.id) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          })
        });
        this.handleTabitemAction(tabItem);
      }
    },
    handleTabitemAction(tabItem: ITabItem) {
      const { type } = this.data;
      switch (tabItem.action) {
        case 'sort':
          this.setData({ showTopPanel: true, currentPanel: 'sort' });
          break;
        case 'price':
          this.setData({ showTopPanel: true, currentPanel: 'price' });
          break;
        case 'brand':
          this.setData({ showTopPanel: false, currentPanel: '' });
          wx.navigateTo({ url: `/page/brandSelect/index?type=${type}` });
          this.setData({
            filterList: this.data.filterList.map((item) => {
              item.active = false;
              return item;
            })
          });
          break;
        case 'advance':
          this.setData({ showTopPanel: false, currentPanel: '' });
          wx.navigateTo({ url: `/page/filter/index?type=${type}` });
          this.setData({
            filterList: this.data.filterList.map((item) => {
              item.active = false;
              return item;
            })
          });
          break;
      }
    },
    handlePriceChange(event: CustomEvent) {
      const { max, min } = event.detail;
      this.setData({ maxPrice: max, minPrice: min });
      const _this: {
        changeList: Set<keyof ISearchData>;
      } = this as any;
      _this.changeList.add('minPrice');
      _this.changeList.add('maxPrice');
    },
    handleSelectSort(event: BaseEvent) {
      const { value } = event.currentTarget.dataset;

      const sortItem = this.data.sortList.find((item) => item.value === value);

      if (sortItem!.active === false) {
        this.setData({
          sortList: this.data.sortList.map((item) => {
            if (item === sortItem) {
              item.active = true;
            } else {
              item.active = false;
            }
            return item;
          }),
          advSort: value
        });

        const _this: {
          changeList: Set<keyof ISearchData>;
        } = this as any;

        _this.changeList.add('advSort');

        this.handleSubmit();
      }
    },
    handleSubmit() {
      this.setData({
        showTopPanel: false,
        filterList: this.data.filterList.map((item) => {
          item.active = false;
          return item;
        })
      });

      const _this: {
        changeList: Set<keyof ISearchData>;
      } = this as any;

      const changeList = _this.changeList;

      const outsideData = this.data.data;

      const insideData = this.data as IAnyObject;

      const result: IAnyObject = {};

      changeList.forEach((field: string) => {
        if (
          JSON.stringify(insideData[field]) !==
          JSON.stringify(outsideData[field])
        ) {
          result[field] = insideData[field];
        }
      });

      _this.changeList = new Set();

      this.triggerEvent('onSubmit', result);
    }
  },

  lifetimes: {
    created() {
      const _this: {
        changeList: Set<keyof ISearchData>;
      } = this as any;
      _this.changeList = new Set();
    }
  }
});
