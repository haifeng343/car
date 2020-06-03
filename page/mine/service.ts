import Http from '../../utils/http';
import { authSubject } from '../../utils/auth';
import { Subscription } from '../../rx/rx';
import { CouponResponse, CouponItem } from '../coupon/service';

export interface ICheckFddDailyShareResponse {
  coupon: CouponResponse;
  isFirstShare: boolean;
}

export interface IUserInfoResponse {
  userBase: {
    userId: number;
    mobile: string;
    status: number;
    realStatus: number;
    nickname: string;
    hasBizPassword: boolean;
    headPortrait: string;
  };
  coinAccount: {
    id: number;
    userId: number;
    useCoin: number;
    createTime: string;
    updateTime: string;
    version: number;
  };
  public: boolean;
  phone: boolean;
  userAccount: {
    id: number;
    userId: number;
    useMoney: number;
    freezeMoney: number;
    recharge: number;
    cash: number;
    createTime: string;
    updateTime: string;
    version: number;
  };
}

const daysZH: IAnyObject = {
  1: '一天',
  2: '两天',
  3: '三天',
  4: '四天',
  5: '五天'
};

const activityCouponId = [12, 13];

export default class UserService {
  authSubscription: null | Subscription = null;

  requestShare(): Promise<CouponItem[]> {
    return Http.post('/cdd/user/cddDailyShareBack.json')
      .then((resp) => Promise.resolve(resp.data as CouponResponse))
      .then((item) => {
        const type = item.ctype;
        const message =
          type === 1
            ? `限大于${item.cvalue}天的监控`
            : type === 2
            ? `免费体验${daysZH[item.cvalue]}收费抢票功能`
            : `可兑换${item.cvalue}盯盯币`;
        const name = type === 3 ? `${item.cvalue}币` : item.cname;
        return Promise.resolve([
          {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            message,
            name,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: false,
            canSelect: false,
            day: item.cvalue,
            type
          }
        ]);
      });
  }

  checkFirstShare(): Promise<ICheckFddDailyShareResponse> {
    return Http.get('/cdd/user/checkCddDailyShare.json').then(
      (resp) => resp.data as ICheckFddDailyShareResponse
    );
  }

  getBalance(): Promise<number> {
    return Http.get('/user/account/getAccountBalance.json').then((resp) => {
      const money = resp.data as number;
      return Promise.resolve(money);
    });
  }

  getUserInfo(): Promise<{
    nickName: string;
    mobile: string;
    headPortrait: string;
    totalMoney: string;
    useableMoney: string;
    useCoin: number;
  }> {
    return Http.get('/cdd/user/userInfo.json')
      .then((resp) => Promise.resolve(resp.data as IUserInfoResponse))
      .then((userInfo) => {
        const { nickname, mobile, headPortrait } = userInfo.userBase;
        const useableMoney = userInfo.userAccount.useMoney.toFixed(2);
        const useCoin = userInfo.coinAccount.useCoin;
        const app = getApp();
        app.globalData.isUserBindPhone = userInfo.phone;
        app.globalData.isUserBindPublic = userInfo.public;
        const totalMoney = (
          +useableMoney + userInfo.userAccount.freezeMoney
        ).toFixed(2);
        return Promise.resolve({
          nickName: nickname,
          mobile:mobile,
          headPortrait,
          totalMoney,
          useableMoney,
          useCoin
        });
      });
  }

  auth(data: IAnyObject): Promise<void> {
    return Http.post('/cddLogin/appletAuth.json', data).then((resp) => {
      const token = resp.data;
      const app = getApp<IAppOption>();
      app.globalData.isAuth = true;
      wx.setStorageSync('token', token);
      // 注意: 不要把这代码段放在存储token之前
      authSubject.next(true);
      // 注意: 不要把这代码段放在存储token之前
    });
  }

  getCouponCount(): Promise<number> {
    return Http.get('/cdd/userCoupon/getUsable.json', { couponType: 3 })
      .then((resp) => Promise.resolve((resp.data as CouponResponse[]) || []))
      .then((couponList) => Promise.resolve(couponList.length));
  }
}
