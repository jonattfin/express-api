const env = process.env.MONGO_ENV || 'localhost';
const port = process.env.MONGO_PORT || 27017;

module.exports = {
  'mongo:url': `mongodb://${env}:${port}/express-api_development`,
};
