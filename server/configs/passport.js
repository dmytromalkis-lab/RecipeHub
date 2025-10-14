import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { google_id: profile.id } });

        const firstName = profile.name?.givenName ?? "RecipeName";
        const lastName = profile.name?.familyName ?? "RecipeHub";

        if (!user) {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;

          user = await User.findOne({ where: { email } });

          if (user) {
            await user.update({
              google_id: profile.id,
              auth_provider: "local_google",
              avatar:
                profile.photos && profile.photos[0]
                  ? profile.photos[0].value
                  : null,
            });
          } else {
            user = await User.create({
              first_name: firstName,
              last_name: lastName,
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : null,
              avatar:
                profile.photos && profile.photos[0]
                  ? profile.photos[0].value
                  : null,
              auth_provider: "google",
              google_id: profile.id,
              password: null,
            });
          }
        } else {
          user = await user.update({
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : null,
            auth_provider: "google",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
