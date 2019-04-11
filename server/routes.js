const Bot = require('./models/Bot');

module.exports = (app, passport) => {

    app.get('/botLists', isLoggedIn, (req, res) => {
        Bot.find({ userId: req.user.id }, (err, bots) => {
            if (err) throw err;
            res.status(200).json(bots)
        })
    });

    app.get('/bot/:botId', isLoggedIn, (req, res) => {
        Bot.findById(req.params.botId, (err, bot) => {
            if (err) throw err;
            res.status(200).json(bot);
        })
    })

    app.post('/saveBot', isLoggedIn, (req, res) => {
        if (req.body.id) {
            Bot.findByIdAndUpdate(req.body.id, req.body, (err, bot) => {
                if (err) throw err;
                res.status(200).json(bot);
            })
        } else {
            const bot = new Bot(req.body);
            bot.userId = req.user.id;
            bot.save(err => {
                if (err) throw err;
                res.status(200).json(bot);
            });
        }
    })

    app.post('/login', passport.authenticate('local-login'), (req, res) => {
        res.status(200).json(req.user);
    });

    app.post('/signup', passport.authenticate('local-signup'), (req, res) => {
        // console.log(req.user);
    });

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

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { session: false }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/dashboard');
        });

}


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.session.touch();
        next();
    }
}