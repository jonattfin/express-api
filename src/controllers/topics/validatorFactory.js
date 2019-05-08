
import { check } from 'express-validator/check';

import { buildTemplate } from '../validatorFactoryTemplate';

export const buildValidator = () => buildTemplate({ rules: getRules() });

function getRules() {
  return [
    check('name', 'must be at least 5 chars long')
      .isLength({ min: 5 }),
    check('description', 'must be at least 10 chars long')
      .isLength({ min: 10 }),
    check('order', 'must be an integer')
      .matches(/\d/),
  ];
}
