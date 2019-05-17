import api from '../api';

export default class ApiRepository {
  static getAllMeasures() {
    return api.fetchMeasures();
  }
}
