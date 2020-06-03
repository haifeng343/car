import Http from '../../utils/http';
import { Subscription } from '../../rx/rx';
export default class UsedCarService {
  serchDataSubscription?: Subscription;
  //个人信息
  userInfo() {
    return Http.get('/cdd/user/userInfo.json');
  }
  //配置信息
  indexParam() {
    return Http.get('/indexParam.json');
  }
  //添加监控
  addMonitor(addParam: any) {
    return Http.request('/cdd/carMonitor/addMonitor.json', 'POST', addParam);
  }
}
