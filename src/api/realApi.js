import { UradService, PulseService } from './serviceFactory';

import { transformUradData, transformPulseData } from './transformers';

export default class RealApi {
  static async fetchMeasures() {
    const data = await Promise.all([
      UradService.get('devices'),
      PulseService.get('data24h'),
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
