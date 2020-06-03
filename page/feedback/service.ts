import Http from '../../utils/http';

export default class FeedBackServie {
  submitFeedBack(suggestion: string) {
    return Http.get('/cdd/user/addSuggestion.json', { suggestion });
  }
}
