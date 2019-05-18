import { Router } from 'express';

import MeasuresController from './measuresController';
import repositories from '../../repositories';

import { logger, autoMapper } from '../../helpers';

const router = Router();
const controller = new MeasuresController({
  repositories,
  logger,
  autoMapper,
});

// routes

router.route('/last-day')
  .get((req, res, next) => controller.getLastDay(req, res, next));

router.route('/last-week')
  .get((req, res, next) => controller.getLastWeek(req, res, next));

router.route('/last-month')
  .get((req, res, next) => controller.getLastMonth(req, res, next));

export default router;
