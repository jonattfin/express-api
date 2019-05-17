import api from '../api';

export default class ApiRepository {
  static getLastDay() {
    return api.getLastDay();
  }

  static getLastWeek() {
    return api.getLastWeek();
  }

  static getLastMonth() {
    return api.getLastMonth();
  }
}
