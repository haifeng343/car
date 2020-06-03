import { navigateToProgram } from '../../utils/monitor';
import { BehaviorSubject, operators, Subscription } from '../../rx/rx';
Component({
  properties: {
    item: {
      type: Object
    },
    movable: {
      type: Boolean,
      value: false //开始是否可以滑动；true 是滑
    },
    idx: {
      type: Number
    },
    cardType: {
      type: Number,
      value: 1 //1:查询列表页面；2：监控详情列表页面
    },
    editFlag: {
      //全选标记
      type: Boolean,
      observer(newValue) {
        if (newValue) {
          this.setData({
            x: 30
          });
        } else {
          const _this: {
            touchmoveStream: BehaviorSubject<number>;
            touchendStream: BehaviorSubject<boolean>;
          } = this as any;
          _this.touchmoveStream.next(0);
          _this.touchendStream.next(true);
        }
      }
    },
    singleEditFlag: {
      //单选标记
      type: Boolean,
      observer(newValue) {
        if (newValue === true) {
          const _this: {
            touchmoveStream: BehaviorSubject<number>;
            touchendStream: BehaviorSubject<boolean>;
          } = this as any;
          _this.touchmoveStream.next(0);
          _this.touchendStream.next(true);
        }
      }
    }
  },
  data: {
    x: 0,
    gzDisplay:'none',
    plateform:'',
    carid:'',
    cityId:{}
  },
  lifetimes: {
    created() {
      const _this: {
        touchmoveStream: BehaviorSubject<number>;
        touchendStream: BehaviorSubject<boolean>;
        xSubscription: Subscription;
      } = this as any;

      _this.touchmoveStream = new BehaviorSubject<number>(0);

      _this.touchendStream = new BehaviorSubject<boolean>(false);

      const moveDirectionStream = _this.touchmoveStream.pipe(
        operators.pairwise(),
        operators.map(([p, n]) => (n - p >= 0 ? 1 : -1)),
        operators.startWith(1)
      );

      const xStream = _this.touchendStream.pipe(
        operators.withLatestFrom(moveDirectionStream),
        operators.filter(([touchend]) => touchend === true),
        operators.map(([, direction]) => (direction > 0 ? 0 : -64))
      );

      _this.xSubscription = xStream.subscribe((x) => {
        this.setData({ x });
      });
    },
    detached() {
      const _this: {
        touchmoveStream: BehaviorSubject<number>;
        touchendStream: BehaviorSubject<boolean>;
        xSubscription: Subscription;
      } = this as any;
      _this.touchmoveStream.complete();
      _this.touchendStream.complete();
      if (_this.xSubscription) {
        _this.xSubscription.unsubscribe();
      }
    },
    ready() {
      let num = wx.getStorageSync('autoswiperNum');
      if (this.properties.idx == 0 && !num && this.properties.movable) {
        wx.setStorageSync('autoswiperNum', 1);
        this.setData({
          x: -64
        });
        setTimeout(() => {
          this.setData({
            x: 0
          });
        }, 2000);
      }
    }
  },
  methods: {
    handleMovableChange(e) {
      if (this.properties.editFlag) {
        return;
      }
      if (e.detail.source === 'touch') {
        const _this: {
          touchmoveStream: BehaviorSubject<number>;
        } = this as any;
        let x = e.detail.x;
        if (x > 0) {
          x = 0;
        }
        if (x < -64) {
          x = -64;
        }
        _this.touchmoveStream.next(x);
      }
    },
    handleTouchend() {
      if (this.data.editFlag) {
        return;
      }
      const _this: {
        touchendStream: BehaviorSubject<boolean>;
      } = this as any;
      _this.touchendStream.next(true);
    },
    goToPlatformDetail(e) {
      let app = getApp<IAppOption>();
      let plateform = e.currentTarget.dataset.platform;
      let carid = e.currentTarget.dataset.carid;
      let data: ISearchData =
        this.data.cardType == 1
          ? app.globalData.searchData
          : app.globalData.monitorSearchData;
      if (this.properties.editFlag) {
        this.selectItem(e);
        return;
      }
      if(plateform === 'gz'){
        let num = wx.getStorageSync('gzjumpfirst');
        if(!num){
          wx.setStorageSync('gzjumpfirst', 1);
          this.setData({
            gzDisplay:'block',
            plateform,
            carid,
            cityId:data.cityId
          })
        }else{
          navigateToProgram(plateform, carid, data.cityId);
        }
      }else{
        navigateToProgram(plateform, carid, data.cityId);
      }
    },
    delItem(e) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent('deleteEvent', detail);
    },
    selectItem(e) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent('selectItemEvent', detail);
    },
    getJumpCancel(){
      this.setData({gzDisplay:'none'})
    },
    getJumpConfirm(){
      this.setData({gzDisplay:'none'})
      navigateToProgram(this.data.plateform, this.data.carid, this.data.cityId);
    }
  }
});
