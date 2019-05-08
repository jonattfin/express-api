import express from 'express';

import { urlencoded, json } from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import cacheControl from 'express-cache-controller';

import morgan from 'morgan';
import { createWriteStream } from 'fs';
import { join } from 'path';

import router from './router';
import setupPassportStrategy from './src/helpers/authentication';

const app = express();

// configure app to use bodyParser -> this will let us get the data from a POST
app.use(urlencoded({ extended: true }));
app.use(json({ limit: '5mb' }));

// middleware
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
app.use(cacheControl({ private: true, noStore: true, mustRevalidate: true }));

setupPassportStrategy(passport);

// create a write stream (in append mode)
const accessLogStream = createWriteStream(join(__dirname, 'logs', 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan('dev', { stream: accessLogStream }));

// routers

app.get('/', (req, res) => {
  res.redirect('/api/v1/explorer');
});

app.use('/api/v1', router);

export default app;
