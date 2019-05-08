
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
// import uuid from 'uuid/v4';

import { AuthSecret } from '../../helpers/authentication';

export default class ActionsController {
  constructor(repositories, autoMapper) {
    this.repos = repositories;
    this.autoMapper = autoMapper;
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const users = await this.repos.userRepository.findByUsername(username);

      if (users.length > 0) {
        const user = _.first(users);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          const authToken = jwt.sign({ id: user.id }, AuthSecret, { expiresIn: '1d' });
          res.json({ success: true, token: authToken });
        } else {
          res.status(401).send({ success: false, msg: 'Wrong username/password' });
        }
      } else {
        res.status(401).send({ success: false, msg: 'Wrong username/password' });
      }
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    try {
      const result = await this.repos.userRepository.save(req.body);
      res.status(201).json({ user: this.autoMapper.mapUser(result) });
    } catch (error) {
      next(error);
    }
  }

  async seed(req, res, next) {
    try {
      await this.repos.seedRepository.populate();
      res.status(201).json({});
    } catch (error) {
      next(error);
    }
  }
}
