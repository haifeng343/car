import { BehaviorSubject, Subscription, operators } from '../../rx/rx';

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    ddCoin: {
      type: Number
    }
  },

  data: {
    x: 0
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
        operators.map(([p, n]) => (n - p > 0 ? 1 : -1)),
        operators.startWith(1)
      );

      const xStream = _this.touchendStream.pipe(
        operators.withLatestFrom(moveDirectionStream),
        operators.filter(([touchend]) => touchend === true),
        operators.map(([, direction]) => (direction > 0 ? 0 : -67))
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
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleMovableChange(e) {
      const _this: {
        touchmoveStream: BehaviorSubject<number>;
      } = this as any;
      if (e.detail.source === 'touch') {
        _this.touchmoveStream.next(e.detail.x);
      }
    },
    handleTouchend() {
      const _this: {
        touchendStream: BehaviorSubject<boolean>;
      } = this as any;
      _this.touchendStream.next(true);
    },
    delItem(e: BaseEvent) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent('clickDelete', detail);
    },
    checkDetail(e: BaseEvent) {
      let detail = {
        index: e.currentTarget.dataset.index
      };
      this.triggerEvent('checkEvent', detail);
    }
  }
});
