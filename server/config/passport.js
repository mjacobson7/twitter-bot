const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');
const secrets = require('../config/secrets');

module.exports = passport => {


    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new TwitterStrategy({
        consumerKey: secrets.CONSUMER_KEY,
        consumerSecret: secrets.CONSUMER_SECRET,
        callbackURL: secrets.CALLBACK_URL,
        passReqToCallback: true,
        userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate'
    },
        (req, token, tokenSecret, profile, done) => {
            // make the code asynchronous
            // Bot.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {
                User.findOne({ '_id': profile.id }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();

                        // set all of the user data that we need
                        newUser._id = profile.id;
                        newUser.token = token;
                        newUser.tokenSecret = tokenSecret;
                        newUser.username = profile.username;
                        newUser.name = profile.displayName;
                        newUser.friendsCount = profile._json.friends_count;
                        newUser.active = false;
                        newUser.suspended = profile._json.suspended;


                        // save our user into the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
}

