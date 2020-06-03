import Http from '../../utils/http';
import * as fetch from '../../utils/fecha';

export interface CouponResponse {
  cname: string;
  couponId: number;
  ctype: number;
  cunit: string;
  cvalue: number;
  expireTime: string;
  platformType: number;
  remark: string;
  status: number;
  userCouponId: number;
}

export interface CouponItem {
  activity: boolean;
  couponId: number;
  message: string;
  name: string;
  status: number;
  id: number;
  expire: string;
  expireTime: string;
  canUse: boolean;
  canSelect: boolean;
  day: number;
  type: number;
}

const daysZH: IAnyObject = {
  1: '一天',
  2: '两天',
  3: '三天',
  4: '四天',
  5: '五天'
};

const activityCouponId = [12, 13];

export default class CouponService {
  getUseableCouponList(): Promise<CouponItem[]> {
    return Http.get('/cdd/userCoupon/getUsable.json', { couponType: 1 })
      .then((resp) => Promise.resolve((resp.data as CouponResponse[]) || []))
      .then((resp) => {
        return resp.map((item) => {
          return {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            message: `限大于${item.cvalue}天的监控`,
            name: item.cname,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUseableFreeCouponList(): Promise<CouponItem[]> {
    return Http.get('/cdd/userCoupon/getUsable.json', { couponType: 2 })
      .then((resp) => Promise.resolve((resp.data as CouponResponse[]) || []))
      .then((resp) => {
        return resp.map((item) => {
          return {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            message: `免费体验${daysZH[item.cvalue]}收费抢票功能`,
            name: item.cname,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUseableFDDCouponList(): Promise<CouponItem[]> {
    return Http.get('/cdd/userCoupon/getUsable.json', { couponType: 3 })
      .then((resp) => Promise.resolve((resp.data as CouponResponse[]) || []))
      .then((resp) => {
        return resp.map((item) => {
          return {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            message: `可兑换${item.cvalue}盯盯币`,
            name: `${item.cvalue}币`,
            status: item.status,
            id: item.userCouponId,
            expire: item.expireTime,
            expireTime: item.expireTime.substr(0, 10),
            canUse: true,
            canSelect: true,
            day: item.cvalue,
            type: item.ctype
          };
        });
      });
  }

  getUnuseableCouponList(): Promise<CouponItem[]> {
    return Http.get('/cdd/userCoupon/getExpired.json')
      .then((resp) => Promise.resolve((resp.data as CouponResponse[]) || []))
      .then((resp) => {
        return resp.map((item) => {
          const type = item.ctype;
          const message =
            type === 1
              ? `限大于${item.cvalue}天的监控`
              : type === 2
              ? `免费体验${daysZH[item.cvalue]}收费抢票功能`
              : `可兑换${item.cvalue}盯盯币`;
          const name = type === 3 ? `${item.cvalue}币` : item.cname;
          return {
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
          };
        });
      });
  }

  getCouponList() {
    let pddList: CouponItem[] = [];

    let fddList: CouponItem[] = [];

    return this.getUseableCouponList()
      .then((couponList) => {
        pddList = couponList;
        return this.getUseableFDDCouponList();
      })
      .then((couponList) => (fddList = couponList))
      .then((_) => {
        const couponList = ([] as CouponItem[])
          .concat(pddList)
          .concat(fddList)
          .sort(
            (a, b) =>
              fetch.parse(a.expire, 'YYYY-MM-DD HH:mm:ss')!.getTime() -
              fetch.parse(b.expire, 'YYYY-MM-DD HH:mm:ss')!.getTime()
          );

        return Promise.resolve(couponList);
      });
  }

  getData(
    tabValue: number | null
  ): Promise<{ couponList: CouponItem[]; tabList?: any[] }> {
    if (typeof tabValue !== 'number') {
      const tabList = [
        { label: '券包', value: 1 },
        { label: '历史卡券', value: 2 }
      ];
      return this.getUseableFreeCouponList().then((freeCouponList) => {
        if (freeCouponList.length > 0) {
          tabList.unshift({ label: '卡包', value: 0 });
        }
        return this.getCouponList().then((couponList) =>
          Promise.resolve({ couponList, tabList })
        );
      });
    }
    if (tabValue === 0) {
      return this.getUseableFreeCouponList().then((couponList) =>
        Promise.resolve({ couponList })
      );
    } else if (tabValue === 1) {
      return this.getCouponList().then((couponList) =>
        Promise.resolve({ couponList })
      );
    } else if (tabValue === 2) {
      return this.getUnuseableCouponList().then((couponList) =>
        Promise.resolve({ couponList })
      );
    }

    return Promise.resolve({ couponList: [], tabList: [] });
  }

  exchangeCoupon(userCouponId: number) {
    return Http.post('/cdd/user/cddUseCoupon.json', { userCouponId });
  }
}
