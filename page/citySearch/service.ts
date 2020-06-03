import Http from '../../utils/http';

export default class SearchService {
  searchCity(cityNameParam:string = '') {
    return Http.get('/searchCity.json', { cityNameParam });
  }
}
