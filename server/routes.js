const secrets = require('./config/secrets');
const User = require('./models/User');
const Contest = require('./models/Contest');
const BannedUser = require('./models/BannedUser');
const Alert = require('./models/Alert');


module.exports = (app, passport) => {

    const isAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/')
    };

    const isAdmin = (req, res, next) => {
        if (req.user.isAdmin) {
            return next();
        }
        res.redirect('/');
    }

    app.get('/userAuthenticated', (req, res) => {
        if (req.user) {
            res.status(200).json(true)
        } else {
            res.status(200).json(false)
        }
    })

    app.get('/getAuthenticatedUser', (req, res) => {
        if (req.user) {
            Contest.find({}).then(async (data) => {
                const contestsRemaining = await Contest.countDocuments();
                res.status(200).json({ user: req.user, contestsRemaining: contestsRemaining })
            })
        } else {
            res.status(200).json(null)
        }

    })

    app.get('/bannedUsers', isAuthenticated, (req, res) => {
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

    app.post('/createAlert', isAuthenticated, isAdmin, (req, res) => {
        if (!req.body.message) {
            res.status(400).send('You must include a message')
        }
        let alert = new Alert();
        alert.message = req.body.message;
        alert.save()
            .then(() => res.status(200).json())
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    })

    app.get('/getAdminAlerts', isAuthenticated, isAdmin, (req, res) => {
        Alert.find({})
            .then(alerts => {
                res.status(200).json(alerts)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err);
            })
    })

    app.get('/getAlerts', isAuthenticated, (req, res) => {
        Alert.find({})
            .then(alerts => {
                const filteredAlerts = alerts.reduce((arr, alert) => {
                    if (!alert.dismissUserId.includes(req.user._id)) {
                        arr.push(alert);
                    }
                    return arr;
                }, [])
                res.status(200).json(filteredAlerts);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    })

    app.post('/dismissAlert', isAuthenticated, (req, res) => {
        Alert.findById(req.body.alertId).then(alert => {
            alert.dismissUserId.push(req.user._id)
            alert.save().then(() => {
                res.status(200).json();
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    })




}