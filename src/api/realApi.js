import _ from 'lodash';
import moment from 'moment';

import { UradService, PulseService } from './serviceFactory';

import { transformUradData, transformPulseData } from './transformers';

export default class RealApi {
  static async getLastDay() {
    const data = await Promise.all([
      UradService.get('devices'),
      PulseService.get('data24h'),
    ]);

    return applyTransformations(data);
  }

  static async getLastWeek() {
    const sensors = await PulseService.get('sensor');

    const urls = sensors.map(({ sensorId }) => buildUrl(sensorId));
    const data = await Promise.all(urls.map(url => PulseService.get(url)));

    return applyTransformations([[], _.concat(...data)]);
  }

  static async getLastMonth() {
    const data = [[], []];
    return applyTransformations(data);
  }
}

function buildUrl(sensorId) {
  const toFormat = (date) => {
    const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    return date.format(dateFormat).replace('+', '%2b');
  };

  const fromDateTime = toFormat(moment().day(-2));
  const toDateTime = toFormat(moment());
  return `dataRaw?sensorId=${sensorId}&from=${fromDateTime}&to=${toDateTime}`;
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
