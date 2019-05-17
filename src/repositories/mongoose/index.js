import database from './database';

database.connect();

export { default as PostRepository } from './postRepository';
export { default as TopicRepository } from './topicRepository';
export { default as UserRepository } from './userRepository';
export { default as SeedRepository } from './seedRepository';
