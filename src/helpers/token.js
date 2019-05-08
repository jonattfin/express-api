import jwt from 'jsonwebtoken';

export const getEncodedToken = (headers = {}) => {
  const { authorization } = headers;
  const [, token] = authorization.split(' ');
  return token;
};

export const getDecodedToken = (headers = {}) => {
  const token = getEncodedToken(headers);
  return jwt.decode(token) || {};
};
