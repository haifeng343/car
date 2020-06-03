export interface IBrandPinYin {
  pinyin: string;
  brandList: IBrandData[];
}

export interface IBrandData {
  id: number;
  name: string;
  icon: string;
  value: IBrandId;
}

export interface ISeriesData {
  id: number;
  seriesName: string;
  name: string;
  value: IAnyObject;
}

export default class BrandPageData {
  isLoaded = false;

  hotList: IBrandData[] = [];

  brandList: IBrandPinYin[] = [];

  showSeries: boolean = false;

  currentBrand: IBrandData | null = null;

  currentSeries: ISeriesData | null = null;

  seriesList: ISeriesData[] = [];

  indexList: { label: string; value: string }[] = [];

  currentView: string = '';

  currentSeriesView: string = '';
}
