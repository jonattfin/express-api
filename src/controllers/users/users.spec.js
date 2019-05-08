import request from 'supertest';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import app from '../../../app';
import blueprints from '../../repositories/seed/blueprints';
import repositories from '../../repositories';

const apiPrefix = '/api/v1';

describe('/user', () => {
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

    it('should respond 200 when calling /user', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/user`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { users } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(users.length).toBe(blueprints.users.length);
    });

    it('should respond 200 when calling /user/5bffb6a29b76a45647d329e9', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/user/5bffb6a39b76a45647d329f3`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { user } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(user).not.toBeUndefined();
    });

    it('should be able to get the loggedInUser', async () => {
      const res = await request(app)
        .get(`${apiPrefix}/user/loggedin`)
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { user } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(user).not.toBeUndefined();
    });

    it('should be able to update the current user', async () => {
      const firstName = 'Joe Black';

      const res = await request(app)
        .put(`${apiPrefix}/user/${jwt.decode(token).id}`)
        .send({ firstName })
        .set('authorization', `Bearer ${token}`);

      const { statusCode, text } = res;
      const { user } = JSON.parse(text);

      expect(statusCode).toBe(200);
      expect(user).not.toBeUndefined();
      expect(user.firstName).toBe(firstName);
    });
  });

  describe('not authorized', () => {
    const endpoints = [
      '/user',
      '/user/5bffb6a39b76a45647d329f3',
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
