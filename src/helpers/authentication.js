import { Strategy, ExtractJwt } from 'passport-jwt';
import repos from '../repositories';

export const AuthSecret = 'nodeAuthSecret';

export default (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: AuthSecret,
  };

  passport.use(new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await repos.userRepository.getById(jwtPayload.id);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};
