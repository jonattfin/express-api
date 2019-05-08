import request from 'supertest';
import _ from 'lodash';

import app from '../../../app';
import blueprints from '../../repositories/seed/blueprints';
import repositories from '../../repositories';
// import { logger } from '../../helpers';

const apiPrefix = '/api/v1';

describe('/post', () => {
  describe('authorized', () => {
    let token;

    // populate & authentication
    beforeEach(async () => {
      await repositories.seedRepository.populate();

      const user = _.first(blueprints.users);
      const { username, password } = user;

      const res = await request(app)
        .post(`${apiPrefix}/actions/login`)
        .send({ username, password });

      expect(res.body.token).not.toBeUndefined();
      ({ token } = res.body);
    });

    // clean
    afterEach(async () => {
      await repositories.seedRepository.cleanDB();
    });

    it('should list all the posts', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;

      const { posts } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(posts.length).toBe(2);
    });

    it('should get all data for a known post', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/${_.first(blueprints.posts).id}`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { post } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(post).not.toBeUndefined();
    });

    it('should find all posts for a known user', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/findByAuthor/${_.last(blueprints.users).id}`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { posts } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(posts.length).toBe(1);
    });

    it('should find all posts for a known topic', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/findByTopic/${_.first(blueprints.topics).id}`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { posts } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(posts.length).toBe(2);
    });

    it('should find all favorite posts', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/findFavorite`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { posts } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(posts.length).toEqual(0);
    });

    it('should find all not favorite posts', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/findNotFavorite`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { posts } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(posts.length).toEqual(2);
    });

    it('should get the comments from post', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/post/${_.first(blueprints.posts).id}/comment`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { comments } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(comments.length).toBe(0);
    });

    it('should add comments to post', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/post/${_.first(blueprints.posts).id}/comment`)
        .send({ text: 'comment' })
        .set('authorization', `Bearer ${token}`);

      const { statusCode } = res;

      expect(statusCode).toBe(204);
    });

    it('should make post favorite', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/post/${_.first(blueprints.posts).id}/favorite`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode } = res;
      expect(statusCode).toBe(204);
    });

    it('should remove the post as being favorite', async () => {
      const res = await request(app)
        .delete(`${apiPrefix}/post/${_.first(blueprints.posts).id}/favorite`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode } = res;
      expect(statusCode).toBe(204);
    });

    it('should add a new post to database', async () => {
      const mockPost = {
        title: 'post 3',
        description: 'description ',
        location: 'location',
        images: [],
        topics: [
          _.first(blueprints.topics).id,
        ],
      };

      const res = await request(app)
        .post(`${apiPrefix}/post`)
        .send(mockPost)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { post, errors } = JSON.parse(text);

      expect(errors).toBeUndefined();
      expect(statusCode).toBe(200);
      expect(post).not.toBe(undefined);
      expect(post.title).toEqual(mockPost.title);
    });

    it('should not add a new post to database if there are missing fields (title, description)', async () => {
      const mockPost = {
        location: 'location',
        images: [],
        topics: [
          _.first(blueprints.topics).id,
        ],
      };

      const res = await request(app)
        .post(`${apiPrefix}/post`)
        .send(mockPost)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { post, errors } = JSON.parse(text);

      expect(_.size(errors)).toBe(2);
      expect(statusCode).toBe(422);
      expect(post).toBeUndefined();
    });

    it('should update an existing post', async () => {
      const expectedTitle = 'new title';

      const res = await request(app)
        .put(`${apiPrefix}/post/${_.first(blueprints.posts).id}`)
        .send({ title: expectedTitle })
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { post, errors } = JSON.parse(text);

      expect(errors).toBeUndefined();
      expect(statusCode).toBe(200);
      expect(post).not.toBe(undefined);
    });
  });

  describe('not authorized', () => {
    const endpoints = [
      '/post',
      `/post/${_.first(blueprints.posts).id}`,
      `/post/findByAuthor/${_.last(blueprints.users).id}`,
      `/post/findByTopic/${_.first(blueprints.topics).id}`,
      `/post/${_.first(blueprints.posts).id}/comment`,
    ];

    endpoints.forEach((endpoint) => {
      it(`should respond 401 when calling ${endpoint}`, async () => {
        const res = await request(app).get(`${apiPrefix}/${endpoint}`);

        const { statusCode } = res;
        expect(statusCode).toBe(401);
      });
    });
  });
});
