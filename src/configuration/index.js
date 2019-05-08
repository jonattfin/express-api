const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line import/no-dynamic-require
const config = require(`./environments/${env.toLowerCase()}`);

class Configuration {
  constructor() {
    this.config = config;
  }

  get(key) {
    return this.config[key];
  }
}

export default new Configuration();
