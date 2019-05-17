

export default class MeasureController {
  constructor({ repositories, logger, autoMapper }) {
    this.repos = repositories;
    this.logger = logger;
    this.autoMapper = autoMapper;
  }

  async getLastDay(req, res, next) {
    try {
      const options = getQueryOptions(req);

      const measures = await this.repos.apiRepository.getAllMeasures({ options });
      res.json({ measures });
    } catch (error) {
      next(error);
    }
  }

  async getLastMonth(req, res, next) {
    try {
      const options = getQueryOptions(req);

      const measures = await this.repos.apiRepository.getAllMeasures({ options });
      res.json({ measures });
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
