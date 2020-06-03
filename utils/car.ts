import { compareSort } from './util';
import * as fecha from './fecha';
interface IUsedCarData {
  gzCount: number;
  yxCount: number;
  rrCount: number;
  gzData: IFormatResult[];
  yxData: IFormatResult[];
  rrData: IFormatResult[];
  type: number;
}
interface IUsedCarResponseData {
  allCount?: number;
  filterData: IFormatResult[];
  gzFilterData: IFormatResult[];
  yxFilterData: IFormatResult[];
  rrFilterData: IFormatResult[];
  averagePrice: number;
  lowPrice: number;
  lowPriceData?: IFormatResult;
  gzlowPriceData?: IFormatResult;
  yxlowPriceData?: IFormatResult;
  rrlowPriceData?: IFormatResult;
  firstlowPriceData?: IFormatResult;
  sourceData?: ISourceData[];
  gzCount?: number;
  yxCount?: number;
  rrCount?: number;
}

interface IUsedCarAddParam {
  id?: number;
  cityName: string;
  brandName?: string;
  seriesName?: string;
  searchJson?: string;
  relationJson?: string;
  minPrice: number;
  maxPrice: number;
  autoType?: number;
  gearbox?: number;
  drive?: number;
  minAge: number;
  maxAge: number;
  minMileage: number;
  maxMileage: number;
  minDisplacement: number;
  maxDisplacement: number;
  fuelType?: number;
  emission?: number;
  countryType?: number;
  carColor?: number;
  starConfig?: string;
  sortType?: number;
  notice?: string;
  actualPrice: number;
  cddUsedBlock?: IUsedBlock;
  cddUsedUsable?: ISourceData[];
  cddUsedCount?: IUsedCount;
}
interface IUsedBlock {
  gz: number[] | string[];
  yx: number[] | string[];
  rr: number[] | string[];
}

interface IUsedCount {
  gzTotal: number;
  yxTotal: number;
  rrTotal: number;
  allTotal: number;
}
interface IAdd {
  noteSelect?: boolean;
  publicSelect?: boolean;
  monitorId?: number;
  sourceData: ISourceData[];
  allOriginalData: IFormatResult[];
  lowPrice: number;
  allCount: number;
  gzCount: number;
  yxCount: number;
  rrCount: number;
}
/**
 * gzCount 瓜子车辆num
 * gzData  瓜子车量data
 * yxCount 优信车辆num
 * yxData  优信车辆data
 * rrCount 人人车辆num
 * rrData  人人车辆data
 * type    1：车源列表；2监控详情
 */
const getUsedCardAllData = (data: IUsedCarData): IUsedCarResponseData => {
  const app = getApp<IAppOption>();
  let maxTotal: number = 50;
  let sourceData: ISourceData[] = [];
  let filterData: IFormatResult[] = [];
  let allCount: number = 0;
  let gzFilterData: IFormatResult[] = [];
  let yxFilterData: IFormatResult[] = [];
  let rrFilterData: IFormatResult[] = [];
  let gzData = data.gzData;
  let yxData = data.yxData;
  let rrData = data.rrData;
  for (let i = 0; i < maxTotal; i++) {
    if (data.gzCount > 0) {
      let gz = addPlatfromData(filterData, gzData, i);
      if (gz === 0) {
        break;
      }
      if (gz === 1) {
        gzFilterData.push(gzData[i]);
        filterData.push(gzData[i]);
        sourceData.push({
          data: gzData[i].source,
          newLevel: 0,
          platform: 'gz',
          priceDownLevel: 0
        });
      }
    }
    if (data.yxCount > 0) {
      let yx = addPlatfromData(filterData, yxData, i);
      if (yx === 0) {
        break;
      }
      if (yx === 1) {
        yxFilterData.push(yxData[i]);
        filterData.push(yxData[i]);
        sourceData.push({
          data: yxData[i].source,
          newLevel: 0,
          platform: 'yx',
          priceDownLevel: 0
        });
      }
    }
    if (data.rrCount > 0) {
      let rr = addPlatfromData(filterData, rrData, i);
      if (rr === 0) {
        break;
      }
      if (rr === 1) {
        rrFilterData.push(rrData[i]);
        filterData.push(rrData[i]);
        sourceData.push({
          data: rrData[i].source,
          newLevel: 0,
          platform: 'rr',
          priceDownLevel: 0
        });
      }
    }
  }
  if (data.gzCount > -1) {
    allCount += data.gzCount;
  }
  if (data.yxCount > -1) {
    allCount += data.yxCount;
  }
  if (data.rrCount > -1) {
    allCount += data.rrCount;
  }
  let priceSortArr: IFormatResult[] = [...filterData];
  let firstPaySortArr: IFormatResult[] = [...filterData];
  let gzSortArr: IFormatResult[] = [...gzFilterData];
  let yxSortArr: IFormatResult[] = [...yxFilterData];
  let rrSortArr: IFormatResult[] = [...rrFilterData];
  //平均总价
  let average =
    filterData.length > 0
      ? filterData.reduce((sum: number, { price }: any) => sum + price, 0) /
        filterData.length
      : 0;
  //最低总价
  let lowPrice =
    filterData.length > 0
      ? Math.min.apply(
          Math,
          filterData.map(function(o: any) {
            return o.price;
          })
        )
      : 0;
  //总价最低数据
  priceSortArr.sort(compareSort('price', 'asc'));
  let lowPriceData = priceSortArr[0];
  //瓜子总价最低数据
  gzSortArr.sort(compareSort('price', 'asc'));
  let gzlowPriceData = gzSortArr[0];
  //优信总价最低数据
  yxSortArr.sort(compareSort('price', 'asc'));
  let yxlowPriceData = yxSortArr[0];
  //人人总价最低数据
  rrSortArr.sort(compareSort('price', 'asc'));
  let rrlowPriceData = rrSortArr[0];
  //首付最低数据
  firstPaySortArr = firstPaySortArr.filter((item)=>item.firstPay !== 0)
  let firstlowPriceData = null
  if(firstPaySortArr.length === 0){
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = lowPriceData;
  }else{
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = firstPaySortArr[0];
  }
  
  //高级筛选排序
  let y =
    data.type == 1
      ? app.globalData.searchData
      : app.globalData.monitorSearchData;
  if (y.advSort === 1) {
    let allArr = [...filterData];
    allArr.sort(compareSort('price', 'asc'));
    filterData = allArr;
  }
  if (y.advSort === 11) {
    let allArr = [...filterData];
    allArr.sort(compareSort('price', 'desc'));
    filterData = allArr;
  }
  if (y.advSort === 2) {
    let allArr = [...filterData];
    allArr.sort(compareSort('licensedDate', 'desc'));
    filterData = allArr;
  }
  if (y.advSort === 3) {
    let allArr = [...filterData];
    allArr.sort(compareSort('mileage', 'asc'));
    filterData = allArr;
  }
  if (y.advSort === 4) {
    let allArr = [...filterData];
    allArr.sort(compareSort('firstPay', 'asc'));
    filterData = allArr;
  }
  return {
    allCount,
    filterData,
    gzFilterData,
    yxFilterData,
    rrFilterData,
    sourceData,
    averagePrice: +average.toFixed(0),
    lowPrice: +lowPrice.toFixed(0),
    lowPriceData,
    gzlowPriceData,
    yxlowPriceData,
    rrlowPriceData,
    firstlowPriceData,
    gzCount: data.gzCount,
    yxCount: data.yxCount,
    rrCount: data.rrCount
  };
};
const getMonitorAllData = (
  list: ISourceData[],
  mSelect: number
): IUsedCarResponseData => {
  const app = getApp<IAppOption>();
  let filterData: IFormatResult[] = [];
  let gzFilterData: IFormatResult[] = [];
  let yxFilterData: IFormatResult[] = [];
  let rrFilterData: IFormatResult[] = [];
  let carList = monitorFilter(list, mSelect);
  for (const p of carList) {
    if (p.platform === 'gz') {
      const data = p.data as IGuaZiData;
      const price = +data.price.replace('万', '') * 10000;
      const firstPay = +data.first_pay.replace('万', '') * 10000;
      const mileage = +data.road_haul.replace('万公里', '') * 10000;
      const licenseDateString =
        data.license_date.replace('年', '') + '-01-01 00:00:00';
      const licensedDate = fecha.parse(
        licenseDateString,
        'YYYY-MM-DD HH:mm:ss'
      )!;
      const datas: IFormatResult = {
        title: data.title,
        price,
        priceText: data.price,
        thumb: data.thumb_img,
        firstPay,
        firstPayText: data.first_pay,
        mileage,
        mileageText: data.road_haul,
        licensedDate,
        licensedText: data.license_date,
        tag: data.list_tags ? data.list_tags.map((item) => item.text) : [],
        source: p,
        platform: 'gz',
        carId: data.puid,
        newLevel: p.newLevel,
        priceDownLevel: p.priceDownLevel,
        priceMargin: p.priceMargin,
        collection: false
      };
      filterData.push(datas);
      gzFilterData.push(datas);
    } else if (p.platform === 'yx') {
      const data = p.data as IYouXinData;
      const price = +data.price.replace('万', '') * 10000;
      const firstPay =
        +data.shoufu_price.replace('首付', '').replace('万', '') * 10000;
      const mileage = +data.mileage.replace('万', '') * 10000;
      const licenseDateString = data.carnotime + ' 00:00:00';
      const licensedDate = fecha.parse(
        licenseDateString,
        'YYYY-MM-DD HH:mm:ss'
      )!;
      const datas: IFormatResult = {
        title: data.carserie + data.carname,
        price,
        priceText: data.price,
        thumb: data.carimg,
        firstPay,
        firstPayText: data.shoufu_price.replace('首付', ''),
        mileage,
        mileageText: data.mileage + '公里',
        licensedDate,
        licensedText: data.carnotime.substr(0, 4) + '年',
        tag: data.tags_sort.map((item) => item.name),
        source: p,
        platform: 'yx',
        carId: data.carid,
        newLevel: p.newLevel,
        priceDownLevel: p.priceDownLevel,
        priceMargin: p.priceMargin,
        collection: false
      };
      filterData.push(datas);
      yxFilterData.push(datas);
    } else {
      const data = p.data as IRenRenData;
      const price = data.price * 10000;
      const firstPay = data.down_payment * 10000;
      const mileage = data.mileage * 10000;
      const licenseDateString = data.licensed_date.substr(0, 10) + ' 00:00:00';
      const licensedDate = fecha.parse(
        licenseDateString,
        'YYYY-MM-DD HH:mm:ss'
      )!;
      const datas: IFormatResult = {
        title: data.title,
        price,
        priceText: data.price + '万',
        thumb: data.search_image_url[0],
        firstPay,
        firstPayText: data.down_payment + '万',
        mileage,
        mileageText: data.mileage + '万公里',
        licensedDate,
        licensedText: data.licensed_date.substr(0, 4) + '年',
        tag: data.tags.map((item) => item.txt),
        source: p,
        platform: 'rr',
        carId: data.id,
        newLevel: p.newLevel,
        priceDownLevel: p.priceDownLevel,
        priceMargin: p.priceMargin,
        collection: false
      };

      filterData.push(datas);
      rrFilterData.push(datas);
    }
  }
  let priceSortArr: IFormatResult[] = [...filterData];
  let firstPaySortArr: IFormatResult[] = [...filterData];
  let gzSortArr: IFormatResult[] = [...gzFilterData];
  let yxSortArr: IFormatResult[] = [...yxFilterData];
  let rrSortArr: IFormatResult[] = [...rrFilterData];
  //平均总价
  let average =
    filterData.length > 0
      ? filterData.reduce((sum: number, { price }: any) => sum + price, 0) /
        filterData.length
      : 0;
  //最低总价
  let lowPrice =
    filterData.length > 0
      ? Math.min.apply(
          Math,
          filterData.map(function(o: any) {
            return o.price;
          })
        )
      : 0;
  //总价最低数据
  priceSortArr.sort(compareSort('price', 'asc'));
  let lowPriceData = priceSortArr[0];
  //瓜子总价最低数据
  gzSortArr.sort(compareSort('price', 'asc'));
  let gzlowPriceData = gzSortArr[0];
  //优信总价最低数据
  yxSortArr.sort(compareSort('price', 'asc'));
  let yxlowPriceData = yxSortArr[0];
  //人人总价最低数据
  rrSortArr.sort(compareSort('price', 'asc'));
  let rrlowPriceData = rrSortArr[0];
  //首付最低数据
  firstPaySortArr = firstPaySortArr.filter((item)=>item.firstPay !== 0)
  let firstlowPriceData = null
  if(firstPaySortArr.length === 0){
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = lowPriceData;
  }else{
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = firstPaySortArr[0];
  }
  //高级筛选排序
  let y = app.globalData.monitorSearchData;
  if (y.advSort === 1) {
    let allArr = [...filterData];
    allArr.sort(compareSort('price', 'asc'));
    filterData = allArr;
  }
  if (y.advSort === 11) {
    let allArr = [...filterData];
    allArr.sort(compareSort('price', 'desc'));
    filterData = allArr;
  }
  if (y.advSort === 2) {
    let allArr = [...filterData];
    allArr.sort(compareSort('licensedDate', 'desc'));
    filterData = allArr;
  }
  if (y.advSort === 3) {
    let allArr = [...filterData];
    allArr.sort(compareSort('mileage', 'asc'));
    filterData = allArr;
  }
  if (y.advSort === 4) {
    let allArr = [...filterData];
    allArr.sort(compareSort('firstPay', 'asc'));
    filterData = allArr;
  }
  return {
    filterData,
    gzFilterData,
    yxFilterData,
    rrFilterData,
    averagePrice: +average.toFixed(0),
    lowPrice: +lowPrice.toFixed(0),
    lowPriceData,
    gzlowPriceData,
    yxlowPriceData,
    rrlowPriceData,
    firstlowPriceData
  };
};
const getBatchFilter = (filterData: IFormatResult[]): IUsedCarResponseData => {
  let gzFilterData: IFormatResult[] = [];
  let yxFilterData: IFormatResult[] = [];
  let rrFilterData: IFormatResult[] = [];
  for (let i = 0; i < filterData.length; i++) {
    if (filterData[i].platform == 'gz') {
      gzFilterData.push(filterData[i]);
    }
    if (filterData[i].platform == 'yx') {
      yxFilterData.push(filterData[i]);
    }
    if (filterData[i].platform == 'rr') {
      rrFilterData.push(filterData[i]);
    }
  }
  let priceSortArr: IFormatResult[] = [...filterData];
  let firstPaySortArr: IFormatResult[] = [...filterData];
  let gzSortArr: IFormatResult[] = [...gzFilterData];
  let yxSortArr: IFormatResult[] = [...yxFilterData];
  let rrSortArr: IFormatResult[] = [...rrFilterData];
  //平均总价
  let average =
    filterData.length > 0
      ? filterData.reduce((sum: number, { price }: any) => sum + price, 0) /
        filterData.length
      : 0;
  //最低总价
  let lowPrice =
    filterData.length > 0
      ? Math.min.apply(
          Math,
          filterData.map(function(o: any) {
            return o.price;
          })
        )
      : 0;
  //总价最低数据
  priceSortArr.sort(compareSort('price', 'asc'));
  let lowPriceData = priceSortArr[0];
  //瓜子总价最低数据
  gzSortArr.sort(compareSort('price', 'asc'));
  let gzlowPriceData = gzSortArr[0];
  //优信总价最低数据
  yxSortArr.sort(compareSort('price', 'asc'));
  let yxlowPriceData = yxSortArr[0];
  //人人总价最低数据
  rrSortArr.sort(compareSort('price', 'asc'));
  let rrlowPriceData = rrSortArr[0];
  //首付最低数据
  firstPaySortArr = firstPaySortArr.filter((item)=>item.firstPay !== 0)
  let firstlowPriceData = null
  if(firstPaySortArr.length === 0){
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = lowPriceData;
  }else{
    firstPaySortArr.sort(compareSort('firstPay', 'asc'));
    firstlowPriceData = firstPaySortArr[0];
  }
  return {
    filterData,
    gzFilterData,
    yxFilterData,
    rrFilterData,
    averagePrice: +average.toFixed(0),
    lowPrice: +lowPrice.toFixed(0),
    lowPriceData,
    gzlowPriceData,
    yxlowPriceData,
    rrlowPriceData,
    firstlowPriceData
  };
};
/**
 * 添加监控参数
 * @param data 
 * noteSelect, 是否绑定短信
  publicSelect,是否帮点公众号
  sourceData: 原数据,
  allOriginalData: 处理的展示数据,
  lowPrice: 最低价,
  allCount: 总数num,
  gzCount: 瓜子总数num,
  yxCount: 优信总数num,
  rrCount: 人人总数num,
 */
const addMonitorParam = (obj: IAdd): IUsedCarAddParam => {
  const app = getApp<IAppOption>();
  let y = app.globalData.searchData;
  let relation = {
    brandId: y.brandId,
    cityId: y.cityId,
    seriesID: y.seriesID
  };
  let data: IUsedCarAddParam = {
    cityName: y.city, //城市名称
    minPrice: y.minPrice,
    maxPrice: y.maxPrice === 50 ? 9999 : y.maxPrice,
    minAge: y.minAge,
    maxAge: y.maxAge === 6 ? 99 : y.maxAge,
    minMileage: y.minMileage,
    maxMileage: y.maxMileage === 14 ? 9999 : y.maxMileage,
    minDisplacement: y.minDisplacement,
    maxDisplacement: y.maxDisplacement === 4 ? 99 : y.maxDisplacement,
    actualPrice: +(obj.lowPrice / 10000).toFixed(2),
    searchJson: y.searchJson,
    relationJson: JSON.stringify(relation)
  };
  //品牌
  if (y.brandName) {
    data.brandName = y.brandName;
  }
  //车系名称
  if (y.seriesName) {
    data.seriesName = y.seriesName;
  }
  //车型
  if (y.autoType) {
    data.autoType = y.autoType;
  }
  //变速箱
  if (y.gearbox) {
    data.gearbox = y.gearbox;
  }
  //驱动
  if (y.drive) {
    data.drive = y.drive;
  }
  //燃料类型
  if (y.fuelType) {
    data.fuelType = y.fuelType;
  }
  //排放
  if (y.emission) {
    data.emission = y.emission;
  }
  //国别
  if (y.countryType) {
    data.countryType = y.countryType;
  }
  //颜色
  if (y.carColor) {
    data.carColor = y.carColor;
  }
  //亮点
  if (y.starConfig.length) {
    data.starConfig = y.starConfig.join(',');
  }
  //车源偏好
  if (y.sortType) {
    data.sortType = y.sortType;
  }
  // 通知方式
  let n: number[] = [];
  if (obj.noteSelect) {
    n.push(2);
  }
  if (obj.publicSelect) {
    n.push(1);
  }
  data.notice = n.join(',');
  data.cddUsedBlock = { gz: [], yx: [], rr: [] };
  data.cddUsedCount = {
    gzTotal: obj.gzCount,
    yxTotal: obj.yxCount,
    rrTotal: obj.rrCount,
    allTotal: obj.allCount
  };
  let cdd = compareCar(obj.sourceData, obj.allOriginalData);
  data.cddUsedUsable = cdd;
  return data;
};
/**
 * 修改监控参数
 * @param data 
 * monitorId：监控Id
  sourceData: 原数据,
  allOriginalData: 处理的展示数据,
  lowPrice: 最低价,
  allCount: 总数num,
  gzCount: 瓜子总数num,
  yxCount: 优信总数num,
  rrCount: 人人总数num,
 */
const updateMonitorParam = (obj: IAdd): IUsedCarAddParam => {
  const app = getApp<IAppOption>();
  let y = app.globalData.monitorSearchData;
  let relation = {
    brandId: y.brandId,
    cityId: y.cityId,
    seriesID: y.seriesID
  };
  let data: IUsedCarAddParam = {
    id: obj.monitorId,
    cityName: y.city, //城市名称
    minPrice: y.minPrice,
    maxPrice: y.maxPrice === 50 ? 9999 : y.maxPrice,
    minAge: y.minAge,
    maxAge: y.maxAge === 6 ? 99 : y.maxAge,
    minMileage: y.minMileage,
    maxMileage: y.maxMileage === 14 ? 9999 : y.maxMileage,
    minDisplacement: y.minDisplacement,
    maxDisplacement: y.maxDisplacement === 4 ? 99 : y.maxDisplacement,
    actualPrice: +(obj.lowPrice / 10000).toFixed(2),
    searchJson: y.searchJson,
    relationJson: JSON.stringify(relation)
  };
  //品牌
  if (y.brandName) {
    data.brandName = y.brandName;
  }
  //车系名称
  if (y.seriesName) {
    data.seriesName = y.seriesName;
  }
  //车型
  if (y.autoType) {
    data.autoType = y.autoType;
  }
  //变速箱
  if (y.gearbox) {
    data.gearbox = y.gearbox;
  }
  //驱动
  if (y.drive) {
    data.drive = y.drive;
  }
  //燃料类型
  if (y.fuelType) {
    data.fuelType = y.fuelType;
  }
  //排放
  if (y.emission) {
    data.emission = y.emission;
  }
  //国别
  if (y.countryType) {
    data.countryType = y.countryType;
  }
  //颜色
  if (y.carColor) {
    data.carColor = y.carColor;
  }
  //亮点
  if (y.starConfig.length) {
    data.starConfig = y.starConfig.join(',');
  }
  //车源偏好
  if (y.sortType) {
    data.sortType = y.sortType;
  }
  data.cddUsedBlock = { gz: [], yx: [], rr: [] };
  data.cddUsedCount = {
    gzTotal: obj.gzCount,
    yxTotal: obj.yxCount,
    rrTotal: obj.rrCount,
    allTotal: obj.allCount
  };
  let cdd = compareCar(obj.sourceData, obj.allOriginalData);
  data.cddUsedUsable = cdd;
  return data;
};
const getMonitorMSelect = (list: ISourceData[]): number => {
  let newLevelNum = 0;
  let priceDownLevelNum = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].newLevel > 0) {
      newLevelNum++;
    }
    if (list[i].priceDownLevel > 0) {
      priceDownLevelNum++;
    }
  }
  if (newLevelNum > 0) {
    return 2;
  } else if (newLevelNum == 0 && priceDownLevelNum > 0) {
    return 3;
  } else if (newLevelNum == 0 && priceDownLevelNum == 0) {
    return 1;
  } else {
    return 1;
  }
};

function addPlatfromData(allData: any, PlatfromData: any, index: number) {
  if (index < PlatfromData.length) {
    //是否已满
    if (allData.length >= 50) {
      return 0; //总已满
    } else {
      return 1; //总的未满
    }
  } else {
    return 2; //某个平台满
  }
}

function compareCar(array1: ISourceData[], array2: IFormatResult[]) {
  let result = [];
  for (let key in array1) {
    let stra = array1[key];
    let count = 0;
    for (let j = 0; j < array2.length; j++) {
      let strb = array2[j];
      if (stra.platform === 'gz' && strb.platform === 'gz') {
        if ((stra.data as IGuaZiData).puid === strb.carId) {
          count++;
        }
      }
      if (stra.platform === 'yx' && strb.platform === 'yx') {
        if ((stra.data as IYouXinData).carid === strb.carId) {
          count++;
        }
      }
      if (stra.platform == 'rr' && strb.platform === 'rr') {
        if ((stra.data as IRenRenData).id === strb.carId) {
          count++;
        }
      }
    }
    if (count > 0) {
      result.push(stra);
    }
  }
  return result;
}
function monitorFilter(arr: any, mSelect: number) {
  let newArr = [];
  if (mSelect == 1) {
    newArr = arr;
  }
  if (mSelect == 2) {
    newArr = arr.filter((item: any) => {
      return item.newLevel > 0;
    });
  }
  if (mSelect == 3) {
    newArr = arr.filter((item: any) => {
      return item.priceDownLevel > 0;
    });
  }
  return newArr;
}
export {
  getUsedCardAllData,
  getMonitorAllData,
  addMonitorParam,
  updateMonitorParam,
  getMonitorMSelect,
  getBatchFilter
};
