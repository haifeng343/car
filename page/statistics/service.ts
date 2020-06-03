import Http from '../../utils/http';
export default class StatisticsService {
  /**
   * 添加监控-二手车
  */
  //添加监控
  addCarMonitor(addParam:any) {
    return Http.post('/cdd/carMonitor/addMonitor.json',addParam)
  }
  /**
   * 开启监控-二手车
  */
  startCarMonitor(addParam:any){
    return Http.post('/cdd/carMonitor/startMonitor.json',addParam)
  }
  /**
   * 修改监控-二手车
  */
  updateCarMonitor(addParam:any){
    return Http.post( '/cdd/carMonitor/updateMonitor.json',addParam)
  }
  /**
   * 结束监控-二手车
  */
  endCarMonitor(data:any){
    return Http.get( '/cdd/carMonitor/endCarMonitor.json',data)
  }
  /**
   * 监控列表-二手车
  */
  getMonitorCarList(data:any){
    return Http.get('/cdd/carMonitor/getCarMonitorList.json',data);
  }
  /**
   * 监控详情-二手车
  */
  monitorCarDetail(data:any){
    return Http.get('/cdd/carMonitor/getCarDetailById.json',data);
  }
  /**
   * 获取个人信息
  */
  userInfo(){
    return Http.get( '/cdd/user/userInfo.json');
  }
  /**
   * 获取盯盯币费率
  */
  getHourMoney() {
        return Http.get("/indexParam.json");
    }
}
