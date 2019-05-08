
import { getDecodedToken } from '../../helpers';

export default class PostController {
  constructor({ repositories, logger, autoMapper }) {
    this.repos = repositories;
    this.logger = logger;
    this.autoMapper = autoMapper;
  }

  async getAll(req, res, next) {
    try {
      const token = getDecodedToken(req.headers);
      const options = getQueryOptions(req);

      const { posts, count } = await this.repos.postRepository.getAll({ options });
      const user = await this.repos.userRepository.getById(token.id);

      res.json({
        posts: posts.map(post => this.autoMapper.mapPost(post, user)),
        hasMore: hasNextPages({ count, options }),
      });
    } catch (error) {
      next(error);
    }
  }

  async insert(req, res, next) {
    try {
      const token = getDecodedToken(req.headers);
      const { ...post } = req.body;
      post.author = token.id;

      const result = await this.repos.postRepository.save(post);
      const user = await this.repos.userRepository.getById(token.id);

      res.json({ post: this.autoMapper.mapPost(result, user) });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const token = getDecodedToken(req.headers);

      const post = await this.repos.postRepository.getById(id);
      const user = await this.repos.userRepository.getById(token.id);

      res.json({ post: this.autoMapper.mapPost(post, user) });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req, res, next) {
    try {
      const { params, body } = req;
      const { images, ...data } = body;
      const updatedPost = { ...params, ...data };
      const token = getDecodedToken(req.headers);

      await this.validatePreconditions(token, updatedPost.id);

      const post = await this.repos.postRepository.save(updatedPost);
      const user = await this.repos.userRepository.getById(token.id);

      res.json({ post: this.autoMapper.mapPost(post, user) });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const token = getDecodedToken(req.headers);

      await this.validatePreconditions(token, id);

      const result = await this.repos.postRepository.deleteById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async validatePreconditions(token, postId) {
    const post = await this.repos.postRepository.getById(postId);

    if (!post || post.author._id.toString() !== token.id.toString()) {
      throw Error(`Post with id: ${postId} doesn't exist or user: ${token.id} is not allowed to do this operation.`); // eslint-disable-line
    }
  }
}

function getQueryOptions(req) {
  const {
    limit = 10,
    skip = 0,
    sortBy = { key: 'lastUpdatedOn', value: 'desc' },
  } = req.query || {};

  return { limit: tryParse(limit), skip: tryParse(skip), sortBy };
}

function tryParse(s) {
  let i;

  try {
    i = parseInt(s, 10);
  } catch (error) {
    // ignore
  }

  return i;
}

function hasNextPages({ count, options }) {
  return count > options.skip + options.limit;
}
