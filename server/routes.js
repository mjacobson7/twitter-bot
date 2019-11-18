const secrets = require('./config/secrets');
const User = require('./models/User');


module.exports = (app, passport) => {

    app.get('/signout', (req, res) => {
        req.logout();
        res.status(200).send();
    });

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


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
}