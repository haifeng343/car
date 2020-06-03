const transformFilter = (searchData:any = {},type: 'gz'|'rr'|'yx' = 'gz'  )=>{
  if(type === 'gz') {
    //城市为空
    if(!searchData.city || !searchData.cityId.gz || !searchData.cityId.gz.city_id || !searchData.cityId.gz.domain) {
      return {temp:true};
    }
    let filter:any = {};
    //品牌
    if(searchData.brandName && searchData.brandId && searchData.brandId.gz && searchData.brandId.gz.value) {
      filter.minor = searchData.brandId.gz.value;
    } else if(searchData.brandName) {
      return {temp:true};
    }
    //车系
    if(searchData.seriesName && searchData.seriesID && searchData.seriesID.gz && searchData.seriesID.gz.value && filter.minor) {
      filter.tag = searchData.seriesID.gz.value;
    } else if(searchData.seriesName) {
      return {temp:true};
    } else {
      filter.tag = -1;
    }
    //价格 minPrice:0, //最低价 单位万元
    //     maxPrice:50, //最高价 单位万元
    //     priceRange: 价格区间（最低价,最高价 例如4,12 单位万元
    if(searchData.maxPrice && searchData.maxPrice != 50) {
      filter.priceRange = searchData.minPrice + ',' + searchData.maxPrice;
    } else {
      filter.priceRange = searchData.minPrice + ',9999';
    }
    //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡
    //auto_type 5：两厢, 6:三厢, 4:跑车, 2:SUV, 3:MPV, 7:面包车, 8:皮卡
    switch(searchData.autoType) {
      case 1:filter.auto_type = '5,6';break;
      case 2:filter.auto_type = '2';break;
      case 3:filter.auto_type = '3';break;
      case 4:filter.auto_type = '4';break;
      case 7:filter.auto_type = '7';break;
      case 8:filter.auto_type = '8';break;
      default :break;
    }
    //变速箱 1:手动,2:自动
    //gearbox 1:手动,2:自动
    switch(searchData.gearbox) {
      case 1:filter.gearbox = '1';break;
      case 2:filter.gearbox = '2';break;
      default :break;
    }
    //驱动 3四驱
    //driving_type -1： 不限, 1:前轮驱动, 2:后轮驱动, 3:四轮驱动
    switch(searchData.drive) {
      case 3:filter.driving_type = '3';break;
      default :filter.driving_type = '-1';break;
    }
    //车龄   minAge:0, //最低车龄
    //       maxAge:6, //最高车龄
    //       license_date:车龄(最低,最高 例如2,10 单位年)
    if(searchData.maxAge && searchData.maxAge != 6) {
      filter.license_date = searchData.minAge + ',' + searchData.maxAge;
    } else {
      filter.license_date = searchData.minAge + ',99';
    }
    //里程   minMileage:0, //最低里程 单位万公里
    //       maxMileage:14, //最高里程 单位万公里
    //       road_haul：里程（最低,最高 例如2,10 单位万公里）
    if(searchData.maxMileage && searchData.maxMileage != 14) {
      filter.road_haul = searchData.minMileage + ',' + searchData.maxMileage;
    } else {
      filter.road_haul = searchData.minMileage + ',9999';
    }
    //排量   minDisplacement:0, //最低排量 单位升
    //       maxDisplacement:4, //最高排量 单位升
    //       air_displacement：排量（最低,最高 例如0.8,1.9 单位升）支持浮点
    let randomNum = (0.0000001 * Math.floor(Math.random() * 10000)).toFixed(7);
    if(searchData.maxDisplacement && searchData.maxDisplacement != 4) {
      filter.air_displacement = searchData.minDisplacement + ',' + (searchData.maxDisplacement + randomNum);
    } else {
      filter.air_displacement = searchData.minDisplacement + ',' + (99 + randomNum);
    }
    //燃料类型1：汽油，2：柴油，3：电动，4：油电混合
    //fuel_type：燃油类型（1：汽油，2：柴油，3：电动，4：油电混合，5：其他）多选，逗号分割
    switch(searchData.fuelType) {
      case 1:filter.fuel_type = '1';break;
      case 2:filter.fuel_type = '2';break;
      case 3:filter.fuel_type = '3';break;
      case 4:filter.fuel_type = '4';break;
      default :break;
    }
    //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六
    // emission：排放标准（3：国四，4：国五，5：国六）
    switch(searchData.emission) {
      //瓜子没有国三
      case 3:filter.emission = '3,4,5';break;
      case 4:filter.emission = '3,4,5';break;
      case 5:filter.emission = '4,5';break;
      case 6:filter.emission = '5';break;
      default :break;
    }
    //国别 1法系,2美系,3国产,4德系,5日系,6韩系
    // guobie 1法系:1,2美系:2,3国产:3,4德系:4,5日系:5,6韩系:6
    switch(searchData.countryType) {
      case 1:filter.guobie = '1';break;
      case 2:filter.guobie = '2';break;
      case 3:filter.guobie = '3';break;
      case 4:filter.guobie = '4';break;
      case 5:filter.guobie = '5';break;
      case 6:filter.guobie = '6';break;
      default :break;
    }
    //颜色 1黑、2白、3银灰、6红、7蓝 、10橙
    //car_color 1黑:1,2白:2, 3银灰:3,6红:6,7蓝:7,10橙:10
    switch(searchData.carColor) {
      case 1:filter.car_color = '1';break;
      case 2:filter.car_color = '2';break;
      case 3:filter.car_color = '3';break;
      case 6:filter.car_color = '6';break;
      case 7:filter.car_color = '7';break;
      case 10:filter.car_color = '10';break;
      default :break;
    }
    //亮点 1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙
    //准新车   tag_types  "value": "4",
    // 新上    tag_types  "value": "15",
    // 超值  	 tag_types  "value": "37",
    // 严选		  tag_types  "value": "18",
    // 倒车影像    bright_spot_config  3
    // 全景天窗		bright_spot_config  1
    // 智能钥匙		bright_spot_config  7
    let starConfig = searchData.starConfig.concat();
    if(starConfig.indexOf(1) > -1) {
      filter.tag_types = '4';
    }
    if(starConfig.indexOf(2) > -1) {
      if(filter.tag_types) {filter.tag_types += ',';}
      else {
        filter.tag_types = ''
      }
      filter.tag_types += '15';
    }
    if(starConfig.indexOf(3) > -1) {
      if(filter.tag_types) {filter.tag_types += ',';}
      else {
        filter.tag_types = ''
      }
      filter.tag_types += '37';
    }
    if(starConfig.indexOf(4) > -1) {
      if(filter.tag_types) {filter.tag_types += ',';}
      else {
        filter.tag_types = ''
      }
      filter.tag_types += '18';
    }
    if(starConfig.indexOf(5) > -1) {
      filter.bright_spot_config = '3';
    }
    if(starConfig.indexOf(6) > -1) {
      if(filter.bright_spot_config) {filter.bright_spot_config += ',';}
      else {
        filter.bright_spot_config = ''
      }
      filter.bright_spot_config += '1';
    }
    if(starConfig.indexOf(7) > -1) {
      if(filter.bright_spot_config) {filter.bright_spot_config += ',';}
      else {
        filter.bright_spot_config = ''
      }
      filter.bright_spot_config += '7';
    }
    //车源偏好 1价格最低、2里程最少、3年龄最小
    //order： 排序（0: "智能排序", 7："最新上架", 1: "价格最低", 2: "价格最高", 4: "车龄最短", 5: "里程最少"）
    switch(searchData.sortType) {
      case 1:filter.order = '1';break;
      case 2:filter.order = '5';break;
      case 3:filter.order = '4';break;
      default :break;
    }

    return filter
  }
  if(type === 'rr') {
    //城市为空
    if(!searchData.city || !searchData.cityId.rr || !searchData.cityId.rr.city) {
      return {temp:true};
    }
    let filter:any = {};
    //品牌
    if(searchData.brandName && searchData.brandId && searchData.brandId.rr && searchData.brandId.rr.name) {
      filter.brand = searchData.brandId.rr.name;
    } else if(searchData.brandName) {
      return {temp:true};
    }
    //车系
    if(searchData.seriesName && searchData.seriesID && searchData.seriesID.rr && searchData.seriesID.rr.name && filter.brand) {
      filter.car_series = searchData.seriesID.rr.name;
    } else if(searchData.seriesName) {
      return {temp:true};
    }
    //价格 minPrice:0, //最低价 单位万元
    //     maxPrice:50, //最高价 单位万元
    //     price: 价格（最低价-最高价，例如2-4 单位万元）
    if(searchData.maxPrice && searchData.maxPrice != 50) {
      filter.price = searchData.minPrice + '-' + searchData.maxPrice;
    } else {
      filter.price = searchData.minPrice + '-9999';
    }
    //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡
    //level:车型拼音（jiao:轿车,pao:跑车,suv:SUV,mpv:MPV,business:商用车,mian:面包车,pika:皮卡，wei：微型车,xiao:小型车,jin:紧凑型车,zhong:中型车,da:大中型车,hao:豪华车,weimian:微面,qingke:轻客）多选，逗号分割
    switch(searchData.autoType) {
      case 1:filter.level = 'jiao';break;
      case 2:filter.level = 'suv';break;
      case 3:filter.level = 'mpv';break;
      case 4:filter.level = 'pao';break;
      case 7:filter.level = 'mian';break;
      case 8:filter.level = 'pika';break;
      default :break;
    }
    //变速箱 1:手动,2:自动
    //gearbox:变速（AT:自动,MT:手动）
    switch(searchData.gearbox) {
      case 1:filter.gearbox = 'MT';break;
      case 2:filter.gearbox = 'AT';break;
      default :break;
    }
    //驱动 3四驱
    //drive:驱动（2：两驱，4：四驱）多选
    switch(searchData.drive) {
      case 3:filter.drive = '4';break;
      default :break;
    }
    //车龄   minAge:0, //最低车龄
    //       maxAge:6, //最高车龄
    //       age:车龄（最低-最高，例如2-10 单位年）
    if(searchData.maxAge && searchData.maxAge != 6) {
      filter.age = searchData.minAge + '-' + searchData.maxAge;
    } else {
      filter.age = searchData.minAge + '-99';
    }
    //里程   minMileage:0, //最低里程 单位万公里
    //       maxMileage:14, //最高里程 单位万公里
    //       mileage：里程（最低-最高，例如2-10 单位万公里）
    if(searchData.maxMileage && searchData.maxMileage != 14) {
      filter.mileage = searchData.minMileage + '-' + searchData.maxMileage;
    } else {
      filter.mileage = searchData.minMileage + '-9999';
    }
    //排量   minDisplacement:0, //最低排量 单位升
    //       maxDisplacement:4, //最高排量 单位升
    //       displacement：排量（最低-最高，例如1.2-2.0 单位升）
    if(searchData.maxDisplacement && searchData.maxDisplacement != 4) {
      filter.displacement = searchData.minDisplacement + '-' + searchData.maxDisplacement;
    } else {
      filter.displacement = searchData.minDisplacement + '-99';
    }
    //燃料类型1：汽油，2：柴油，3：电动，4：油电混合
    //fuel_type:燃料类型（qy:汽油,cy:柴油,dd:电动,yd:油电混合,yq:油改气）多选，逗号分割
    switch(searchData.fuelType) {
      case 1:filter.fuel_type = 'qy';break;
      case 2:filter.fuel_type = 'cy';break;
      case 3:filter.fuel_type = 'dd';break;
      case 4:filter.fuel_type = 'yd';break;
      default :break;
    }
    //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六
    // emission：排放标准（5：国五,4：国四,3：国三,2：国二）多选，逗号分割
    switch(searchData.emission) {
      //人人没有国六
      case 3:filter.emission = '3,4,5';break;
      case 4:filter.emission = '4,5';break;
      case 5:filter.emission = '5';break;
      case 6:return {temp:true};
      default :break;
    }
    //国别 1法系,2美系,3国产,4德系,5日系,6韩系
    // brand_country 1法系：f，2美系：m，3国产：gc，4德系：d，5日系：r，6韩系：h
    switch(searchData.countryType) {
      case 1:filter.brand_country = 'f';break;
      case 2:filter.brand_country = 'm';break;
      case 3:filter.brand_country = 'gc';break;
      case 4:filter.brand_country = 'd';break;
      case 5:filter.brand_country = 'r';break;
      case 6:filter.brand_country = 'h';break;
      default :break;
    }
    //颜色 1黑、2白、3银灰、6红、7蓝 、10橙
    //car_color  1黑:黑色，2白:白色，3银灰:银灰色，6红:红色，7蓝:蓝色，10橙：橙色
    switch(searchData.carColor) {
      case 1:filter.car_color = '黑色';break;
      case 2:filter.car_color = '白色';break;
      case 3:filter.car_color = '银灰色';break;
      case 6:filter.car_color = '红色';break;
      case 7:filter.car_color = '蓝色';break;
      case 10:filter.car_color = '橙色';break;
      default :break;
    }
    //亮点 1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙
    // 准新车    special_tags  "value": "1",
    // 新上      special_tags  "value": "8",
    // 超值  	   special_tags  "value": "4",
    // 严选		   special_tags  "value": "32",
    // 倒车影像  star_config  3
    // 全景天窗	 star_config  8
    // 智能钥匙	 star_config  13
    let starConfig = searchData.starConfig.concat();
    if(starConfig.indexOf(1) > -1) {
      filter.special_tags = '1';
    }
    if(starConfig.indexOf(2) > -1) {
      if(filter.special_tags) {filter.special_tags += ',';}
      else {
        filter.special_tags = ''
      }
      filter.special_tags += '8';
    }
    if(starConfig.indexOf(3) > -1) {
      if(filter.special_tags) {filter.special_tags += ',';}
      else {
        filter.special_tags = ''
      }
      filter.special_tags += '4';
    }
    if(starConfig.indexOf(4) > -1) {
      if(filter.special_tags) {filter.special_tags += ',';}
      else {
        filter.special_tags = ''
      }
      filter.special_tags += '32';
    }
    if(starConfig.indexOf(5) > -1) {
      filter.star_config = '3';
    }
    if(starConfig.indexOf(6) > -1) {
      if(filter.star_config) {filter.star_config += ',';}
      else {
        filter.star_config = ''
      }
      filter.star_config += '8';
    }
    if(starConfig.indexOf(7) > -1) {
      if(filter.star_config) {filter.star_config += ',';}
      else {
        filter.star_config = ''
      }
      filter.star_config += '13';
    }
    //车源偏好 1价格最低、2里程最少、3年龄最小
    //sort: 排序类型（默认不传, price:价格，publish_time：发布时间，mileage：里程，licensed_date：车龄）
    switch(searchData.sortType) {
      case 1:filter.sort = 'price';break;
      case 2:filter.sort = 'mileage';break;
      case 3:filter.sort = 'licensed_date';break;
      default :break;
    }

    return filter
  }
  if(type === 'yx') {
    //城市为空
    if(!searchData.city || !searchData.cityId.yx || !searchData.cityId.yx.cityid || !searchData.cityId.yx.provinceid) {
      return [{temp:true}];
    }
    let filterList:any = [];
    let filter:any = {};
    //省份
    filter.provinceid = searchData.cityId.yx.provinceid;
    //品牌
    if(searchData.brandName && searchData.brandId && searchData.brandId.yx && searchData.brandId.yx.brandid) {
      filter.brandid = searchData.brandId.yx.brandid;
    } else if(searchData.brandName) {
      return [{temp:true}];
    }
    //车系
    if(searchData.seriesName && searchData.seriesID && searchData.seriesID.yx && searchData.seriesID.yx.serieid && filter.brandid) {
      filter.serieid = searchData.seriesID.yx.serieid;
    } else if(searchData.seriesName)  {
      return [{temp:true}];
    }
    //价格 minPrice:0, //最低价 单位万元
    //     maxPrice:50, //最高价 单位万元
    //      pricemin: 最低价
    //      pricemax： 最高价
    filter.pricemin = searchData.minPrice;
    if(searchData.maxPrice && searchData.maxPrice != 50) {
      filter.pricemax = searchData.maxPrice;
    } else {
      filter.pricemax = '9999';
    }
    //变速箱 1:手动,2:自动
    //gearbox:变速（2：手动，1：自动）
    switch(searchData.gearbox) {
      case 1:filter.gearbox = '2';break;
      case 2:filter.gearbox = '1';break;
      default :break;
    }
    //驱动 3四驱
    //drive:驱动（1：前驱，2：后驱，3：四驱）
    switch(searchData.drive) {
      case 3:filter.drive = '3';break;
      default :break;
    }
    //车龄   minAge:0, //最低车龄
    //       maxAge:6, //最高车龄
    //       agemin：最低车龄 单位年
    //       agemax：最高车龄 单位年
    filter.agemin = searchData.minAge;
    if(searchData.maxAge && searchData.maxAge != 6) {
      filter.agemax = searchData.maxAge;
    } else {
      filter.agemax = '99';
    }
    //里程   minMileage:0, //最低里程 单位万公里
    //       maxMileage:14, //最高里程 单位万公里
    //       mileagemin：最低里程 单位万公里
    //       mileagemax：最高里程 单位万公里
    filter.mileagemin = searchData.minMileage;
    if(searchData.maxMileage && searchData.maxMileage != 14) {
      filter.mileagemax = searchData.maxMileage;
    } else {
      filter.mileagemax = '9999';
    }
    //排量   minDisplacement:0, //最低排量 单位升
    //       maxDisplacement:4, //最高排量 单位升
    //       displacementmin：最低排量 浮点类型 单位升
    //       displacementmax：最高排量 浮点类型 单位升
    filter.displacementmin = searchData.minDisplacement;
    if(searchData.maxDisplacement && searchData.maxDisplacement != 4) {
      filter.displacementmax = searchData.maxDisplacement;
    } else {
      filter.displacementmax = '99';
    }
    //燃料类型1：汽油，2：柴油，3：电动，4：油电混合
    //fueltype：燃料类型（1：汽油，2：柴油，3：电动，4：油电混合）单选
    switch(searchData.fuelType) {
      case 1:filter.fueltype = '1';break;
      case 2:filter.fueltype = '2';break;
      case 3:filter.fueltype = '3';break;
      case 4:filter.fueltype = '4';break;
      default :break;
    }
    //排放 3：国三及以上，4：国四及以上，5：国五及以上，6：国六
    // emission_standard：排放标准（3：国三及以上，4：国四及以上，5：国五及以上，6：国六）单选
    switch(searchData.emission) {
      case 3:filter.emission_standard = '3';break;
      case 4:filter.emission_standard = '4';break;
      case 5:filter.emission_standard = '5';break;
      case 6:filter.emission_standard = '6';break;
      default :break;
    }
    //国别 1法系,2美系,3国产,4德系,5日系,6韩系
    // country_type 1法系,  "country_type": 5
    // 2美系,  "country_type": 4
    // 3国产,	"country_type": 6
    // 4德系,	"country_type": 1
    // 5日系,	"country_type": 2
    // 6韩系		"country_type": 3
    switch(searchData.countryType) {
      case 1:filter.country_type = '5';break;
      case 2:filter.country_type = '4';break;
      case 3:filter.country_type = '6';break;
      case 4:filter.country_type = '1';break;
      case 5:filter.country_type = '2';break;
      case 6:filter.country_type = '3';break;
      default :break;
    }
    //颜色 1黑、2白、3银灰、6红、7蓝 、10橙
    // 1黑、"color": 1
    //  2白、"color": 4
    //  3银灰、  "color": 3
    //  6红、 "color": 8
    //  7蓝 、 "color": 11
    //  10橙 "color": 7
    switch(searchData.carColor) {
      case 1:filter.color = '1';break;
      case 2:filter.color = '4';break;
      case 3:filter.color = '3';break;
      case 6:filter.color = '8';break;
      case 7:filter.color = '11';break;
      case 10:filter.color = '7';break;
      default :break;
    }
    //亮点 1准新车,2新上,3超值,4严选,5倒车影像,6全景天窗,7智能钥匙
    // 准新车   "equal_newcar": 1
    // 新上    "today_newcar": 1
    // 超值  	"filter_supervalue": 1
    // 严选		 "uxin_auth": 1
    // 倒车影像     "config_highlight": 82
    // 全景天窗		 "config_highlight": 104
    // 智能钥匙		 "config_highlight": 185
    let starConfig = searchData.starConfig.concat();
    if(starConfig.indexOf(1) > -1) {
      filter.equal_newcar = '1';
    }
    if(starConfig.indexOf(2) > -1) {
      filter.today_newcar = '1';
    }
    if(starConfig.indexOf(3) > -1) {
      filter.filter_supervalue = '1';
    }
    if(starConfig.indexOf(4) > -1) {
      filter.uxin_auth = '1';
    }
    if(starConfig.indexOf(5) > -1) {
      filter.config_highlight = '82';
    }
    if(starConfig.indexOf(6) > -1) {
      if(filter.config_highlight) {filter.config_highlight += ',';}
      else {
        filter.config_highlight = ''
      }
      filter.config_highlight += '104';
    }
    if(starConfig.indexOf(7) > -1) {
      if(filter.config_highlight) {filter.config_highlight += ',';}
      else {
        filter.config_highlight = ''
      }
      filter.config_highlight += '185';
    }
    //车源偏好 1价格最低、2里程最少、3年龄最小
    //orderprice: 1低车价 2高车价
    // 				orderage ：1低车龄
    // 				ordermileage ：1低里程
    switch(searchData.sortType) {
      case 1:filter.orderprice = '1';break;
      case 2:filter.ordermileage = '1';break;
      case 3:filter.orderage = '1';break;
      default :break;
    }

    //车型 1轿车,2SUV,3MPV,4跑车,7面包车,8皮卡
    //category: 车型参数1 （参考筛选条件-车型 例如三厢轿车category:0,structure:2 ）
    switch(searchData.autoType) {
      case 1:
        let filter1 = {...filter,...{category :'0',structure : '2'} };
        filterList.push(filter1);
        let filter2 = {...filter,...{category :'0',structure : '1'} };
        filterList.push(filter2);
        break;
      case 2:filter.category = '8';filter.structure = '0';filterList.push(filter);break;
      case 3:filter.category = '7';filter.structure = '0';filterList.push(filter);break;
      case 4:filter.category = '9';filter.structure = '0';filterList.push(filter);break;
      case 7:filter.category = '10';filter.structure = '0';filterList.push(filter);break;
      case 8:filter.category = '11';filter.structure = '0';filterList.push(filter);break;
      default :filterList.push(filter);break;
    }

    return filterList
  }
  return {temp:true};
};
export default { transformFilter }