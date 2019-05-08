import { Router } from 'express';

import ActionsController from './actionsController';
import repositories from '../../repositories';
import { buildValidator } from '../users/validatorFactory';

import { autoMapper } from '../../helpers';

const router = Router();
const controller = new ActionsController(repositories, autoMapper);

const validator = buildValidator({ repos: repositories });

// routes

router.route('/login')
  .post((req, res, next) => controller.login(req, res, next));

router.route('/signUp')
  .post(validator.rules(), (req, res, next) => {
    const result = validator.validate(req);
    if (!result.isEmpty()) {
      return res.status(result.errorCode).json({ errors: result.errors() });
    }

    return controller.signUp(req, res, next);
  });

router.route('/seed')
  .put((req, res, next) => controller.seed(req, res, next));

export default router;
