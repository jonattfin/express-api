
export default class UserController {
  constructor({ repositories, logger, autoMapper }) {
    this.repos = repositories;
    this.logger = logger;
    this.autoMapper = autoMapper;
  }

  async getAll(req, res, next) {
    try {
      const result = await this.repos.userRepository.getAll();
      res.json({ users: result.map(this.autoMapper.mapUser) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await this.repos.userRepository.getById(id);
      res.json({ user: this.autoMapper.mapUser(result) });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req, res, next) {
    try {
      const { params, body } = req;
      const user = { ...params, ...body };

      const result = await this.repos.userRepository.save(user);
      res.json({ user: this.autoMapper.mapUser(result) });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;

      const result = this.repos.userRepository.deleteById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
