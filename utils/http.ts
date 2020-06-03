import { default_address } from './httpAddress.js'

interface IBaseResponse {
  code: number;
  data: IAnyObject | any[] | string | number | boolean;
  resultMsg: string;
  success: boolean;
}

const baseUrl = default_address;

const get = (url: string, data: IAnyObject = {}): Promise<IBaseResponse> => {
  return request(url, 'GET', data);
};

const post = (
  url: string,
  data: IAnyObject = {},
  header?: IAnyObject
): Promise<IBaseResponse> => {
  return request(url, 'POST', data, header);
};

const del = (
  url: string,
  data: IAnyObject = {},
  header?: IAnyObject
): Promise<IBaseResponse> => {
  return request(url, 'DELETE', data, header);
};
const put = (
  url: string,
  data: IAnyObject = {},
  header?: IAnyObject
): Promise<IBaseResponse> => {
  return request(url, 'PUT', data, header);
};

const request = (
  url: string,
  method: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data: IAnyObject = {},
  header: IAnyObject = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
): Promise<IBaseResponse> => {
  const token = wx.getStorageSync('token');
  if (url.startsWith('/')) {
    url = `${baseUrl}${url}`;
    data = Object.assign(
      {
        token
      },
      data
    );
  }
  const requestData: IAnyObject = {};
  if (data) {
    Object.keys(data)
      .filter(
        (key) =>
          typeof data![key] !== 'undefined' &&
          data![key] !== null &&
          data![key] !== 'undefined'
      )
      .forEach((key) => (requestData[key] = data![key]));
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header,
      data: requestData,
      success(resp) {
        if (resp.statusCode !== 200) {
          return reject({
            code: resp.statusCode,
            message: '接口请求失败'
          });
        }
        const data = resp.data as IBaseResponse;
        if (typeof data.code === 'number') {
          if (data.code !== 200) {
            return reject({
              code: data.code,
              message: data.resultMsg,
              data: data.data
            });
          }
        }
        resolve(data);
      },
      fail() {
        reject({
          message: '你的网络可能开小差了~'
        });
      }
    });
  });
};

const Http = {
  get,
  post,
  del,
  put,
  request
};

export default Http;
