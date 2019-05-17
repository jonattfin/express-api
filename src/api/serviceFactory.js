import axios from 'axios';

const setConfig = (config = {}) => {
  const enhancedConfig = config;

  const cfg = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...enhancedConfig,
  };


  return cfg;
};

class RestHelper {
  constructor(instance) {
    this.instance = instance;
  }

  async get(url, config = {}) {
    const response = await this.instance.get(url, setConfig(config));
    return response.data;
  }

  //   async put(url, params, config = {}) {
  //     await this.instance.put(url, params, setConfig(config));
  //   }

  //   async post(url, params, config = {}) {
  //     await this.instance.post(url, params, setConfig(config));
  //   }

  //   async patch(url, params, config = {}) {
  //     await this.instance.patch(url, params, setConfig(config));
  //   }

  //   async delete(url, params, config = {}) {
  //     await this.instance.delete(url, params, setConfig(config));
  //   }
}

function getInstance(type) {
  let { url, headers = {} } = {};

  switch (type) {
    case 'urad': {
      url = 'https://data.uradmonitor.com/api/v1/';
      headers = {
        'X-User-id': 'www',
        'X-User-hash': 'global',
        Origin: 'https://www.uradmonitor.com',
      };
      break;
    }
    case 'pulse': {
      url = 'https://cluj-napoca.pulse.eco/rest';
      break;
    }
    default:
      throw new Error(`The instance of type ${type} is not supported!`);
  }

  return axios.create({
    baseURL: url,
    timeout: 5 * 1000,
    headers,
  });
}

export const UradService = new RestHelper(getInstance('urad'));
export const PulseService = new RestHelper(getInstance('pulse'));
