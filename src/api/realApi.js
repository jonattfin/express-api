import _ from 'lodash';
import moment from 'moment';

import { CJPulseService, BVPulseService } from './serviceFactory';
// import allowedCities from './alowedCities';

// import { UradDataDay } from './data';
import { transformPulseData } from './transformers';

export default class RealApi {
  static async getLastDay() {
    const data = await Promise.all([
      BVPulseService.get('data24h'),
      CJPulseService.get('data24h'),
    ]);

    const transformers = getTransformers();
    return applyTransformations({ transformers, data });
  }

  static async getLastWeek() {
    const numberOfDays = 7;

    // pulse
    const brasovData = await getPulseData(numberOfDays);
    const clujData = await getPulseData(numberOfDays);

    // urad
    // const isCorrect = ({ status, city, timelast }) => status !== null && timelast !== null && allowedCities.includes(city);
    // const filteredUradSensors = UradDataDay.filter(isCorrect);

    // const uradUrls = filteredUradSensors.map(({ id }) => buildUradUrl(id, numberOfDays));
    // const uradData = await Promise.all(uradUrls.map(([url]) => UradService.get(url)));

    // const results = transformUradDetailsData(filteredUradSensors, uradData);
    const transformers = getTransformers();
    return _.concat([], applyTransformations({
      transformers,
      data: [_.concat(...brasovData), _.concat(...clujData)],
    }));
  }

  static async getLastMonth() {
    const data = [[], []];
    return applyTransformations({ data });
  }
}

function getTransformers() {
  return [
    { transformer: transformPulseData, city: 'Brasov' },
    { transformer: transformPulseData, city: 'Cluj-Napoca' },
  ];
}

async function getPulseData(numberOfDays) {
  const services = [BVPulseService, CJPulseService];

  const results = [];
  for (let index = 0; index < services.length; index += 1) {
    const service = services[index];

    // eslint-disable-next-line no-await-in-loop
    const sensors = await service.get('sensor');
    const urls = sensors.filter(s => s.status === 'active'.toUpperCase()).map(({ sensorId }) => buildUrl(sensorId, numberOfDays));

    // eslint-disable-next-line no-await-in-loop
    const pulseData = await Promise.all(urls.map(url => service.get(url)));
    results.push(pulseData);
  }
  return results;
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
