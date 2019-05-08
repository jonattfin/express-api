
import { check, body } from 'express-validator/check';

import { buildTemplate, buildTopicsTemplate } from '../validatorFactoryTemplate';

export const buildValidator = ({ repos }) => buildTemplate({ rules: getRules(repos) });

function getRules(repos) {
  return [
    check('username', 'must be at least 5 chars long')
      .isLength({ min: 5 }),
    check('firstName')
      .exists(),
    check('lastName')
      .exists(),
    check('email')
      .isEmail(),
    check('password', 'must be at least 5 chars long')
      .isLength({ min: 5 }),
    check('phone')
      .isMobilePhone(),
    body('subscribedTopics')
      .custom(topics => buildTopicsTemplate({ repos, topics })),
  ];
}
