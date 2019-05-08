import request from 'supertest';
import _ from 'lodash';

import app from '../../../app';
import blueprints from '../../repositories/seed/blueprints';
import repositories from '../../repositories';

const apiPrefix = '/api/v1';

describe('/topic', () => {
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

    it('should respond 200 when calling /topic', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/topic`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { topics } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(topics.length).toBe(blueprints.topics.length);
    });

    it(`should respond 200 when calling /topic/${_.first(blueprints.topics).id}`, async () => {
      const res = await request(app)
        .get(`${apiPrefix}/topic/${_.first(blueprints.topics).id}`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { topic } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(topic).not.toBeUndefined();
    });

    it('should add a new topic to database', async () => {
      const mock = {
        name: 'topic 10',
        description: 'desc topic 10',
        order: 10,
      };

      const res = await request(app)
        .post(`${apiPrefix}/topic`)
        .send(mock)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { topic } = JSON.parse(text);

      expect(statusCode).toBe(201);
      expect(topic).not.toBe(undefined);
      expect(topic.name).toEqual(mock.name);
    });

    it('should not add a new topic to database if some fields are missing (name)', async () => {
      const mock = {
        description: 'desc topic 10',
        order: 10,
      };

      const res = await request(app)
        .post(`${apiPrefix}/topic`)
        .send(mock)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { topic, errors } = JSON.parse(text);

      expect(_.size(errors)).toEqual(1);
      expect(statusCode).toBe(422);
      expect(topic).toBeUndefined();
    });

    it('should update an existing topic', async () => {
      const expectedName = 'new name';

      const res = await request(app)
        .put(`${apiPrefix}/topic/${_.first(blueprints.topics).id}`)
        .send({ name: expectedName })
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { topic } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(topic).not.toBe(undefined);
      expect(topic.name).toEqual(expectedName);
    });
  });

  describe('not authorized', () => {
    const endpoints = [
      '/topic',
      '/topic/5bffb6a29b76a45647d329e9',
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
