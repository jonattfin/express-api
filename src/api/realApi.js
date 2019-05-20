import _ from 'lodash';
import moment from 'moment';

import { UradService, PulseService } from './serviceFactory';

import { UradDataDay } from './data';
import { transformUradData, transformPulseData, transformCustomUradData } from './transformers';

export default class RealApi {
  static async getLastDay() {
    const data = await Promise.all([
      UradService.get('devices'),
      PulseService.get('data24h'),
    ]);

    const transformers = [transformUradData, transformPulseData];
    return applyTransformations({ transformers, data });
  }

  static async getLastWeek() {
    const numberOfDays = 2;

    // pulse
    const sensors = await PulseService.get('sensor');
    const urls = sensors.filter(s => s.status === 'active'.toUpperCase()).map(({ sensorId }) => buildUrl(sensorId, numberOfDays));

    const pulseData = await Promise.all(urls.map(url => PulseService.get(url)));

    // urad
    const isCorrect = ({ status, city, timelast }) => status !== null && timelast !== null && city === 'Cluj-Napoca';
    const filteredUradSensors = UradDataDay.filter(isCorrect);

    const uradUrls = filteredUradSensors.map(({ id }) => buildUradUrl(id, numberOfDays));
    const uradData = await Promise.all(uradUrls.map(([url]) => UradService.get(url)));

    const results = transformCustomUradData(filteredUradSensors, uradData);
    return _.concat(results, applyTransformations({ transformers: [transformPulseData], data: [_.concat(...pulseData)] }));
  }

  static async getLastMonth() {
    const data = [[], []];
    return applyTransformations({ data });
  }
}

function buildUradUrl(sensorId, numberOfDays) {
  const fromDateTime = (moment() - moment().subtract(numberOfDays, 'day')) / 1000;
  return [`devices/${sensorId}/all/${fromDateTime}`];
}

function buildUrl(sensorId, numberOfDays) {
  const toFormat = (date) => {
    const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    return date.format(dateFormat).replace('+', '%2b');
  };

  const fromDateTime = toFormat(moment().subtract(numberOfDays, 'day'));
  const toDateTime = toFormat(moment());
  return `dataRaw?sensorId=${sensorId}&from=${fromDateTime}&to=${toDateTime}`;
}

function applyTransformations({ transformers = [], data = [] }) {
  const results = [];
  for (let index = 0; index < data.length; index += 1) {
    const element = data[index];
    if (element !== null) {
      results.push(...transformers[index](element));
    }
  }
  return results;
}
