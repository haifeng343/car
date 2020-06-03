import {
  guazi_address,
  renren_address,
  youxin_address
} from '../utils/httpAddress';
import { Md5 } from '../utils/md5';

const DEFAULT_PAGE = { size: 50, num: 1 }; //默认分页参数

const buildParams = (data: IAnyObject, encodeUrl = false): string => {
  const params = [];
  for (let key of Object.getOwnPropertyNames(data)) {
    let value = data[key];
    if (typeof value === 'object') {
      value = JSON.stringify(value);
      params.push(key + '=' + (encodeUrl ? encodeURIComponent(value) : value));
    } else if (typeof value !== 'undefined') {
      //undefined 类型不予提交
      params.push(key + '=' + (encodeUrl ? encodeURIComponent(value) : value));
    }
  }
  return params.join('&');
};

/**
 * 基础参数
 * @type {{ca_: string, ca_n: string, lng: string, screenWH: string, deviceId: string, mac: string, platform: string, versionId: string, osv: string, appid: number, customerId: number, model: string, guazi_city: number, dpi: string, lat: string}}
 */
const appVer = '6.1.6.0';
const baseParams = {
  appid: 12,
  ca_n: 'xiaomimarket01',
  ca_s: 'app_tg',
  customerId: 879,
  deviceId: '866135030723842',
  dpi: '3.0',
  lat: '30.000000',
  lng: '120.000000',
  mac: '50:8f:4c:5b:e5:0a',
  model: 'Redmi Note 4X',
  osv: '7.0',
  platform: 'armeabi-v7a',
  screenWH: '1080X1920',
  versionId: appVer
};

const baseHeaders = {
  'X-Ganji-Agency': 'xiaomimarket01',
  contentformat: 'json2',
  'GjData-Version': '1.0',
  versionId: appVer,
  // 'User-Agent': 'c_android/'+appVer+'(Android;7.0;dpi/3.0)',
  'X-Ganji-CustomerId': 879,
  'X-Ganji-VersionId': appVer,
  model: 'Redmi Note 4X',
  CustomerId: 879
};

/**
 * 瓜子签名算法
 * @param obj
 * @returns {*|string}
 */
const sign = (obj: IAnyObject = {}): string => {
  const keys = Object.keys(obj).sort();
  let signStr = '';
  for (let key of keys) {
    let val = obj[key] + '';
    val = val.replace(/ /gi, '');
    signStr += key + '=' + encodeURIComponent(val);
  }
  signStr += 'd9628ffb2557c1e9362fd7e88604c3be';
  const sign1 = Md5.hashStr(signStr);
  return Md5.hashStr(sign1 + 'd9628ffb2557c1e9362fd7e88604c3be') as string;
};

/**
 * 搜索列表
 * @param city 城市id
 * @param page
 * @param filter
 * {
 *     order： 排序（0: "智能排序", 7："最新上架", 1: "价格最低", 2: "价格最高", 4: "车龄最短", 5: "里程最少"）
 *     minor: 品牌（参数参见筛选条件-品牌中的value值，例如 audi）单选
 *     tag: 车系（不限为-1，其它参考筛选条件-品牌-车系中的value值）单选
 *     priceRange: 价格区间（最低价,最高价 例如4,12 单位万元）
 *     gearbox:变速（1:手动,2:自动） 多选，逗号分割
 *     auto_type: 车型（5：两厢, 6:三厢, 4:跑车, 2:SUV, 3:MPV, 7:面包车, 8:皮卡， 注意SUV可选驱动类型driving_type） 多选，逗号分割
 *     driving_type: 驱动类型（-1： 不限, 1:前轮驱动, 2:后轮驱动, 3:四轮驱动）单选
 *     license_date:车龄(最低,最高 例如2,10 单位年)
 *     diff_city: 车牌所在地（2：本地，1：外地）单选
 *     road_haul：里程（最低,最高 例如2,10 单位万公里）
 *     emission：排放标准（3：国四，4：国五，5：国六）多选，逗号分割
 *     air_displacement：排量（最低,最高 例如0.8,1.9 单位升）支持浮点
 *     guobie：国别（参考筛选条件-国别）多选，逗号分割
 *     fuel_type：燃油类型（1：汽油，2：柴油，3：电动，4：油电混合，5：其他）多选，逗号分割
 *     seat：座位（2：2座， 4：4座，5：5座，6：6座，7：7座及以上）多选，逗号分割
 *     tag_types: (不传：筛选对应城市+全国, 50: 只查询全国)
 *     car_color：颜色（参考筛选条件-颜色）多选，逗号分割
 *     bright_spot_config：亮点（参考筛选条件-亮点）多选，逗号分割
 *     key_word：关键词
 * }
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
const guazi = {
  searchList(
    city: number,
    page = DEFAULT_PAGE,
    filter: IAnyObject = {}
  ): Promise<IGuaZiResponse> {
    let params: IAnyObject = Object.assign(
      {
        city,
        city_filter: city,
        guazi_city: city,
        page: page.num,
        pageSize: page.size
      },
      baseParams,
      filter
    );
    params.sign = sign(params);
    return new Promise((resolve, reject) => {
      wx.request({
        url:
          guazi_address +
          '/clientc/post/getCarList' +
          '?' +
          buildParams(params, true),
        method: 'GET',
        header: baseHeaders,
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject({ code: -100, msg: '超时或接口访问失败！' });
          } else if (res.data && res.data.code >= 0) {
            resolve(res.data);
          } else {
            reject({ code: -200, msg: '接口返回数据有误！' });
          }
        },
        fail: () => {
          reject({ code: -100, msg: '超时或接口访问失败！' });
        }
      });
    });
  }
};

const baseParamsRenren = {
  uuid: '75F2FFC0-25E8-42C1-B346-3246C125A726',
  appkey: 'rrc-openapi-xcx-3TT9FFma'
};
/**
 * 人人车搜索列表
 * @param city 城市名称（如没有不选城市 可以填全国）
 * @param page
 * @param filter
 * {
 *     sort: 排序类型（默认不传, price:价格，publish_time：发布时间，mileage：里程，licensed_date：车龄）
 *     seq: 排序方式 （默认不传, desc: 倒序，asc：正序）
 *     brand: 品牌名称 （参考筛选条件-品牌，取name值）单选
 *     car_series：车系（参考筛选条件-品牌-车系）单选
 *     price: 价格（最低价-最高价，例如2-4 单位万元）
 *     level:车型拼音（jiao:轿车,pao:跑车,suv:SUV,mpv:MPV,business:商用车,mian:面包车,pika:皮卡，wei：微型车,xiao:小型车,jin:紧凑型车,zhong:中型车,da:大中型车,hao:豪华车,weimian:微面,qingke:轻客）多选，逗号分割
 *     gearbox:变速（AT:自动,MT:手动）多选，逗号分割
 *     age:车龄（最低-最高，例如2-10 单位年）
 *     mileage：里程（最低-最高，例如2-10 单位万公里）
 *     displacement：排量（最低-最高，例如1.2-2.0 单位升）
 *     emission：排放标准（5：国五,4：国四,3：国三,2：国二）多选，逗号分割
 *     brand_country：国别（参考筛选条件-国别，取value值）多选，逗号分割
 *     fuel_type:燃料类型（qy:汽油,cy:柴油,dd:电动,yd:油电混合,yq:油改气）多选，逗号分割
 *     drive:驱动（2：两驱，4：四驱）多选，逗号分割
 *     carload:座位（cl1:2座,cl2:4-5座,cl3:5座以上）多选，逗号分割
 *     star_config:亮点（参考筛选条件-亮点，取value值）多选，逗号分割
 *     car_color：颜色（参考筛选条件-颜色，取value值）多选，逗号分割
 *     wd：关键词 （支持品牌或车系）
 * }
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
const renren = {
  searchList(
    city: string,
    page = DEFAULT_PAGE,
    filter: IAnyObject = {}
  ): Promise<IRenRenResponse> {
    let params: IAnyObject = Object.assign(
      { city, rows: page.size, start: (page.num - 1) * 40 },
      baseParamsRenren,
      filter
    );
    return new Promise((resolve, reject) => {
      wx.request({
        url:
          renren_address + '/xcx/search/list' + '?' + buildParams(params, true),
        method: 'GET',
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject({ code: -100, msg: '超时或接口访问失败！' });
          } else if (res.data && res.data.status >= 0) {
            res.data.code = 0;
            resolve(res.data);
          } else {
            reject({ code: -200, msg: '接口返回数据有误！' });
          }
        },
        fail: () => {
          reject({ code: -100, msg: '超时或接口访问失败！' });
        }
      });
    });
  }
};

const signKey = 'm1K5@BcxUn!';
/**
 * 优信签名算法
 * @param parmas 请求参数列表
 */
const youxinSign = (parmas: IAnyObject = {}): string => {
  const keys = Object.keys(parmas).sort();
  const sbArr = [];
  for (let key of keys) {
    const val = parmas[key];
    if (key != 'content_version') {
      let sb = key + '=';
      if (val || val === 0) {
        sb += encodeURIComponent(val + '');
      }
      sbArr.push(sb);
    }
  }
  const key = sbArr.join('&') + signKey;
  const signStr = Md5.hashStr(key) as string;
  const str =
    signStr.charAt(20) +
    signStr.charAt(15) +
    signStr.charAt(0) +
    signStr.charAt(3) +
    signStr.charAt(1) +
    signStr.charAt(5);
  return str;
};
const youxinHeader = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const youxinbaseParams = {
  // _apikey:'',注意_apikey需要通过签名算法得出
  app_source: 3,
  appver: '10.15.0',
  channel: 'xiaomi',
  gps_type: 1,
  imei: 866135030723842,
  ip: '192.168.137.25',
  nb: '0b8dac435dff841eeb48a9bafa6913b9',
  net: 'wifi',
  oaid: '67bd3b1a21e58cb1',
  os: 'android',
  source_type: 1,
  sysver: 24,
  uuid: 'c47b7c93-83ce-4f03-8996-376744267497',
  xdid: '6ee251d37b93cb7b961e28ae71a87631'
};
/**
 * 优信搜索列表
 * @param city 所选城市id
 * @param page
 * @param filter
 * {
 *      provinceid: 省份id
 *      brandid： 品牌id
 *      serieid: 车系id
 *      pricemin: 最低价
 *      pricemax： 最高价
 *      category: 车型参数1 （参考筛选条件-车型 例如三厢轿车category:0,structure:2 ）单选
 *      structure：车型参数2 （参考筛选条件-车型）单选
 *      gearbox: 变速（2：手动，1：自动）单选
 *      agemin：最低车龄 单位年
 *      agemax：最高车龄 单位年
 *      mileagemin：最低里程 单位万公里
 *      mileagemax：最高里程 单位万公里
 *      displacementmin：最低排量 浮点类型 单位升
 *      displacementmax：最高排量 浮点类型 单位升
 *      engine：发动机（参考筛选条件-发动机）单选
 *      emission_standard：排放标准（3：国三及以上，4：国四及以上，5：国五及以上，6：国六）单选
 *      color：颜色（参考筛选条件-颜色）单选
 *      fueltype：燃料类型（1：汽油，2：柴油，3：电动，4：油电混合）单选
 *      country：厂商（3：合资，2：进口，1：国产）单选
 *      seatnum：座位（2：2座，4:4座,5:5座,6:6座,7:7座及以上）单选
 *      country_type:国别（参考筛选条件-国别）单选
 *      drive:驱动（1：前驱，2：后驱，3：四驱）单选
 *      config_highlight：亮点（参考筛选条件-配置亮点）多选 逗号分隔
 *      keyword：关键词
 *
 * }
 */
const youxin = {
  searchList(
    city: string|number,
    page = DEFAULT_PAGE,
    filter: any = {}
  ): Promise<IYouXinResponse> {
    const ts = new Date().getTime();
    const params: IAnyObject = Object.assign(
      {},
      youxinbaseParams,
      {
        cityid: city,
        gps_type: '2',
        latitude: '30.276733',
        list_type: '1',
        n_p:"0",
        offset: (page.num - 1) * 20,
        ref: 'HomeFragment',
        search_cityid: city,
        ts: ts,
        url: 'VehicleDetailsActivity'
      },
      filter
    );
    params._apikey = youxinSign(params);
    const bodyStr = buildParams(params, true);
    return new Promise((resolve, reject) => {
      wx.request({
        url: youxin_address + '/car_search/search',
        method: 'POST',
        header: youxinHeader,
        data: bodyStr,
        success: (res: any) => {
          if (res.statusCode !== 200) {
            reject({ code: -100, msg: '超时或接口访问失败！' });
          } else if (res.data && res.data.code >= 0) {
            resolve(res.data);
          } else {
            reject({ code: -200, msg: '接口返回数据有误！' });
          }
        },
        fail: () => {
          reject({ code: -100, msg: '超时或接口访问失败！' });
        }
      });
    });
  }
};

export { guazi, renren, youxin };
