
import MockApi from './mockApi';
import RealApi from './realApi';

import configuration from '../configuration';

class Api {
  constructor(inner) {
    this.inner = inner;
  }

  getLastDay() {
    return this.inner.getLastDay();
  }

  getLastWeek() {
    return this.inner.getLastWeek();
  }

  getLastMonth() {
    return this.inner.getLastMonth();
  }
}

const inner = configuration.get('useMock') ? MockApi : RealApi;
export default new Api(inner);
