
import MockApi from './mockApi';
import RealApi from './realApi';

class Api {
  constructor(inner) {
    this.inner = inner;
  }

  fetchMeasures() {
    return this.inner.fetchMeasures();
  }
}

const isMock = false;
const inner = isMock ? MockApi : RealApi;

export default new Api(inner);
