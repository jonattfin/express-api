
import mongoose from 'mongoose';

import config from '../../configuration';
import { logger } from '../../helpers';

function connect() {
  const url = config.get('mongo:url');
  logger.info(`Mongo url is: '${url}'.`);

  mongoose.connect(url, { useNewUrlParser: true });
}

export default { connect };
