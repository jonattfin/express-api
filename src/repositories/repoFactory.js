// import { logger } from '../helpers';

import {
  UserRepository,
  SeedRepository,
} from './mongoose';

import ApiRepository from './apiRepository';

class RepoFactory {
  static getRepositories(type) {
    // logger.info(`Factory is using ${type} strategy.`);

    if (type === 'mongoose') {
      return {
        userRepository: UserRepository,
        seedRepository: SeedRepository,
        apiRepository: ApiRepository,
      };
    }

    throw new Error(`Type ${type} is not supported!`);
  }
}

export default RepoFactory;
