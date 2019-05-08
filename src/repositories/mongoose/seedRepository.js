// import _ from 'lodash';
// import mongoose from 'mongoose';

import {
  Post,
  Topic,
  User,
  Comment,
  Device,
  Session,
  Measure,
  Sensor,
} from './models';

import data from './seed/data';
import sensors from './seed/sensors';

import { logger } from '../../helpers';

export default class SeedRepository {
  static async populate() {
    try {
      await SeedRepository.cleanDB();
      // const topics = await createTopics();
      // const users = await createUsers(topics);
      // await createPosts(topics, users);

      await createSensors();
      await createMeasures();
    } catch (error) {
      logger.error(error);
    }
  }

  static cleanDB() {
    const tables = [Post, Topic, User, Comment, Device, Session, Measure, Sensor];
    const promises = tables.map(model => model.deleteMany().exec());
    return Promise.all(promises);
  }
}

/**
 * Create sensors.
 */
async function createSensors() {
  try {
    await Sensor.insertMany(sensors);
  } catch (ex) {
    console.error(ex);
  }
}

/**
 * Create measures.
 */
async function createMeasures() {
  try {
    await Measure.insertMany(data);
  } catch (ex) {
    console.error(ex);
  }
}

// /**
//  * Create posts.
//  *
//  * @param {*} topics
//  * @param {*} authors
//  * @returns
//  */
// async function createPosts(topics, authors) {
//   const images = [];

//   const posts = [];
//   authors.forEach((author, index) => {
//     const { id } = (index % 2 === 0) ? _.first(blueprints.posts) : _.last(blueprints.posts);

//     posts.push({
//       _id: mongoose.Types.ObjectId(id),
//       title: `title ${index}`,
//       description: `${_.repeat('description', 3)} ${index}`,
//       location: 'Cluj-Napoca',
//       images,
//       topics: _.take(topics, 2).map(t => t._id),
//       author: author._id,
//       createdOn: Date.now(),
//       lastUpdatedOn: Date.now(),
//     });
//   });
//   const promises = posts.map(p => new Post(p).save());
//   return Promise.all(promises);
// }

// /**
//  * Create topics.
//  *
//  * @returns
//  */
// async function createTopics() {
//   const promises = blueprints.topics.map(({ id, name, description }, index) => new Topic({
//     _id: mongoose.Types.ObjectId(id),
//     name,
//     description,
//     createdOn: Date.now(),
//     lastUpdatedOn: Date.now(),
//     order: index + 1,
//   }).save());

//   return Promise.all(promises);
// }

// /**
//  * Create users.
//  *
//  * @returns
//  */
// async function createUsers(topics) {
//   let firstProfilePicture;
//   let lastProfilePicture;

//   const firstUser = _.first(blueprints.users);
//   const lastUser = _.last(blueprints.users);

//   const users = [{
//     _id: mongoose.Types.ObjectId(firstUser.id),
//     ..._.omit(firstUser, ['id']),
//     profilePicture: firstProfilePicture,
//     subscribedTopics: [_.first(topics)],
//     favoritePosts: [],
//   }, {
//     _id: mongoose.Types.ObjectId(lastUser.id),
//     ..._.omit(lastUser, ['id']),
//     profilePicture: lastProfilePicture,
//     subscribedTopics: [_.last(topics)],
//     favoritePosts: [],
//   }];

//   if (firstProfilePicture) {
//     _.first(users).profilePicture = firstProfilePicture;
//   }

//   if (lastProfilePicture) {
//     _.last(users).profilePicture = lastProfilePicture;
//   }

//   const promises = users.map(user => new User({
//     ...user,
//     createdOn: Date.now(),
//     lastUpdatedOn: Date.now(),
//   }).save());

//   return Promise.all(promises);
// }
