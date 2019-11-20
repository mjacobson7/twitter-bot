const secrets = require('./config/secrets');
const User = require('./models/User');


module.exports = (app, passport) => {

    app.get('/acceptTerms', (req, res) => {
        if(req.user) {
            req.user.termsAccepted = true;
            req.user.termsAcceptedDate = new Date();
            req.user.save().then(data => {
                res.status(200).json(data);
            })
        }
    })

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