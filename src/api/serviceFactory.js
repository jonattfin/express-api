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
  constructor(instance, extraConfig = {}) {
    this.instance = instance;
    this.extraConfig = extraConfig;
  }

  async get(url, config = {}) {
    try {
      const response = await this.instance.get(url, setConfig({ ...config, ...this.extraConfig }));
      return response.data;
    } catch (ex) {
      return [];
    }
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
  let { url } = {};
  const headers = {};

  switch (type) {
    case 'pulse-cj': {
      url = 'https://cluj-napoca.pulse.eco/rest';
      break;
    }
    case 'pulse-bv': {
      url = 'https://brasov.pulse.eco/rest';
      break;
    }
    case 'pulse-tg-mures': {
      url = 'https://targumures.pulse.eco/rest';
      break;
    }
    case 'pulse-codlea': {
      url = 'https://codlea.pulse.eco/rest';
      break;
    }
    default:
      throw new Error(`The instance of type ${type} is not supported!`);
  }

  return axios.create({
    baseURL: url,
    // timeout: 30 * 1000,
    headers,
  });
}

const extraConfig = {
  auth: {
    username: process.env.PULSE_USER,
    password: process.env.PULSE_PWD,
  },
};

export const CJPulseService = new RestHelper(getInstance('pulse-cj'), extraConfig);
export const BVPulseService = new RestHelper(getInstance('pulse-bv'), extraConfig);
export const MRPulseService = new RestHelper(getInstance('pulse-tg-mures'), extraConfig);
export const CDPulseService = new RestHelper(getInstance('pulse-codlea'), extraConfig);
