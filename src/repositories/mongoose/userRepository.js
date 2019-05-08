import { User } from './models';

export default class UserRepository {
  static getAll() {
    return User.find({}).exec();
  }

  static getById(id) {
    return User.findById(id).exec();
  }

  static findByUsername(username) {
    return User.find({ username }).exec();
  }

  static async save(user) {
    const { id, ...rest } = user;

    if (id) {
      return User.findOneAndUpdate(
        { _id: id },
        { ...rest, lastUpdatedOn: Date.now() },
        { new: true },
      ).exec();
    }

    return new User({ ...rest, createdOn: Date.now(), lastUpdatedOn: Date.now() }).save();
  }

  static async deleteById(id) {
    return User.findOneAndRemove({ _id: id });
  }
}
