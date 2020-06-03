import Http from '../../utils/http';
import { IBrandPinYin, IBrandData, ISeriesData } from './data';

interface IBrandListResponese {
  brandName: string;
  createTime: string;
  icon: string;
  id: number;
  json: string;
  brandpy: string;
}

interface IHotBrandResponse {
  id: number;
  brandName: string;
  json: string;
  icon: string;
}

interface ISeriesResponse {
  createTime: string;
  id: number;
  json: string;
  pid: number;
  seriesName: string;
}

export default class BrandSelectService {
  getBrandList(): Promise<IBrandPinYin[]> {
    return Http.get('/brandList.json')
      .then((resp) =>
        Promise.resolve(
          ((resp.data || []) as IBrandListResponese[]).map((item) => {
            if (!item.brandpy) {
              item.brandpy = item.brandName[0].toLocaleUpperCase();
            } else {
              item.brandpy = item.brandpy[0].toLocaleUpperCase();
            }
            return item;
          })
        )
      )
      .then((resp) => {
        const map = new Map<string, IBrandPinYin>();
        for (const b of resp) {
          const data = JSON.parse(b.json) as IAnyObject;
          const { brandpy, id, brandName, icon } = b;
          if (!map.has(brandpy)) {
            map.set(brandpy, {
              pinyin: brandpy,
              brandList: []
            });
          }
          const value: IBrandId = {
            icon,
            id
          };

          if (data.gz) {
            value.gz = {
              value: data.gz.value
            };
          }
          if (data.rr) {
            value.rr = {
              name: data.rr.name
            };
          }
          if (data.yx) {
            value.yx = {
              brandid: data.yx.brandid
            };
          }
          map.get(brandpy)!.brandList.push({
            id,
            name: brandName,
            icon,
            value
          });
        }
        return Array.from(map.values());
      });
  }

  getHotBrand(): Promise<IBrandData[]> {
    return Http.get('/indexParam.json')
      .then((resp) =>
        Promise.resolve(
          (resp.data as IAnyObject).cddUsedBardHot as IHotBrandResponse[]
        )
      )
      .then((resp) => {
        return resp.map((item) => {
          const { id, brandName, json, icon } = item;
          const data = JSON.parse(json) as IAnyObject;

          const value: IBrandId = {
            icon,
            id
          };

          if (data.gz) {
            value.gz = {
              value: data.gz.value
            };
          }
          if (data.rr) {
            value.rr = {
              name: data.rr.name
            };
          }
          if (data.yx) {
            value.yx = {
              brandid: data.yx.brandid
            };
          }
          return {
            id,
            name: brandName,
            icon,
            value
          };
        });
      });
  }

  getSeriesListByBrandId(id: number): Promise<ISeriesData[]> {
    return Http.get('/seriesList.json', { id })
      .then((resp) => Promise.resolve((resp.data || []) as ISeriesResponse[]))
      .then((resp) =>
        Promise.resolve(
          resp.filter(
            (item) =>
              item.json.includes('"rr"') ||
              item.json.includes('"gz"') ||
              item.json.includes('"yx"')
          )
        )
      )
      .then((resp) => {
        resp.unshift({
          seriesName: '不限车系',
          json: '',
          createTime: '',
          id: 0,
          pid: 0
        });
        return resp.map((item) => {
          const { seriesName, json, id } = item;
          const data = (json ? JSON.parse(json) : {}) as IAnyObject;

          const value: ISeriesID = { id };

          if (data.gz) {
            value.gz = {
              value: data.gz.value
            };
          }
          if (data.rr) {
            value.rr = {
              name: data.rr.name
            };
          }
          if (data.yx) {
            value.yx = {
              serieid: data.yx.serieid
            };
          }
          return {
            id,
            name: seriesName,
            seriesName: seriesName === '不限车系' ? '' : seriesName,
            value
          };
        });
      });
  }
}
