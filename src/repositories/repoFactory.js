import { logger } from '../helpers';

import {
  PostRepository,
  TopicRepository,
  UserRepository,
  SeedRepository,
  MeasureRepository,
} from './mongoose';

class RepoFactory {
  static getRepositories(type) {
    logger.info(`Factory is using ${type} strategy.`);

    if (type === 'mongoose') {
      return {
        postRepository: PostRepository,
        userRepository: UserRepository,
        topicRepository: TopicRepository,
        seedRepository: SeedRepository,
        measureRepository: MeasureRepository,
      };
    }

    throw new Error(`Type ${type} is not supported!`);
  }
}

export default RepoFactory;
