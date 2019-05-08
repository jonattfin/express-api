
import { Measure, Sensor } from './models';

export default class MeasureRepository {
  static async getAllMeasures({ query = {}, options = {} } = {}) {
    const baseQuery = Measure.find(query);

    if (Object.keys(options).length > 0) {
      const { sortBy, skip, limit } = options;

      baseQuery
        .limit(limit)
        .skip(skip)
        .sort({
          [sortBy.key]: sortBy.value,
        });
    }

    return baseQuery.exec();
  }

  static async getAllSensors() {
    return Sensor.find();
  }
}
