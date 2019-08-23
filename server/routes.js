const secrets = require('./config/secrets');
const stripe = require("stripe")(secrets.STRIPE_PRIVATE_KEY);
const User = require('./models/User');
const Contest = require('./models/Contest');


module.exports = (app, passport) => {

    app.get('/contests', isLoggedIn, (req, res) => {
        Contest.find({ userId: req.user._id }).sort({ date: -1 }).then(contests => {
            res.status(200).json(contests);
        })
    })

    // app.get('/botLists', isLoggedIn, (req, res) => {
    //     Bot.find({ userId: req.user.id }, (err, bots) => {
    //         if (err) throw err;
    //         res.status(200).json(bots)
    //     })
    // });

    // app.get('/bot/:botId', isLoggedIn, (req, res) => {
    //     Bot.findById(req.params.botId, (err, bot) => {
    //         if (err) throw err;
    //         res.status(200).json(bot);
    //     })
    // })

    // app.post('/saveBot', isLoggedIn, (req, res) => {
    //     if (req.body.id) {
    //         Bot.findByIdAndUpdate(req.body.id, req.body, (err, bot) => {
    //             if (err) throw err;
    //             res.status(200).json(bot);
    //         })
    //     } else {
    //         const bot = new Bot(req.body);
    //         bot.userId = req.user.id;
    //         bot.save(err => {
    //             if (err) throw err;
    //             res.status(200).json(bot);
    //         });
    //     }
    // })

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

    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
        // successRedirect: '/#/payment',

        stripe.customers.retrieve(req.user.stripeId)
            .then(customer => {
                if (customer.subscriptions.total_count == 0) {
                    res.redirect('/#/payment')
                } else {
                    res.redirect('/#/dashboard')
                }
            })
    })

    app.post('/charge', (req, res) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(req.body.email).toLowerCase())) {
            stripe.customers.retrieve(req.user.stripeId)
                .then(customer => {
                    if (customer.subscriptions.total_count == 0) {
                        stripe.customers.update(customer.id, { email: req.body.email }).then(() => {
                            stripe.customers.createSource(customer.id, { source: req.body.token.id }).then(() => {
                                stripe.subscriptions.create({
                                    customer: customer.id,
                                    items: [{
                                        plan: 'plan_FNkLKnVhooEeU7'
                                    }]
                                }).then(() => res.status(200).send())
                            })
                        })
                    } else {
                        res.status(401).send('You already have an active subscription')
                    }
                })
                .then(() => {
                    res.status(200);
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).send(err);
                })
        } else {
            res.status(403).json({ message: 'Please include a valid email' })
        }

    })

}


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
}