import Http from './http';

const loginUrl = '/cddLogin/appletLogin.json';

interface ILoginResponse {
  session_key: string;
  token?: string;
}

const doWechatLogin = (): Promise<ILoginResponse> => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (resp) =>
        resp.code ? resolve(resp.code) : reject(new Error('no code')),
      fail: (error) => reject(error)
    });
  })
    .then((code) => {
      return Http.post(loginUrl, { code })
        .then((resp) => Promise.resolve(resp.data as ILoginResponse))
        .then((data) => {
          wx.hideLoading();
          const sessionKey = data.session_key;
          wx.setStorageSync('sessionKey', sessionKey);
          return Promise.resolve(data);
        });
    })
    .catch((error: BasePromiseError) => {
      if (error.data && error.data.session_key) {
        const sessionKey = error.data.session_key;
        wx.setStorageSync('sessionKey', sessionKey);
      } else {
        wx.removeStorageSync('sessionKey');
      }

      return Promise.reject(error);
    });
};

const getSessionKey = (): Promise<string> => {
  return new Promise<string>((resolve) => {
    const sessionKey: string = wx.getStorageSync('sessionKey');
    if (sessionKey) {
      wx.checkSession({
        success: () => {
          console.log('sessionkey 有效');
          resolve(sessionKey);
        },
        fail: () => {
          console.log('sessionkey 无效');
          resolve();
        }
      });
    } else {
      resolve();
    }
  }).then((sessionKey) => {
    console.log(`sessionkey 有值 = ${!!sessionKey}`);
    if (!sessionKey) {
      return doWechatLogin().then((resp) => resp.session_key);
    }
    return Promise.resolve(sessionKey);
  });
};

const getLocation = (): Promise<IAnyObject> => {
  return new Promise<IAnyObject>((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: (resp) => resolve(resp),
      fail: () => reject()
    });
  });
};

const getLocationSetting = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        /**
         * false = 拒绝授权
         * undefined = 未确认
         * true = 同意授权
         */
        if (res.authSetting['scope.userLocation'] === false) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (dataAu) => {
                    if (dataAu.authSetting['scope.userLocation'] == true) {
                      resolve();
                    } else {
                      reject();
                    }
                  }
                });
              } else {
                reject();
              }
            }
          });
        } else {
          resolve();
        }
      }
    });
  });
};

export { doWechatLogin, getSessionKey, getLocationSetting, getLocation };
