import { IFundItem } from './service';

export default class FundPageData {
  fundList: IFundItem[] = [];
  fundTimeList = [
    {
      value: 1,
      label: '近一周'
    },
    {
      value: 2,
      label: '近一个月'
    },
    {
      value: 3,
      label: '近三个月'
    }
  ];
  coinFundTimeList = [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '近三天'
    },
    {
      value: 2,
      label: '近一周'
    },
    {
      value: 3,
      label: '近一个月'
    }
  ];
  fundTypeList = [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '充值'
    },
    {
      value: 33,
      label: '提现'
    },
    {
      value: 6,
      label: '支付'
    },
    {
      value: 7,
      label: '退款'
    },
    {
      value: 8,
      label: '兑换'
    }
  ];
  coinTypeList = [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '充值'
    },
    {
      value: 2,
      label: '兑换'
    },
    {
      value: 3,
      label: '消耗'
    }
  ];
  timeRange = 1;
  billType = 0;
  fundListType = 1;
  isLoaded = false;
}
