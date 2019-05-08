
import _ from 'lodash';

import { Post } from './models';

export default class PostRepository {
  static async getAll({ query = {}, options } = {}) {
    const baseQuery = Post.find(query)
      .populate({
        path: 'author',
      })
      .populate({
        path: 'topics',
      })
      .populate({
        path: 'comments',
        populate: ({
          path: 'author',
        }),
      });

    if (options) {
      const { sortBy, skip, limit } = options;

      baseQuery
        .limit(limit)
        .skip(skip)
        .sort({
          [sortBy.key]: sortBy.value,
        });
    }

    const documentPromise = baseQuery.exec();
    const countPromise = Post.countDocuments({});

    const [posts, count] = await Promise.all([documentPromise, countPromise]);
    return { posts, count };
  }

  static async getById(id) {
    const query = { _id: id };

    const { posts } = await PostRepository.getAll({ query });
    return _.first(posts);
  }

  static async save(post) {
    const { id, ...rest } = post;
    let postId = id;

    if (id) {
      await Post.findOneAndUpdate(
        { _id: id },
        {
          ...rest,
          lastUpdatedOn: Date.now(),
        },
        { new: true },
      );
    } else {
      const newPost = await new Post({
        ...rest,
        createdOn: Date.now(),
        lastUpdatedOn: Date.now(),
      }).save();

      postId = newPost._id;
    }

    return PostRepository.getById(postId);
  }

  static async deleteById(id) {
    return Post.findOneAndRemove({ _id: id });
  }
}
