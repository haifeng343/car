import Http from '../../utils/http';
import { Subscription } from '../../rx/rx';
import { authSubject } from "../../utils/auth";
const daysZH:IAnyObject = {
  1: "一天",
  2: "两天",
  3: "三天",
  4: "四天",
  5: "五天"
};
const activityCouponId:number[] = [12, 13];

export default class HomeService {
  authSubscription: null | Subscription = null;
  getBanner() {
    return Http.get("/cdd/banner/index.json");
  }
  //城市列表
  getCityList() {
    return Http.get('/cityList.json');
  }
  //城市详情
  cityDetail(cityName:string) {
    return Http.get('/cityDetail.json', { cityName })
  }
  auth(data:any) {
    return Http.post("/cddLogin/appletAuth.json", data).then(resp => {
      const token = resp.data;
      const app = getApp();
      app.globalData.isAuth = true;
      wx.setStorageSync("token", token);

      authSubject.next(true);
    });
  }
  getUnReadCouponList() {
    return Http.get("/cdd/userCoupon/getUnRead.json")
      .then(resp => Promise.resolve(resp.data || []))
      .then((resp:any) => {
        return resp.map((item:IAnyObject) => {
          const type = item.ctype;
          const message =
            type === 1
              ? `限大于${item.cvalue}天的监控`
              : type === 2
              ? `免费体验${daysZH[item.cvalue]}收费抢票功能`
              : `可兑换${item.cvalue}盯盯币`;
          const name =
            type === 1
              ? item.cname
              : type === 2
              ? `${item.cvalue}天`
              : `${item.cvalue}币`;
          return {
            activity: activityCouponId.includes(item.couponId),
            couponId: item.couponId,
            type,
            message,
            name,
            id: item.userCouponId,
            expireTime: item.expireTime.substr(0, 10)
          };
        });
      });
  }
}
