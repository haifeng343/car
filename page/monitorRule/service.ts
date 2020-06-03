import Http from '../../utils/http';
export default class homeService {
    getHourMoney() {
        return Http.get("/indexParam.json");
    }
}