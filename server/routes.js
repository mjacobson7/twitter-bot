const secrets = require('./config/secrets');
const stripe = require("stripe")(secrets.STRIPE_PRIVATE_KEY);
const User = require('./models/User');


module.exports = (app, passport) => {

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

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/#/payment',
        failureRedirect: '/'
    }))
    
    app.post('/stripe', (req, res) => {

        stripe.customers.create({
            source: req.body.id,
            email: req.body.email
        }).then(customer => {
            stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    plan: 'plan_FNkLKnVhooEeU7'
                }]
            }).then(data => res.status(200).json(data))
        }).catch(err => console.log(err))


    })

}


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.session.touch();
        next();
    }
}