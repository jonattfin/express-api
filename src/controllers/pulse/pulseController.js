

export default class MeasureController {
  constructor({ repositories, logger, autoMapper }) {
    this.repos = repositories;
    this.logger = logger;
    this.autoMapper = autoMapper;
  }

  async getAllMeasures(req, res, next) {
    try {
      const options = getQueryOptions(req);

      const measures = await this.repos.measureRepository.getAllMeasures({ options });
      res.json({ measures });
    } catch (error) {
      next(error);
    }
  }

  async getAllSensors(req, res, next) {
    try {
      const sensors = await this.repos.measureRepository.getAllSensors();
      res.json({ sensors });
    } catch (error) {
      next(error);
    }
  }
}

function getQueryOptions(req) {
  const {
    limit = 1000,
    skip = 0,
  } = req.query || {};

  const sortBy = { key: 'stamp', value: 'desc' };

  return {
    limit: tryParse(limit), skip: tryParse(skip), sortBy,
  };
}

function tryParse(s) {
  let i;

  try {
    i = parseInt(s, 10);
  } catch (error) {
    // ignore
  }

  return i;
}
