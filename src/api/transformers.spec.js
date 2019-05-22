import * as transformers from './transformers';
import {
  UradDataDay, UradDataDayTransformed,
  UradDataWeek, UradDataWeekTransformed, UradSensorsWeek,
  PulseDataDay, PulseDataDayTransformed,
  PulseDataWeek, PulseDataWeekTransformed,
} from './data';

describe('transformers', () => {
  it('transformUradData should show the correct output', () => {
    // A
    const data = UradDataDay;

    // A
    const actual = transformers.transformUradData(data);

    // A
    const expected = UradDataDayTransformed;
    expect(actual).toEqual(expected);
  });

  it('transformUradDetailsData should show the correct output', () => {
    // A
    const data = UradDataWeek.measures;
    const sensors = UradSensorsWeek.measures;

    // A
    const actual = transformers.transformUradDetailsData(sensors, data);

    // A
    const expected = UradDataWeekTransformed;
    expect(actual.map(item => item.sensorId)).toEqual(expected.map(item => item.sensorId));
  });

  describe('transformPulseData', () => {
    it('should show the correct data / day', () => {
      // A
      const data = PulseDataDay;

      // A
      const actual = transformers.transformPulseData(data);

      // A
      const expected = PulseDataDayTransformed;
      expect(actual).toEqual(expected);
    });

    it('should show the correct data / week', () => {
      // A
      const data = PulseDataWeek;

      // A
      const actual = transformers.transformPulseData(data);

      // A
      const expected = PulseDataWeekTransformed;
      expect(actual).toEqual(expected);
    });
  });
});
