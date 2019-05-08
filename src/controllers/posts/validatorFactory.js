
import { check, body } from 'express-validator/check';

import { buildTemplate, buildTopicsTemplate } from '../validatorFactoryTemplate';

export const buildValidator = ({ repos }) => buildTemplate({ rules: getRules(repos) });

function getRules(repos) {
  return [
    check('title', 'must be at least 5 chars long')
      .isLength({ min: 5 }),
    check('description', 'must be at least 10 chars long')
      .isLength({ min: 10 }),
    body('topics')
      .custom(topics => buildTopicsTemplate({ repos, topics })),
  ];
}
