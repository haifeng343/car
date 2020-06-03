import Http from '../../utils/http';

export interface IFundLogResponse {
  in: FundResponse[];
  out: FundResponse[];
}

export interface FundResponse {
  afterFreeze: number;
  balance: number;
  businessId: number;
  createTime: string;
  direction: number;
  freeze: number;
  id: number;
  logName: string;
  money: number;
  orderNo: string;
  platformType: number;
  remark: string;
  type: number;
  userId: number;
  optCoin: number;
}

export interface IFundItem {
  orderNo: string;
  platformType: number;
  platformName: string;
  platformClass: string;
  moneyText: string;
  icon: string;
  logName: string;
  direction: number;
  desc?: string;
  type: number;
  createTime: string;
  remark: string;
  logList?: { createTime: string; remark: string }[];
  payList?: { createTime: string; moneyText: string }[];
}

const fundIconMap: { [key: string]: string } = {
  '1': 'uniE905',
  '6': 'uniE906',
  '7': 'uniE95F',
  '8': 'uniE93C',
  '33': 'uniE93B'
};

const coinFundIcon: { [key: string]: string } = {
  '1': 'uniE93B',
  '2': 'uniE93C',
  '3': 'uniE962',
  '4': 'uniE960',
  '5': 'uniE963',
  '6': 'uniE93C',
  '7': 'uniE969',
  '8': 'uniE96C'
};

const platformNameMap: { [key: string]: string } = {
  '1': '票盯盯',
  '2': '房盯盯',
  '3': '车盯盯'
};

const platformClassMap: { [key: string]: string } = {
  '1': 'pdd',
  '2': 'fdd',
  '3': 'cdd'
};

export default class FundService {
  getFundList(timeRange: number, billType: number): Promise<IFundItem[]> {
    return Http.get('/cdd/user/getFundLog.json', { timeRange, billType })
      .then((resp) => Promise.resolve(resp.data as IFundLogResponse) || {})
      .then((resp) =>
        Promise.resolve(
          resp.out.map((item) => {
            const fundItem: IFundItem = {
              orderNo: item.orderNo,
              platformType: item.platformType,
              platformName: platformNameMap[item.platformType] || '未知来源',
              platformClass: platformClassMap[item.platformType] || 'unkclass',
              moneyText: item.money.toFixed(2),
              icon: fundIconMap[item.type],
              logName: item.logName,
              direction: item.direction,
              type: item.type,
              createTime: item.createTime,
              remark: item.remark
            };
            if (item.type === 6 || item.type === 7) {
              fundItem.desc = item.remark;
            }
            const logList =
              resp.in &&
              resp.in
                .filter((item) => item.orderNo === fundItem.orderNo)
                .map((item) => ({
                  createTime: item.createTime,
                  remark: item.remark
                }));
            if (logList && logList.length > 0) {
              fundItem.logList = logList;
            }
            return fundItem;
          })
        )
      );
  }

  getCoinFundList(timeRange: number, billType: number): Promise<IFundItem[]> {
    return Http.get('/cdd/user/getUserCoinLog.json', { timeRange, billType })
      .then((resp) => Promise.resolve(resp.data as IFundLogResponse))
      .then((fundlist) =>
        Promise.resolve(
          fundlist.out.map((item) => {
            const fundItem: IFundItem = {
              orderNo: item.orderNo,
              platformType: item.platformType,
              platformName: platformNameMap[item.platformType] || '未知来源',
              platformClass: platformClassMap[item.platformType] || 'unkclass',
              moneyText: `${item.optCoin}币`,
              icon: coinFundIcon[item.type],
              logName: item.logName,
              direction: item.direction,
              type: item.type,
              createTime: item.createTime,
              remark: item.remark
            };
            const payList =
              fundlist.in &&
              fundlist.in
                .filter((item) => item.orderNo === fundItem.orderNo)
                .map((item) => ({
                  createTime: item.createTime,
                  moneyText: `${item.optCoin}币`
                }));
            if (payList && payList.length > 0) {
              fundItem.payList = payList;
            }

            return fundItem;
          })
        )
      );
  }
}
