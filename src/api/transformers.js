import moment from 'moment';
import _ from 'lodash';

const DATE_FORMAT = 'YYYY-MM-DD';
const TYPES = ['pm10', 'pm25', 'temperature', 'humidity'];

export function transformUradData(data) {
  const results = data
    .filter(({ status, timelast, city }) => status !== null && timelast !== null && city === 'Cluj-Napoca')
    .filter(({ latitude, longitude }) => latitude !== null && longitude !== null)
    .map((item) => {
      const {
        // eslint-disable-next-line camelcase
        id, city, country, avg_pm10, avg_pm25, latitude, longitude, avg_temperature, avg_humidity, timelast,
      } = item;

      return {
        source: 'urad',
        city,
        country,
        day: moment.unix(timelast).format(DATE_FORMAT),
        sensorId: id,
        position: [latitude, longitude],
        pm10: _.parseInt(avg_pm10) || null,
        pm25: _.parseInt(avg_pm25) || null,
        temperature: _.parseInt(avg_temperature) || null,
        humidity: _.parseInt(avg_humidity) || null,
      };
    });
  return results;
}

export function transformPulseData(data) {
  const groupedByDay = _.groupBy(data, item => moment(item.stamp).format(DATE_FORMAT));

  const results = [];
  _.forEach(groupedByDay, (dayValues, day) => {
    const groupedBySensorId = _.groupBy(dayValues, item => item.sensorId);

    _.forEach(groupedBySensorId, (sensorValues, sensorId) => {
      const { position } = _.first(sensorValues);

      if (sensorValues.length === 0 || !position) {
        return;
      }

      const obj = {};
      TYPES.forEach((type) => {
        const values = sensorValues
          .filter(item => item.type === type)
          .map(item => _.toNumber(item.value));

        obj[type] = Math.trunc(values.reduce((prev, current) => prev + current, 0) / values.length) || null;
      });

      results.push({
        source: 'pulse',
        city: 'Cluj-Napoca', // TODO
        country: 'Romania',
        day,
        sensorId,
        position: _.split(position, ','),
        ...obj,
      });
    });
  });

  return results;
}

export function transformCustomUradData(sensors, data) {
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
        day: moment.unix(time).format(DATE_FORMAT),
        position: [latitude, longitude],
        ...obj,
      });
    });
  }

  return results;
}
