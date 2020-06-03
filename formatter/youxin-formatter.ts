import * as fecha from '../utils/fecha';

const youxinFormatter = (data: IYouXinResponseData): IFormatResult[] => {
  const result: IFormatResult[] = [];
  for (const p of data.list) {
    const price = +p.price.replace('万', '') * 10000;
    const firstPay =
      +p.shoufu_price.replace('首付', '').replace('万', '') * 10000;
    const mileage = +p.mileage.replace('万', '') * 10000;
    const licenseDateString = p.carnotime + ' 00:00:00';
    const licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss')!;
    const data: IFormatResult = {
      title: p.carserie + p.carname,
      price,
      priceText: p.price,
      thumb: p.carimg,
      firstPay,
      firstPayText: firstPay ===0 ?'0万':p.shoufu_price.replace('首付', ''),
      mileage,
      mileageText: p.mileage + '公里',
      licensedDate,
      licensedText: p.carnotime.substr(0, 4) + '年',
      tag: p.tags_sort.map((item) => item.name),
      source: p,
      platform: 'yx',
      carId:p.carid
    };

    result.push(data);
  }
  return result;
};

export default youxinFormatter;
