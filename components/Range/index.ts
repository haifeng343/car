import { operators, Subject, Subscription } from '../../rx/rx';
import RangeComponentData from './data';

Component({
  data: new RangeComponentData(),
  properties: {
    min: {
      type: Number,
      value: 0,
      observer(newvalue: number) {
        const _this: {
          isTouchEnd: boolean;
          minValue: number;
        } = this as any;
        if (_this.isTouchEnd === true) {
          this.calcLeftX(newvalue);
          _this.minValue = newvalue;
          wx.nextTick(() => {
            this.setData({
              distanceStyle: `left:${this.data.leftX}px;width:${this.data
                .rightX - this.data.leftX}px;`
            });
            this.calcIcon();
          });
        }
      }
    },
    max: {
      type: Number,
      value: 10000,
      observer(newvalue: number) {
        const _this: {
          isTouchEnd: boolean;
          maxValue: number;
        } = this as any;
        if (_this.isTouchEnd === true) {
          this.calcRightX(newvalue);
          _this.maxValue = newvalue;
          wx.nextTick(() => {
            this.setData({
              distanceStyle: `left:${this.data.leftX}px;width:${this.data
                .rightX - this.data.leftX}px;`
            });
            this.calcIcon();
          });
        }
      }
    },
    maxStep: {
      type: Number,
      value: 10000
    },
    minStep: {
      type: Number,
      value: 0
    },
    step: {
      type: Number,
      value: 100
    },
    tick: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleLeftTouchStart() {
      const _this: {
        moveDirectionStream: Subject<'left' | 'right'>;
        moveDirection: 'left' | 'right';
        touchendStream: Subject<boolean>;
      } = this as any;
      _this.moveDirectionStream.next('left');
      _this.moveDirection = 'left';
      _this.touchendStream.next(false);
    },
    handleLeftTouchMove(event: { id: number; value: number }) {
      const leftX = event.value;
      const _this: {
        touchmoveStream: Subject<number>;
        eventId: number;
      } = this as any;
      if (_this.eventId < event.id) {
        _this.eventId = event.id;
        _this.touchmoveStream.next(leftX);
        this.setData({
          leftX
        });
      }
    },
    handleTouchEnd() {
      const _this: {
        touchendStream: Subject<boolean>;
      } = this as any;
      _this.touchendStream.next(true);
    },
    handleRightTouchStart() {
      const _this: {
        moveDirectionStream: Subject<'left' | 'right'>;
        moveDirection: 'left' | 'right';
        touchendStream: Subject<boolean>;
      } = this as any;
      _this.moveDirection = 'right';
      _this.moveDirectionStream.next('right');
      _this.touchendStream.next(false);
    },
    handleRightTouchMove(event: { id: number; value: number }) {
      const rightX = event.value;
      const _this: {
        touchmoveStream: Subject<number>;
        eventId: number;
      } = this as any;
      if (_this.eventId < event.id) {
        _this.eventId = event.id;
        _this.touchmoveStream.next(rightX);
        this.setData({
          rightX
        });
      }
    },
    calcIcon() {
      const { leftX, rightX, containerWidth, stepWidth } = this.data;
      let leftIcon = 'uniE953';
      let rightIcon = 'uniE954';
      if (leftX > 0) {
        leftIcon = 'uniE955';
      }
      if (rightX < containerWidth) {
        rightIcon = 'uniE955';
      }
      if (rightX - leftX - stepWidth < 0.01) {
        leftIcon = 'uniE954';
        rightIcon = 'uniE953';
      }
      this.setData({ leftIcon, rightIcon });
    },
    calcLeftX(min: number) {
      const leftX = this.calcX(min);
      this.setData({
        leftX,
        leftStyle: `transform: translateX(${leftX}px);`
      });
    },
    calcRightX(max) {
      const rightX = this.calcX(max);
      this.setData({
        rightX,
        rightStyle: `transform: translateX(${rightX}px);`
      });
    },
    calcX(value: number) {
      const { minStep, maxStep, containerWidth } = this.data;
      if (value === minStep) {
        return 0;
      }
      return (value / maxStep) * containerWidth;
    }
  },
  lifetimes: {
    ready() {
      setTimeout(() => {
        const _this: {
          touchmoveStream: Subject<number>;
          moveDirectionStream: Subject<'left' | 'right'>;
          touchendStream: Subject<boolean>;
          containerWidthStream: Subject<number>;
          blockWidthStream: Subject<number>;
          touchmoveSubscription: Subscription;
          xSubscription: Subscription;
          widthSubscription: Subscription;
          isTouchEnd: boolean;
          maxValue: number;
          minValue: number;
          eventId: number;
          moveDirection: 'left' | 'right';
        } = this as any;

        _this.eventId = 0;

        _this.moveDirection = 'right';

        _this.isTouchEnd = true;

        _this.minValue = this.data.min;

        _this.maxValue = this.data.max;

        _this.touchmoveStream = new Subject<number>();

        _this.moveDirectionStream = new Subject<'left' | 'right'>();

        _this.touchendStream = new Subject<boolean>();

        _this.containerWidthStream = new Subject<number>();

        _this.blockWidthStream = new Subject<number>();

        this.createSelectorQuery()
          .select(`.move-view`)
          .boundingClientRect((rect) => {
            if (rect) {
              const blockWidth = rect.width;
              const blockHalfWidth = blockWidth / 2;
              this.setData({ blockWidth, blockHalfWidth });
              _this.blockWidthStream.next(blockWidth);
            }
          })
          .exec();

        _this.widthSubscription = _this.containerWidthStream.subscribe(
          (containerWidth) => {
            const { step, maxStep, tick, min, max } = this.data;

            const stepWidth = +((step / maxStep) * containerWidth).toFixed(2);

            const tickList = tick.map((item: string) => {
              if (item === '不限') {
                return {
                  pos: containerWidth,
                  label: '不限'
                };
              } else {
                return {
                  pos: (+item / maxStep) * containerWidth,
                  label: item
                };
              }
            });

            this.setData({
              stepWidth,
              tickList
            });

            this.calcLeftX(min);

            this.calcRightX(max);

            wx.nextTick(() => {
              this.calcIcon();
              this.setData(
                {
                  distanceStyle: `left:${this.data.leftX}px;width:${this.data
                    .rightX - this.data.leftX}px;`
                },
                () => {
                  this.setData({ isLoaded: true });
                }
              );
            });
          }
        );

        this.createSelectorQuery()
          .select(`.background-line`)
          .boundingClientRect((rect) => {
            if (rect) {
              const containerWidth = rect.width;
              this.setData({
                rightX: containerWidth,
                leftX: 0,
                containerWidth
              });

              _this.containerWidthStream.next(containerWidth);
            }
          })
          .exec();

        this.createSelectorQuery()
          .select(`.container`)
          .boundingClientRect((rect) => {
            if (rect) {
              const containerLeft = rect.left;
              this.setData({
                containerLeft
              });
            }
          })
          .exec();

        _this.touchmoveSubscription = _this.touchmoveStream
          .pipe(operators.withLatestFrom(_this.moveDirectionStream))
          .subscribe(([x, dir]) => {
            const { stepWidth, step } = this.data;

            let { minValue, maxValue } = _this;

            if (dir === 'left') {
              const minRound = Math.round(x / stepWidth);
              minValue = minRound * step;
              if (minValue >= maxValue) {
                minValue = maxValue - step;
              }
            } else if (dir === 'right') {
              const maxRound = Math.round(x / stepWidth);
              maxValue = maxRound * step;
              if (minValue >= maxValue) {
                maxValue = minValue + step;
              }
            }

            _this.minValue = minValue;

            _this.maxValue = maxValue;

            this.triggerEvent('onChange', {
              min: minValue,
              max: maxValue
            });
          });

        const xStream = _this.touchendStream.pipe(
          operators.tap((touchend) => (_this.isTouchEnd = touchend)),
          operators.withLatestFrom(
            _this.touchmoveStream,
            _this.moveDirectionStream
          ),
          operators.filter(([touchend]) => touchend === true),
          operators.map(([, x, dir]) => [x, dir])
        );

        _this.xSubscription = xStream.subscribe(() => {
          const { minValue, maxValue } = _this;
          this.triggerEvent('onChange', {
            min: minValue,
            max: maxValue
          });
        });
      });
    },
    detached() {
      const _this: {
        touchmoveStream: Subject<number>;
        moveDirectionStream: Subject<'left' | 'right'>;
        touchendStream: Subject<boolean>;
        containerWidthStream: Subject<number>;
        blockWidthStream: Subject<number>;
        touchmoveSubscription: Subscription;
        xSubscription: Subscription;
        widthSubscription: Subscription;
      } = this as any;
      if (_this.xSubscription) {
        _this.xSubscription.unsubscribe();
      }
      if (_this.touchmoveSubscription) {
        _this.touchmoveSubscription.unsubscribe();
      }
      if (_this.widthSubscription) {
        _this.widthSubscription.unsubscribe();
      }
      _this.touchmoveStream.complete();
      _this.moveDirectionStream.complete();
      _this.touchendStream.complete();
      _this.containerWidthStream.complete();
      _this.blockWidthStream.complete();
    }
  }
});
