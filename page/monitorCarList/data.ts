export default class UsedCarPageData {
  dataFlag = 0; //1 有数据；2：查询无数据；3：接口不通;4=查询监控后台不通
  allCount = 0;
  allOriginalData: IFormatResult[] = [];
  allData: IFormatResult[] = [];
  gzFilterData: IFormatResult[] = [];
  yxFilterData: IFormatResult[] = [];
  rrFilterData: IFormatResult[] = [];
  sourceData: ISourceData[] = [];
  averagePrice: number = 0;
  lowPrice: number = 0;
  lowPriceData:IFormatResult|null=null;
  gzlowPriceData:IFormatResult|null=null;
  yxlowPriceData:IFormatResult|null=null;
  rrlowPriceData:IFormatResult|null=null;
  firstlowPriceData:IFormatResult|null=null;
  enoughList: any;
  gzCount: number = 0;
  yxCount: number = 0;
  rrCount: number = 0;
  monitorId: number = 0;
  loadingDisplay = 'block';
  monitorenoughDisplay = 'none';
  stopDisplay = 'none';
  updateMonitorDisplay = 'none';
  followDisplay = 'none';
  bottomType = 1; //1=底部是关闭监控 2：底部是修改保存监控 3：底部是屏蔽车源
  enoughBottom = false;
  dialogTitle = '';
  dialogText = '';
  dialogBtn = '';
  followText = '';
  followType: number = 1;
  followIndex: number = 0;
  mSelect = 1; //1全部 2新上 3价格
  isMtype: boolean = false; //是否第一次进入详情页；false：是
  editFlag: boolean = false; //是否可以选择屏蔽,true:可以
  selectAllFlag: boolean = false; //全选标记
  singleEditFlag: boolean = false;
  startTimeName = ''; //任务开始时间
  taskTime = ''; //任务执行时间
  fee = 0; //收费
  totalFee = 0; //总费用
  ddCoin: number = 0;
  bindPhone: boolean = false;
  bindPublic: boolean = false;
  sortType: number = 0; //车源偏好：1价格最低、2里程最少、3年龄最小 单选
  updateData = {};
  defalutData = {};
  scrollIng: boolean = false; //是否正在滚动
  scrollTop: number = 0;
  selectNum: number = 0;
  indexArr: number[] = [];
  searchData?: ISearchData;
  advSort: number = 0;
}
