import { PassportStatic } from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

export const setupPassport = (passport: PassportStatic) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
  };

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        // Here you would typically verify the user from your database
        // For now, we'll just pass the payload
        return done(null, payload);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
