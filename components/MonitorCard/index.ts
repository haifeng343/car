import { BehaviorSubject, Subscription, operators } from '../../rx/rx';

Component({
  properties: {
    data: {
      type: Object,
      value: {}
    },
    rentType: {
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
        xSubscription: Subscription | null;
      } = this as any;

      _this.touchmoveStream = new BehaviorSubject<number>(0);

      _this.touchendStream = new BehaviorSubject<boolean>(false);

      const moveDirectionStream = _this.touchmoveStream.pipe(
        operators.pairwise(),
        operators.map<[number, number], number>(([p, n]) => (n - p > 0 ? 1 : -1)),
        operators.startWith(1)
      );

      const xStream = _this.touchendStream.pipe(
        operators.withLatestFrom(moveDirectionStream),
        operators.filter<[boolean, number]>(([touchend]) => touchend === true),
        operators.map<[boolean, number], number>(([, direction]) =>
          direction > 0 ? 0 : -70
        )
      );

      _this.xSubscription = xStream.subscribe((x: number) => {
        this.setData({ x });
      });
    },
    detached() {
      const _this: {
        touchmoveStream: BehaviorSubject<number>;
        touchendStream: BehaviorSubject<boolean>;
        xSubscription: Subscription | null;
      } = this as any;

      _this.touchmoveStream.complete();
      _this.touchendStream.complete();
      if (_this.xSubscription) {
        _this.xSubscription.unsubscribe();
      }
    }
  },

  methods: {
    handleMovableChange(e: CustomEvent) {
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

    handleRemoveClick() {
      this.triggerEvent('onRemove', this.data.data.id);
    }
  }
});
