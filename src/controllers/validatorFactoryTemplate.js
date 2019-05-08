
import { validationResult } from 'express-validator/check';
import _ from 'lodash';

export const buildTemplate = ({ rules }) => ({
  rules: () => rules,
  validate: (req) => {
    const errors = validationResult(req);

    return {
      errorCode: 422,
      isEmpty: () => errors.isEmpty(),
      errors: () => errors.array(),
    };
  },
});

export const buildTopicsTemplate = async ({ repos, topics }) => {
  const existingTopics = await Promise.all(topics.map(t => repos.topicRepository.getById(t)));

  if (existingTopics.filter(t => t === null).length > 0) {
    const unknownTopics = existingTopics
      .map((t, index) => {
        if (!t) {
          return topics[index];
        }
        return undefined;
      })
      .filter(t => !_.isUndefined(t));

    return Promise.reject(new Error(`The following topics are invalid: [ ${unknownTopics} ]`));
  }

  return Promise.resolve();
};
