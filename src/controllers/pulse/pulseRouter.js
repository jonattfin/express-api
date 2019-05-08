import { Router } from 'express';

import PulseController from './pulseController';
import repositories from '../../repositories';

import { logger, autoMapper } from '../../helpers';

const router = Router();
const controller = new PulseController({
  repositories,
  logger,
  autoMapper,
});

// routes

router.route('/measures')
  .get((req, res, next) => controller.getAllMeasures(req, res, next));

router.route('/sensors')
  .get((req, res, next) => controller.getAllSensors(req, res, next));

export default router;
