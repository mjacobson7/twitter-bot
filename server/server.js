const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const secrets = require('./config/secrets');

//Express Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//DB Connection
mongoose.connect(secrets.DATABASE_URL, { useNewUrlParser: true });

//Cron Job
require('./config/cron')

app.use(session({ secret: secrets.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Passport
require('./config/passport')(passport); // pass passport for configuration

//routes
require('./routes')(app, passport);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist'));
})

const server = app.listen(8600, () => {
    const port = server.address().port;
    console.log(`Server listening on port: ${port}`);
});