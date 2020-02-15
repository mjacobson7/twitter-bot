const secrets = require('./config/secrets');
const User = require('./models/User');
const BannedUser = require('./models/BannedUser');


module.exports = (app, passport) => {

    const isAuthenticated = (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/')
    };

    app.get('/userAuthenticated', (req, res) => {
        if (req.user) {
            res.status(200).json(true)
        } else {
            res.status(200).json(false)
        }
    })

    app.get('/getAuthenticatedUser', (req, res) => {
        if (req.user) {
            res.status(200).json(req.user)
        } else {
            res.status(200).json(null)
        }

    })

    app.get('/bannedUsers', isAuthenticated,  (req, res) => {
        BannedUser.find({})
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.status(200).send();
    })

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/#/dashboard',
        failureRedirect: '/'
    }));




}