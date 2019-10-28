import _ from 'lodash';
import moment from 'moment';

import {
  CJPulseService,
  BVPulseService,
  CDPulseService,
  MRPulseService,
} from './serviceFactory';
// import allowedCities from './alowedCities';

// import { UradDataDay } from './data';
import { transformPulseData } from './transformers';

export default class RealApi {
  static async getLastDay() {
    const data = await Promise.all([
      BVPulseService.get('data24h'),
      CJPulseService.get('data24h'),
      CDPulseService.get('data24h'),
      MRPulseService.get('data24h'),
    ]);

    const transformers = getTransformers();
    return applyTransformations({ transformers, data });
  }

  static async getLastWeek() {
    const numberOfDays = 7;

    // pulse
    const data = await Promise.all([
      getPulseData(numberOfDays, BVPulseService),
      getPulseData(numberOfDays, CJPulseService),
      getPulseData(numberOfDays, CDPulseService),
      getPulseData(numberOfDays, MRPulseService),
    ]);

    // urad
    // const isCorrect = ({ status, city, timelast }) => status !== null && timelast !== null && allowedCities.includes(city);
    // const filteredUradSensors = UradDataDay.filter(isCorrect);

    // const uradUrls = filteredUradSensors.map(({ id }) => buildUradUrl(id, numberOfDays));
    // const uradData = await Promise.all(uradUrls.map(([url]) => UradService.get(url)));

    // const results = transformUradDetailsData(filteredUradSensors, uradData);
    const transformers = getTransformers();
    return _.concat([], applyTransformations({
      transformers,
      data: [_.concat(...data[0]), _.concat(...data[1]), _.concat(...data[2])],
    }));
  }

  static async getLastMonth() {
    const transformers = getTransformers();
    const data = [[], [], []];
    return applyTransformations({ transformers, data });
  }

  static async getSensors() {
    const data = await Promise.all([
      BVPulseService.get('sensor'),
      CJPulseService.get('sensor'),
      CDPulseService.get('sensor'),
      MRPulseService.get('sensor'),
    ]);

    return data;
  }
}

function getTransformers() {
  const transformer = transformPulseData;

  return [
    { transformer, city: 'Brasov' },
    { transformer, city: 'Cluj-Napoca' },
    { transformer, city: 'Codlea' },
    { transformer, city: 'Targu-Mures' },
  ];
}

async function getPulseData(numberOfDays, service) {
  const sensors = await service.get('sensor');
  const urls = sensors.map(({ sensorId }) => buildUrl(sensorId, numberOfDays));

  return Promise.all(urls.map(url => service.get(url)));
}

// function buildUradUrl(sensorId, numberOfDays) {
//   const fromDateTime = (moment() - moment().subtract(numberOfDays, 'day')) / 1000;
//   return [`devices/${sensorId}/all/${fromDateTime}`];
// }

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
      const { transformer, city } = transformers[index];

      const newData = transformer(element).map(item => ({ ...item, city }));
      results.push(...newData);
    }
  }
  return results;
}
