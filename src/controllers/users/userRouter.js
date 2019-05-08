import { Router } from 'express';

import UserController from './userController';
import repositories from '../../repositories';

import { logger, autoMapper } from '../../helpers';

const router = Router();
const controller = new UserController({
  repositories,
  logger,
  autoMapper,
});

// routes

router.route('/')
  .get((req, res, next) => controller.getAll(req, res, next));

router.route('/:id')
  .get((req, res, next) => controller.getById(req, res, next))
  .put((req, res, next) => controller.updateById(req, res, next))
  .delete((req, res, next) => controller.deleteById(req, res, next));

export default router;
