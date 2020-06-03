import * as fecha from '../utils/fecha';

const guaziFormatter = (data: IGuaZiResponseData): IFormatResult[] => {
  const result: IFormatResult[] = [];
  for (const p of data.postList) {
    const price = +p.price.replace('万', '') * 10000;
    const firstPay = +p.first_pay.replace('万', '') * 10000;
    const mileage = p.road_haul.includes('万公里')
      ? +p.road_haul.replace('万公里', '') * 10000
      : +(+p.road_haul.replace('公里', '') / 10000).toFixed(2);
    const licenseDateString =
      p.license_date.replace('年', '') + '-01-01 00:00:00';
    const licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss')!;
    const data: IFormatResult = {
      title: p.title,
      price,
      priceText: p.price,
      thumb: p.thumb_img,
      firstPay,
      firstPayText: p.first_pay,
      mileage,
      mileageText: p.road_haul,
      licensedDate,
      licensedText: p.license_date,
      tag: p.list_tags ? p.list_tags.map((item) => item.text) : [],
      source: p,
      platform: 'gz',
      carId: p.puid
    };

    result.push(data);
  }
  return result;
};

export default guaziFormatter;
