
export default class TopicController {
  constructor({ repository, autoMapper }) {
    this.repository = repository;
    this.autoMapper = autoMapper;
  }

  async getAll(req, res, next) {
    try {
      const result = await this.repository.getAll();
      res.json({ topics: result.map(this.autoMapper.mapTopic) });
    } catch (error) {
      next(error);
    }
  }

  async insert(req, res, next) {
    try {
      const topic = req.body;

      const result = await this.repository.save(topic);
      res.status(201).json({ topic: this.autoMapper.mapTopic(result) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await this.repository.getById(id);
      res.json({ topic: this.autoMapper.mapTopic(result) });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req, res, next) {
    try {
      const { params, body } = req;
      const topic = { ...params, ...body };

      const result = await this.repository.save(topic);
      res.json({ topic: this.autoMapper.mapTopic(result) });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;

      const result = this.repository.deleteById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
