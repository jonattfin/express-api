import database from './database';

database.connect();

export { default as UserRepository } from './userRepository';
export { default as SeedRepository } from './seedRepository';
