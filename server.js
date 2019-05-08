import { logger } from './src/helpers';
import app from './app';

const port = process.env.PORT || 8080;
const host = process.env.host || '0.0.0.0';

// start the server
app.listen(port, host, () => logger.info(`Server is running on port ${port}.`));
