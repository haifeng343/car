import Http from '../../utils/http';
import { Subscription } from '../../rx/rx';

export default class UsedCarService {
  serchDataSubscription?: Subscription;
  //监控详情
  getCarDetail(id: number) {
    return Http.get('/cdd/carMonitor/getCarDetailById.json', { monitorId: id });
  }
  //屏蔽车源
  batchAddBlack(Param: any) {
    return Http.request(
      '/cdd/carMonitor/batchAddBlacklist.json',
      'POST',
      Param
    );
  }
  //结束监控
  endMonitor(id: number) {
    return Http.get('/cdd/carMonitor/endCarMonitor.json', { monitorId: id });
  }
  //修改监控
  updateMonitor(updateParam: any) {
    return Http.request(
      '/cdd/carMonitor/updateMonitor.json',
      'POST',
      updateParam
    );
  }
}
