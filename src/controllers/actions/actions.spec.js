import request from 'supertest';
import _ from 'lodash';

import app from '../../../app';
import repositories from '../../repositories';

const apiPrefix = '/api/v1';

describe.skip('/actions', () => {
  // populate
  beforeAll(async () => {
    await repositories.seedRepository.populate();
  });

  // clean
  afterAll(async () => {
    await repositories.seedRepository.cleanDB();
  });

  describe('login', () => {
    it('should return a valid token if username & pwd are valid', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/actions/login`)
        .send({ username: 'username1', password: 'passwd' });

      const { success, token } = res.body;

      expect(success).toBe(true);
      expect(token).not.toBeUndefined();
    });

    it('should return a message if pwd is wrong', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/actions/login`)
        .send({ username: 'username1', password: 'wrong password' });

      const { success, token, msg } = res.body;

      expect(success).toBe(false);
      expect(msg).toBe('Wrong username/password');
      expect(token).toBeUndefined();
    });

    it('should return a message if username is wrong', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/actions/login`)
        .send({ username: 'wrong username', password: 'wrong password' });

      const { success, token, msg } = res.body;

      expect(success).toBe(false);
      expect(msg).toBe('Wrong username/password');
      expect(token).toBeUndefined();
    });
  });

  describe('signUp', () => {
    it('should be able to create a new user', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/actions/signUp`)
        .send({
          username: 'username3',
          firstName: 'Joe',
          lastName: 'Doe',
          email: 'joe@gmail.com',
          phone: '0746161315',
          subscribedTopics: [],
          password: 'passwd',
        });

      const { statusCode, text } = res;
      const { user } = JSON.parse(text);

      expect(statusCode).toBe(201);
      expect(user).not.toBeUndefined();
    });

    it('should not be able to create an user with missing fields', async () => {
      const res = await request(app)
        .post(`${apiPrefix}/actions/signUp`)
        .send({
          subscribedTopics: [],
        });

      const { statusCode, text } = res;
      const { user, errors } = JSON.parse(text);

      expect(_.size(errors)).toBe(6); // the missing fields
      expect(statusCode).toBe(422);

      expect(user).toBeUndefined();
    });
  });
});
