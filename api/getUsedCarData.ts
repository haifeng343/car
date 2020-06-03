import { guazi, youxin, renren } from './getDataFromPlatform';
import { doFormatData } from '../formatter/formatter';
import { compareSort } from '../utils/util'
interface ICarData {
  count: number;
  data: IFormatResult[];
}
const getGuaZiCarData = (
  type: number = 1,
  filter: IAnyObject = {}
): Promise<ICarData> => {
  const app = getApp<IAppOption>();
  const data: ISearchData = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.gz?data.cityId.gz.city_id:0);
  if(!!filter.temp) {
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  if(!city){
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  let count:number = 0;
  let list: IFormatResult[] = [];
  let get = [];
  let minPrice = +filter.priceRange.split(",")[0]
  let maxPrice = +filter.priceRange.split(",")[1]
  if(minPrice === 0 && maxPrice === 9999){
    get.push(getGuaZiCarDataPage(type, 1, filter))
  }else if(minPrice === 0 && maxPrice !== 9999){
    let nPrice = Math.ceil(maxPrice*1.075)
    let nfilter1 = {...filter,...{order:1,priceRange:maxPrice+','+nPrice}}
    get.push(getGuaZiCarDataPage(type, 1, filter))
    get.push(getGuaZiCarDataPage(type, 1, nfilter1))
  }else if(minPrice !== 0 && maxPrice === 9999){
    let nPrice = Math.ceil(minPrice*1.075)
    let nfilter1 = {...filter,...{order:1,priceRange:nPrice+','+maxPrice}}
    get.push(getGuaZiCarDataPage(type, 1, filter))
    get.push(getGuaZiCarDataPage(type, 1, nfilter1))
  }else{
    let nPrice = Math.ceil(maxPrice*1.075)
    let nfilter1 = {...filter,...{order:1,priceRange:maxPrice+','+nPrice}}
    get.push(getGuaZiCarDataPage(type, 1, filter))
    get.push(getGuaZiCarDataPage(type, 1, nfilter1))
  }
  return Promise.all(
    get.map((promiseItem) => {
      return promiseItem.catch((err) => {
        return Promise.resolve(err);
      });
    })
  ).then((resp) => {
    if (resp.filter((item) => item.code&&item.code < 0).length === resp.length) {
      return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
    } else {
      let resData0:IFormatResult[] = [];
      let resData1:IFormatResult[] = [];
      if(resp[0]&&resp[0].data){
        resData0 = resp[0].data
      }
      if(resp[1]&&resp[1].data){
        resData1 = resp[1].data
      }

      resData0 = resData0.filter((item:any)=>item.price >= minPrice*10000 && item.price<= maxPrice*10000)

      resData1 = resData1.filter((item:any)=>item.price >= minPrice*10000 && item.price<= maxPrice*10000)
      list = list.concat(resData0).concat(resData1)
      //合并2次并去重
      let obj:any={}
      let peon = list.reduce((cur:any,next:any)=>{
        obj[next.carId] ? "" : obj[next.carId] = true && cur.push(next);
        return cur;
      },[])
      //根据用户喜好排序 1:低价 5：里程少 4：车龄少
      if(filter.order&&filter.order === '1'){
        peon.sort(compareSort('price','asc'))
      }
      if(filter.order&&filter.order === '5'){
        peon.sort(compareSort('mileage','asc'))
      }
      if(filter.order&&filter.order === '4'){
        peon.sort(compareSort('licensedDate','desc','carId'))
      }
      //实际count 总套数已第一次请求为准，但是如果小于50套，已2次请求并去重的数组长度为准
      if(resp[0]&&resp[0].data&&resp[0].count>50){
        count = resp[0].count
      }else{
        count = peon.length 
      }
      return Promise.resolve({ count, data: peon });
    }
  });
};

const getGuaZiCarDataPage=(
  type: number = 1,
  num: number = 1,
  filter: IAnyObject = {}
): Promise<ICarData> =>{
  const app = getApp<IAppOption>();
  const data: ISearchData = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.gz?data.cityId.gz.city_id:0);
  const page = { size: 50, num: num };
  return guazi
    .searchList(city, page, filter)
    .then((res) => {
      return Promise.resolve({
        count: res.data.total,
        data: doFormatData(res.data, 'gz')
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

const getYouxinCarData = (
  type: number = 1,
  filter: any = []
):Promise<any> => {
  const app = getApp<IAppOption>();
  const data:ISearchData =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.yx?data.cityId.yx.cityid :'');
  if(!!filter[0].temp) {
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  if(!city){
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  let getPromise =[]
  for(let filterItem of filter) {
    let firstList: ICarData[] = [];
    let list: ICarData[] = [];
    let count:number = 0;
    let get = getYouxinCarDataPage(type, 1, filterItem).then((res:any)=>{
        if(res.n_p === 0){
          return Promise.reject({ code: -101, mag: '平台无数据！' })
        }else{
          let PromiseList = [];
          filterItem = {...filterItem,...{n_p:res.n_p,c_p:res.c_p,p_p:res.p_p}}
          firstList = res.data;
          count = res.count
          PromiseList.push(getYouxinCarDataPage(type, 2, filterItem));
          PromiseList.push(getYouxinCarDataPage(type, 3, filterItem));
          return Promise.all(
            PromiseList.map((item) => {
              return item.catch((err) => {
                return Promise.resolve(err);
              });
            })
          ).then(resp => {
            if (resp.filter((item) => item.code&&item.code < 0).length === 2) {
              //return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
              return Promise.resolve({count,data:firstList})
            } else {
              for(let respItem of resp) {
                if (!!respItem && respItem.data) {
                  list = list.concat(respItem.data);
                }
              }
              list = firstList.concat(list)
              return Promise.resolve({ count, data: list });
            }
          });

        }
    }).catch((res:any)=>{
        return Promise.reject(res)
    })
    getPromise.push(get)
  }
  return Promise.all(getPromise.map((item) => {
    return item.catch((err) => {
      return Promise.resolve(err);
    });
  })
  ).then((resp:any)=>{
    let lists: ICarData[] = [];
    let count:number = 0;
    if(resp.filter((item:any) => item.code&&(item.code === -100||item.code === -200)).length === resp.length){
      return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
    }else if(resp.filter((item:any) => item.code&&(item.code === -101)).length === resp.length){
      return Promise.reject({ code: -101, mag: '平台无数据！' })
    }else{
      for(let respItem of resp) {
        if (!!respItem && respItem.data) {
          lists = lists.concat(respItem.data);
          count += respItem.count
        }
      }
      return Promise.resolve({ count, data: lists });
    }
  })
};

/**
 * type 1 车源列表；2监控详情
 */
const getYouxinCarDataPage = (
  type: number = 1,
  num: number = 1,
  filter: IAnyObject = {}
): Promise<ICarData> => {
  const app = getApp<IAppOption>();
  const data:ISearchData =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.yx?data.cityId.yx.cityid :'');
  const page = { size: 20, num: num };
  return youxin
    .searchList(city, page, filter)
    .then((res:any) => {
      return Promise.resolve({
        count: res.data.local_total,
        data: doFormatData(res.data, 'yx'),
        n_p:res.data.n_p,
        c_p:res.data.c_p,
        p_p:res.data.p_p
      });
    })
    .catch((res:any) => {
      return Promise.reject(res);
    });
};

const getRenRenCarData = (
  type: number = 1,
  filter: any = {}
): Promise<ICarData> => {
  const app = getApp<IAppOption>();
  const data:ISearchData = type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.rr?data.cityId.rr.city :'');
  if(!!filter.temp) {
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  if(!city){
    return Promise.reject({ code: -101, mag: '平台无数据！' })
  }
  let list: IFormatResult[] = [];
  
  return Promise.all(
    [
      getRenRenCarDataPage(type, 1, filter),
      getRenRenCarDataPage(type, 2, filter)
    ].map((promiseItem) => {
      return promiseItem.catch((err) => {
        return Promise.resolve(err);
      });
    })
  ).then(([r0, r1]) => {
    if ([r0, r1].filter((item) => item.code&&item.code < 0).length === 2) {
      return Promise.reject({ code: -100, mag: '超时或接口访问失败！' });
    } else {
      if (r0 && r0.data) {
        list = list.concat(r0.data);
      }
      if (r1 && r1.data) {
        list = list.concat(r1.data);
      }
      const count = [r0, r1].find((item) => !item.code).count;
      return Promise.resolve({ count, data: list });
    }
  });
};
/**
 * type 1 车源列表；2监控详情
 */
const getRenRenCarDataPage = (
  type: number = 1,
  num: number = 1,
  filter: IAnyObject = {}
): Promise<ICarData> => {
  const app = getApp<IAppOption>();
  const data:ISearchData =
    type == 1 ? app.globalData.searchData : app.globalData.monitorSearchData;
  const city = (data.cityId.rr?data.cityId.rr.city :'');
  const page = { size: 40, num: num };
  return renren
    .searchList(city, page, filter)
    .then((res: any) => {
      return Promise.resolve({
        count: res.body.numFound,
        data: doFormatData(res.body, 'rr')
      });
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export { getGuaZiCarData, getYouxinCarData, getRenRenCarData };
