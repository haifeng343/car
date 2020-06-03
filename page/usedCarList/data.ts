export default class UsedCarPageData {
  dataFlag = 0;//1 有数据；2：查询无数据；3：接口不通;
  allCount = 0;
  allOriginalData: IFormatResult[]=[];
  allData: IFormatResult[]=[];
  gzFilterData: IFormatResult[]=[];
  yxFilterData: IFormatResult[]=[];
  rrFilterData: IFormatResult[]=[];
  sourceData :ISourceData[] = [];
  averagePrice:number = 0;
  lowPrice:number = 0;
  lowPriceData:IFormatResult|null=null;
  gzlowPriceData:IFormatResult|null=null;
  yxlowPriceData:IFormatResult|null=null;
  rrlowPriceData:IFormatResult|null=null;
  firstlowPriceData:IFormatResult|null=null;
  enoughList:any;
  gzCount:number=0;
  yxCount:number=0;
  rrCount:number=0;
  loadingDisplay = 'block';
  monitorDisplay = 'none';
  publicDisplay = 'none';
  monitorenoughDisplay = 'none';
  monitorTitle = '';
  dialogTitle = '';
  dialogText = '';
  dialogBtn = '';
  loadingShow:boolean = false;
  enoughBottom:boolean = false;
  monitorBottom:boolean = false;
  ddCoin:number = 0;
  bindPhone:boolean = false;
  bindPublic:boolean = false;
  sortType:number = 0; //车源偏好：1价格最低、2里程最少、3年龄最小 单选
  updateData?:ISearchData
}