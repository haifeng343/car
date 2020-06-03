import { Md5 } from './md5';
import Http from './http';

const key = 'DR3BZ-H4SLR-EICWG-WGVGO-37IC6-5DBUA';
const secret = 'yF1RvcDhPWJi63Zy3A1RfJPR4ClxbcXh';

interface IQQMapResponse {
  status: number;
  message: string;
  request_id: string;
  result: {
    location: {
      lat: number;
      lng: number;
    };
    address: string;
    formatted_addresses: {
      recommend: string;
      rough: string;
    };
    address_component: {
      nation: string;
      province: string;
      city: string;
      district: string;
      street: string;
      street_number: string;
    };
    ad_info: {
      nation_code: string;
      adcode: string;
      city_code: string;
      name: string;
      location: {
        lat: number;
        lng: number;
      };
      nation: string;
      province: string;
      city: string;
      district: string;
    };
    address_reference: {
      crossroad: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
      town: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
      street_number: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
      street: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
      landmark_l1: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
      landmark_l2: {
        id: string;
        title: string;
        location: {
          lat: number;
          lng: number;
        };
        _distance: number;
        _dir_desc: string;
      };
    };
  };
}

const getLocationInfo = (
  location: WechatMiniprogram.GetLocationSuccessCallbackResult
): Promise<IQQMapResponse> => {
  const { latitude, longitude } = location;
  const sig = Md5.hashStr(
    `/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}${secret}`
  );
  return Http.request(
    `https://apis.map.qq.com/ws/geocoder/v1/?key=${key}&location=${latitude},${longitude}&sig=${sig}`,
    'GET',
    {},
    {}
  ) as any;
};

export { getLocationInfo };
