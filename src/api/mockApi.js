
import { UradDataDay, PulseDataDay, PulseDataWeek } from './data';
import { withDelay } from './tools';
import { transformUradData, transformPulseData } from './transformers';

export default class MockApi {
  static async getLastDay() {
    const data = await Promise.all([
      withDelay(UradDataDay),
      withDelay(PulseDataDay),
    ]);

    return applyTransformations(data);
  }

  static async getLastWeek() {
    const data = [UradDataDay, PulseDataWeek];
    return applyTransformations(data);
  }

  static async getLastMonth() {
    const data = [[], []];
    return applyTransformations(data);
  }
}

function applyTransformations(data) {
  const transformers = [transformUradData, transformPulseData];

  const results = [];
  for (let index = 0; index < data.length; index += 1) {
    const element = data[index];
    results.push(...transformers[index](element));
  }
  return results;
}
