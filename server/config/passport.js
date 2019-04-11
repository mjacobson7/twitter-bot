const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');
const Bot = require('../models/Bot');
const secrets = require('../config/secrets');

module.exports = passport => {


    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        (req, email, password, done) => {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(() => {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'email': email }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        (req, email, password, done) => { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false); //req.flash('loginMessage', 'No user found.')

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false); //req.flash('loginMessage', 'Oops! Wrong password.')

                // all is well, return successful user
                return done(null, user);
            });

        }));


    passport.use(new TwitterStrategy({
        consumerKey: secrets.CONSUMER_KEY,
        consumerSecret: secrets.CONSUMER_SECRET,
        callbackURL: secrets.CALLBACK_URL,
        passReqToCallback: true,
        userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true'
    },
        (req, token, tokenSecret, profile, done) => {
            // make the code asynchronous
            // Bot.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {

                Bot.findOne({ 'id': profile.id }, (err, bot) => {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the bot is found then log them in
                    if (bot) {
                        return done(null, bot); // bot found, return that bot
                    } else {
                        // if there is no bot, create them
                        var newBot = new Bot();

                        // set all of the bot data that we need
                        newBot._id = profile.id;
                        newBot.userId = req.session.passport.user;
                        newBot.twitterHandle = profile.username;
                        newBot.token = token;
                        newBot.tokenSecret = tokenSecret;
                        newBot.searchTerm = '';
                        newBot.searchCount = 0;
                        newBot.active = false;

                        // save our bot into the database
                        newBot.save(err => {
                            if (err)
                                throw err;
                            return done(null, newBot);
                        });
                    }
                })
            });
        }
    ));
}

