import moment from 'moment';
import _ from 'lodash';

import allowedCities from './alowedCities';

// const DATE_FORMAT = 'YYYY-MM-DD';
const TYPES = ['pm10', 'pm25', 'temperature', 'humidity'];

export function transformUradData(data) {
  const mapped = data.filter(({ status }) => status !== null)
    .map(fromUradFormat);
  return calculateAverage(filterData(mapped));
}

export function transformPulseData(data) {
  const mapped = data.map(fromPulseFormat);
  return calculateAverage(filterData(mapped));
}

export function transformUradDetailsData(sensors, data) {
  const mapped = fromUradDetailsFormat(sensors, data);
  return calculateAverage(filterData(mapped));
}

function filterData(data) {
  return data.filter(({ city, country }) => allowedCities.includes(city) && country === 'RO');
}

function fromPulseFormat(item) {
  const {
    sensorId,
    stamp,
    position,
    type,
    value,
  } = item;

  return {
    source: 'pulse',
    city: 'Cluj-Napoca',
    country: 'RO',
    time: formatDate(moment(stamp)),
    sensorId,
    [type]: _.parseInt(value),
    position: _.split(position, ','),
  };
}

function fromUradFormat(item) {
  const {
    // eslint-disable-next-line camelcase
    id, city, country, timelast, latitude, longitude, avg_temperature, avg_humidity, avg_pm10, avg_pm25,
  } = item;

  return {
    source: 'urad',
    city,
    country,
    time: formatDate(moment.unix(timelast)),
    sensorId: id,
    position: [latitude, longitude],
    pm10: _.parseInt(avg_pm10) || null,
    pm25: _.parseInt(avg_pm25) || null,
    temperature: _.parseInt(avg_temperature) || null,
    humidity: _.parseInt(avg_humidity) || null,
  };
}

function fromUradDetailsFormat(sensors, data) {
  const results = [];

  for (let index = 0; index < sensors.length; index += 1) {
    const { id, city, country } = sensors[index];
    const sensorData = data[index];

    if (!Array.isArray(sensorData)) { // HACK
      break;
    }

    sensorData.forEach((item) => {
      const { time, latitude, longitude } = item;

      const obj = {};
      TYPES.forEach((type) => {
        obj[type] = _.parseInt(item[type]) || null;
      });

      results.push({
        source: 'urad',
        city,
        country,
        sensorId: id,
        time: formatDate(moment.unix(time)),
        position: [latitude, longitude],
        ...obj,
      });
    });
  }

  return results;
}

function formatDate(d) {
  return parseInt(moment(d).hour(), 10);
}

function calculateAverage(data) {
  const groupedByTime = _.groupBy(data, ({ time }) => time);

  const results = [];
  _.forEach(groupedByTime, (timeValues, time) => {
    const groupedBySensorId = _.groupBy(timeValues, ({ sensorId }) => sensorId);

    _.forEach(groupedBySensorId, (sensorValues, sensorId) => {
      const item = _.first(sensorValues);
      const {
        position, source, city, country,
      } = item;
      const [latitude, longitude] = position;

      if (sensorValues.length === 0 || !latitude || !longitude) {
        return;
      }

      const obj = {};
      TYPES.forEach((type) => {
        const values = sensorValues.filter(currentItem => currentItem[type] >= 0)
          .map(currentItem => currentItem[type]);

        if (values.length === 0) {
          return;
        }

        const sum = values.reduce((prev, current) => prev + current, 0);
        const avg = Math.trunc(sum / values.length);

        obj[type] = avg;
      });

      results.push({
        source,
        city,
        country,
        time,
        sensorId,
        position,
        ...obj,
      });
    });
  });

  return results;
}
