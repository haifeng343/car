import Http from '../../utils/http';

export default class BindPhoneService {
  getCode(mobile: string) {
    return Http.get('/cdd/user/validate/code.json', {
      validateType: 'bind_Mobile',
      mobile
    });
  }

  bindMoblie(mobile: string, code: string) {
    return Http.post('/cdd/user/bindMobile.json', { mobile, code });
  }
}
