import * as fecha from '../utils/fecha';

const renrenFormatter = (data: IRenRenResponseData): IFormatResult[] => {
  const result: IFormatResult[] = [];
  for (const p of data.docs) {
    const price = p.price * 10000;
    const firstPay = p.down_payment * 10000;
    const mileage = p.mileage * 10000;
    const licenseDateString = p.licensed_date.substr(0, 10) + ' 00:00:00';
    const licensedDate = fecha.parse(licenseDateString, 'YYYY-MM-DD HH:mm:ss')!;
    const data: IFormatResult = {
      title: p.title,
      price,
      priceText: p.price + '万',
      thumb: p.search_image_url[0],
      firstPay,
      firstPayText: p.down_payment + '万',
      mileage,
      mileageText: p.mileage + '万公里',
      licensedDate,
      licensedText: p.licensed_date.substr(0, 4) + '年',
      tag: p.tags.map((item) => item.txt),
      source: p,
      platform: 'rr',
      carId:p.id
    };

    result.push(data);
  }
  return result;
};

export default renrenFormatter;
