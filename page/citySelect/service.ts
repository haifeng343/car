import Http from "../../utils/http";

export default class CitySelectService {
  //城市列表
  getCityList() {
    return Http.get('/cityList.json');
  }
  //热门城市
  indexParam() {
    return Http.get('/indexParam.json')
  }
  //城市详情
  cityDetail(cityName:string) {
    return Http.get('/cityDetail.json', { cityName })
  }
}
