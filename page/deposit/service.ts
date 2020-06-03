import Http from '../../utils/http';
import { IUserInfoResponse } from '../mine/service';

interface IWXUnifiedOrderResponse {
  appPackage: string;
  appid: string;
  nonceStr: string;
  packageIs: string;
  partnerId: string;
  paySign: string;
  prepayId: string;
  timeStamp: string;
}

export default class DepositService {
  createOrder(
    money: number,
    coinAmount: number
  ): Promise<IWXUnifiedOrderResponse> {
    return Http.post('/wechat/cdd/wxUnifiedOrder.json', {
      money,
      coinAmount
    }).then((resp) => Promise.resolve(resp.data as IWXUnifiedOrderResponse));
  }

  getUserInfo(): Promise<IUserInfoResponse> {
    return Http.get('/cdd/user/userInfo.json').then((resp) =>
      Promise.resolve(resp.data as IUserInfoResponse)
    );
  }

  doExchangeCoin(exchangeAmount: number) {
    return Http.post('/cdd/user/cddExchangeUserCoin.json', {
      exchangeAmount
    });
  }
}
