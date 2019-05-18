import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
import yamljs from 'yamljs';
import passport from 'passport';

import {
  userRouter,
  actionsRouter,
  measureRouter,
} from './src/controllers';

const router = Router();

if (process.env.NODE_ENV !== 'test') {
  // setup the swagger documentation
  router.use('/explorer', serve, setup(yamljs.load('./swagger.yaml')));
}

const endpointsWithHandlers = [
  { endpoint: 'user', handler: userRouter },
  { endpoint: 'actions', handler: actionsRouter },
  { endpoint: 'measures', handler: measureRouter },
];

endpointsWithHandlers.forEach(({ endpoint, handler }) => {
  if (!['actions', 'measures'].includes(endpoint)) {
    router.use(`/${endpoint}`, passport.authenticate('jwt', { session: false }), handler);
  } else {
    router.use(`/${endpoint}`, handler);
  }
});

export default router;
