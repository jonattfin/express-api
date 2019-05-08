
import { Topic } from './models';

export default class TopicRepository {
  static getAll() {
    return Topic.find({}).exec();
  }

  static getById(id) {
    return Topic.findById(id).exec();
  }

  static async save(topic) {
    const { id, ...rest } = topic;

    if (id) {
      return Topic.findOneAndUpdate(
        { _id: id },
        { ...rest, lastUpdatedOn: Date.now() },
        { new: true },
      );
    }

    return new Topic({ ...rest, createdOn: Date.now(), lastUpdatedOn: Date.now() }).save();
  }

  static async deleteById(id) {
    return Topic.findOneAndRemove({ _id: id });
  }
}
