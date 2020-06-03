/// <reference path="./types/index.d.ts" />
interface IAppOption {
  globalData: {
    searchData: ISearchData;
    monitorSearchData: ISearchData;
    monitorDefaultSearchData: ISearchData;
    isUserBindPhone: boolean;
    isUserBindPublic: boolean;
    isAuth: boolean;
    usedCarListData: IusedCarListData;
  };
}
interface ISearchData {
  city: string;
  cityId: ICityId;
  brandName: string;
  brandId: IBrandId;
  seriesName: string;
  seriesID: IAnyObject;
  searchJson: string;
  relationJson: string;
  minPrice: number;
  maxPrice: number;
  autoType: number;
  gearbox: number;
  drive: number;
  minAge: number;
  maxAge: number;
  minMileage: number;
  maxMileage: number;
  minDisplacement: number;
  maxDisplacement: number;
  fuelType: number;
  emission: number;
  countryType: number;
  carColor: number;
  starConfig: number[];
  sortType: number;
  advSort: number;
}

interface ISearchObject {
  gz?: {
    minor: string;
    tag?: string;
  };
  yx?: {
    brandid: string;
    serieid?: string;
  };
  rr?: {
    brand: string;
    car_series?: string;
  };
}

interface ICityId {
  rr?: { city: string };
  gz?: { city_id: number; domain: string };
  yx?: { provinceid: string | number; cityid: string | number };
}

interface IBrandId {
  icon?: string;
  id?: number;
  rr?: { name: string };
  gz?: { value: string };
  yx?: { brandid: string };
}

interface ISeriesID {
  id?: number;
  rr?: { name: string };
  gz?: { value: string };
  yx?: { serieid: string };
}

interface IAnyObject {
  [key: string]: any;
}

interface IFormatResult {
  title: string;
  price: number;
  priceText: string;
  thumb: string;
  firstPay: number;
  firstPayText: string;
  tag: string[];
  mileage: number;
  mileageText: string;
  licensedDate: Date;
  licensedText: string;
  source: any;
  platform: string;
  carId: number | string;
  newLevel?: number;
  priceDownLevel?: number;
  priceMargin?: number;
  collection?: boolean;
}

interface IGuaZiData {
  title: string;
  puid: number;
  clue_id: number;
  license_date: string;
  road_haul: string;
  thumb_img: string;
  tags: {
    small: any[];
    big: any[];
  };
  sale_type: number;
  first_pay: string;
  title_tags: any[];
  new_post: string;
  msrp: string;
  car_city_name: string;
  city_name: string;
  hot_params: any[];
  tracking_tag: string;
  promote_price: number;
  price_desc: {
    small: {
      title: string;
    };
    big: {
      title: string;
    };
  };
  price: string;
  video_icon: string;
  video_icon_type: number;
  is_numberd: number;
  image_list: string[];
  is_collected: number;
  list_tags?: {
    text: string;
    color: string;
    string: string;
  }[];
}

interface IGuaZiResponseData {
  page: number;
  totalPage: number;
  total: number;
  total_desc: string;
  lastTime: number;
  postList: IGuaZiData[];
  recommend: IGuaZiData[];
  tagsList: any[];
  event_tracking: IAnyObject;
}

interface IGuaZiResponse {
  code: number;
  message: string;
  data: IGuaZiResponseData;
}

interface IYouXinResponse {
  code: number;
  message: string;
  data: IYouXinResponseData;
}

interface IYouXinResponseData {
  list: IYouXinData[];
  wish_list_location: number;
  abtest: string;
  st: number;
  search_recommend: any[];
  conditions_list: [
    {
      abtest: string;
      abtest_recommend: string;
      abtest_tags: string;
      app_source: string;
      c_p: string;
      channel: string;
      cityid: string;
      gps_type: string;
      imei: string;
      imsi: string;
      latitude: string;
      list_type: string;
      loc_num: string;
      longitude: string;
      n_p: string;
      oaid: string;
      offset: string;
      p_p: string;
      page_info: string;
      provinceid: string;
      ref: string;
      search_cityid: string;
      site_id: string;
      site_type: string;
      st: string;
      sysver: string;
      task_id: string;
      tmpid: string;
      url: string;
      uuid: string;
      xdid: string;
      zg_num: string;
      series_type: number;
      serieid: number;
      tpg_serieid: number;
    }
  ];
  total: number;
  cartext: string;
  local_total: number;
  topcar_total: number;
  nearcar_total: number;
  offset: number;
  p_p: number;
  c_p: number;
  n_p: number;
  zg_city: number;
  zg_num: number;
  loc_num: number;
  newcar_total: number;
  search_recommend_series: any[];
  recommend_card_data: [
    {
      type: number;
      name: string;
      img: string;
      param: {
        tpg_serieid: string;
        brandid: string;
        brandname: string;
        serieid: string;
        seriename: string;
      };
    }
  ];
  recommend_word_for_empty: any[];
  im_text: string;
  page_info: string;
  scenes_guide: any[];
  is_enable_radar: number;
  sort: any[];
  version: string;
}

interface IYouXinData {
  carid: number;
  dealerid: number;
  mortgage: number;
  carserie: string;
  carname: string;
  carnotime: string;
  mileage: string;
  carimg: string;
  carimg_src: string;
  status: number;
  status_show: string;
  qa_type: number;
  is_numbers: number;
  cityid: number;
  cityname: string;
  caricontype: string;
  city_range_type: number;
  straight_range_type: number;
  is_person: number;
  show_text: string;
  is_relative_half_car: number;
  identification_title: string;
  identification_icon: string;
  is_recommend: number;
  brandid: number;
  seriesid: number;
  modeid: number;
  is_show: string;
  source_tag: string;
  is_lock: number;
  lock_msg: string;
  is_show_ask_price: number;
  days_text: string;
  is_support_video: number;
  shoufu_price: string;
  price: string;
  month_pay: number;
  is_yicheng_pay: number;
  car_condition_tag: [];
  condition_level_title: string;
  compare_price_state: number;
  is_zg_car: number;
  icon_show_zg: number;
  is_show_find_similar: number;
  discount_money: string;
  price_sale_after: string;
  storeroom: string;
  tags: {
    is_today_promotion_sale: number;
    is_zero_transfer: number;
    is_good_ck: number;
    is_no_reason_back: number;
    is_discount_sale: number;
    is_finance_special: number;
    is_vr: number;
  };
  tags_sort: [
    {
      type: number;
      name: string;
    }
  ];
  radar_data: [];
  year: number;
  price_new: number;
  score: string;
  origin_carid: number;
  behavior_tag_name: string;
  price_before: string;
}

interface IRenRenResponse {
  status: number;
  errmsg: string;
  body: IRenRenResponseData;
}

interface IRenRenResponseData {
  numFound: number;
  start: number;
  image_format_config: {
    index_img: string;
    search_list_img: string;
    detail_box_img: string;
    detail_gallery_img: string;
    detail_related_img: string;
    detail_fullscreen_slider_img: string;
  };
  log_id: string;
  traffic: string;
  solr_q: string;
  dfr: string;
  is_baomai_city: number;
  docs: IRenRenData[];
}

interface IRenRenData {
  id: string;
  encrypt_id: string;
  title: string;
  brand: string;
  car_series: string;
  car_level: string;
  licensed_date: string;
  mileage: number;
  gearbox: string;
  price: number;
  newcar_price: number;
  displacement: number;
  search_image_url: string[];
  emission: string;
  car_color: string;
  city: string;
  grade: string;
  publish_time: string;
  urgent_sale: number;
  exclusive_car: number;
  fuel_type: string;
  drive: string;
  carload: number;
  district: string;
  licensed_city: string;
  channel: string;
  car_tag: string;
  discount_time: string;
  last_modified: string;
  brand_country: string;
  starconfig: string;
  location: string;
  sell_on_consignment: number;
  model_id: number;
  predict_price: number;
  rank: number;
  refresh_time: string;
  _version_: number;
  discount: number;
  r: string;
  tags: [
    {
      key: string;
      txt: string;
      color: string;
      'border-color': string;
    }
  ];
  licensed_date_str: string;
  left_icon: {
    type: number;
    text: string;
  };
  down_payment: number;
}

interface BaseEvent {
  type: string;
  timeStamp: number;
  target: {
    id: string;
    dataset: IAnyObject;
  };
  currentTarget: {
    id: string;
    dataset: IAnyObject;
  };
  mark: IAnyObject;
}

interface CustomEvent extends BaseEvent {
  detail: any;
}

interface TouchEvent extends BaseEvent {
  touches: Touch[];
  changedTouches: Touch[];
}

interface CanvasTouchEvent extends BaseEvent {
  touches: CanvasTouch[];
  changedTouches: CanvasTouch[];
}

interface Touch {
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

interface CanvasTouch {
  identifier: number;
  x: number;
  y: number;
}

interface AuthData {
  session_key: string;
  iv: string;
  encryptedData: string;
}

interface BasePromiseError {
  code: number;
  message: string;
  data?: any;
}
interface ISourceData {
  data: IGuaZiData | IYouXinData | IRenRenData;
  newLevel: number;
  platform: string;
  priceDownLevel: number;
}

interface IusedCarListData {
  allCount: number;
  gzCount: number;
  yxCount: number;
  rrCount: number;
  showCount: number;
  averagePrice: number;
  lowPrice: number;
  lowPriceData:IFormatResult|null;
  gzlowPriceData:IFormatResult|null;
  yxlowPriceData:IFormatResult|null;
  rrlowPriceData:IFormatResult|null;
  firstlowPriceData:IFormatResult|null;
  enoughList: any;
  ddCoin?: number;
  bindPhone?: boolean;
  bindPublic?: boolean;
  bottomType: number;
  taskTime?: string;
  startTimeName?: string;
  monitorId?: number;
  fee?: number;
  totalFee?: number;
  sortType: number;
  allOriginalData: IFormatResult[];
  sourceData?: ISourceData[];
  gzSelectCount: number;
  yxSelectCount: number;
  rrSelectCount: number;
}
