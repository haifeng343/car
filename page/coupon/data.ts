import { CouponItem } from './service';

export default class CouponPageData {
  tabList: {
    label: string;
    value: number;
  }[] = [];
  currentTabValue: number | null = null;
  couponList: CouponItem[] = [];
  isLoaded = false;
  userCouponId = -1;
  showActionDialog = false;
  currentCouponValue = 0;
}
