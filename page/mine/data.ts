interface ICoupon {
  activity: boolean;
  couponId: number;
  type: number;
  message: string;
  name: string;
  id: number;
  expireTime: string;
}

export default class MinePageData {
  nickName = '';
  mobile = '';
  IsMobile = false;
  headPortrait = '';
  useCoin = 0;
  totalMoney = '0.00';
  isAuth = false;
  showAuthDialog = false;
  submitFlag = false;
  showShareCard = false;
  showTipDialog = false;
  shareDesc = '';
  couponList: ICoupon[] = [];
  showCouponDialog = false;
  couponDesc = '';
}
