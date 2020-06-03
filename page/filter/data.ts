import filterMap, { IFilterMap } from './map';

export interface FilterSearchData {
  autoType: number;

  gearbox: number;

  drive: number;

  minAge: number;

  maxAge: number;

  minMileage: number;

  maxMileage: number;

  minDisplacement: number;

  maxDisplacement: number;

  fuelType: number;

  emission: number;

  countryType: number;

  carColor: number;

  starConfig: number[];

  sortType: number;
}

export default class FilterPageData {
  map: IFilterMap[] = [];

  currentView = '';

  indexList: { label: string; value: string; active: boolean }[] = [];

  searchData: FilterSearchData = {
    autoType: 0,

    gearbox: 0,

    drive: 0,

    minAge: 0,

    maxAge: 6,

    minMileage: 0,

    maxMileage: 14,

    minDisplacement: 0,

    maxDisplacement: 4,

    fuelType: 0,

    emission: 0,

    countryType: 0,

    carColor: 0,

    starConfig: [],

    sortType: 0
  };

  data?: ISearchData;

  constructor() {
    this.map = JSON.parse(filterMap);
    this.indexList = this.map.map((item, index) => {
      return { label: item.title, value: item.id, active: index === 0 };
    });
  }
}
