
import { UradData, PulseData } from './data';
import { withDelay } from './tools';
import { transformUradData, transformPulseData } from './transformers';

export default class MockApi {
  static async fetchMeasures() {
    const data = await Promise.all([
      withDelay(UradData),
      withDelay(PulseData),
    ]);

    const transformers = [transformUradData, transformPulseData];

    const results = [];
    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      results.push(...transformers[index](element));
    }
    return results;
  }
}
