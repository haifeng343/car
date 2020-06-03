import Http from '../../utils/http';

//获取二手车监控历史
export default class MonitorHistroyService {
  getMonitorCarList() {
    return Http.get('/cdd/carMonitor/getCarHistoryList.json')
      .then((resp:any) => Promise.resolve(resp.data || []))
      .then(monitorList => {
        return monitorList.filter((value:any) => {
          monitorList.map(function (item:any) {
            item.title = `${item.cityName}(${item.locationName || '全城'})`;
            item.monitorDateText = item.startTime ? `监控时间:${(item.startTime).substr(
              0,
              10
            )}至${item.endTime.substr(0, 10)}` : '';
            return item;
          });
          if (value.startTime) {
            return true
          }
          return '';
        });
      }).catch(()=>{

      });
  }
  //删除二手车监控历史
  removeCarHistoryMonitor(id:number) {
    return Http.get('/cdd/carMonitor/deleteCarMonitor.json', { monitorId:id }).then(() =>
      this.getMonitorCarList()
    );
  }
}