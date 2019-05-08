import { Router } from 'express';

import TopicController from './topicController';
import repositories from '../../repositories';
import { buildValidator } from './validatorFactory';

import { autoMapper } from '../../helpers';

const router = Router();
const controller = new TopicController({
  repository: repositories.topicRepository,
  autoMapper,
});

const validator = buildValidator();

// routes

router.route('/')
  .get((req, res, next) => controller.getAll(req, res, next))
  .post(validator.rules(), (req, res, next) => {
    const result = validator.validate(req);
    if (!result.isEmpty()) {
      return res.status(result.errorCode).json({ errors: result.errors() });
    }

    return controller.insert(req, res, next);
  });

router.route('/:id')
  .get((req, res, next) => controller.getById(req, res, next))
  .put((req, res, next) => controller.updateById(req, res, next))
  .delete((req, res, next) => controller.deleteById(req, res, next));

export default router;
