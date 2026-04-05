import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { User } from '../models/User.js';

export const configurePassport = () => {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleCallbackUrl) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName || 'Google User',
              email,
              password: Math.random().toString(36).slice(-12),
              authProvider: 'google',
              googleId: profile.id
            });
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
