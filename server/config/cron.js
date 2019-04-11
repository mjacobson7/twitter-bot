const cron = require('node-cron');
const Bot = require('../models/Bot');
const Twit = require('twit');
const secrets = require('./secrets');

cron.schedule('0 4 * * *', async () => {
    console.log('Starting Twitter Bot...');
    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Denver" }));
    const yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`;

    const bots = await Bot.find({})

    bots.map(bot => {
        console.log(`Working on @${bot.twitterHandle}`)
        console.log(`${bot.searchTerm} ${yesterday}`)
        let count = 0;
        if (bot.active) {
            const T = new Twit({
                consumer_key: secrets.CONSUMER_KEY,
                consumer_secret: secrets.CONSUMER_SECRET,
                access_token: bot.token,
                access_token_secret: bot.tokenSecret,
            })
                                        
            T.get('search/tweets', { q: `${bot.searchTerm} since:${yesterday}`, count: bot.searchCount })
                .then(tweets => {
                    tweets.data.statuses.map(tweet => {
                        if (!tweet.hasOwnProperty('retweeted_status')) {
                            Promise.all([
                                T.post('statuses/retweet/' + tweet.id_str),
                                T.post('friendships/create', { screen_name: tweet.user.screen_name }),
                                T.post('favorites/create', { id: tweet.id_str })
                            ])
                                .then(() => { console.log("Contest Entered!!!"); count++ })
                                .catch(err => console.log(err))
                        }
                        else {
                            Promise.all([
                                T.post('statuses/retweet/' + tweet.retweeted_status.id_str),
                                T.post('friendships/create', { screen_name: tweet.retweeted_status.user.screen_name }),
                                T.post('favorites/create', { id: tweet.retweeted_status.id_str })
                            ])
                                .then(() => { console.log("Contest Entered!!!"); count++ })
                                .catch(err => console.log(err))
                        }
                    })
                })
        }
        console.log(`Contests Entered Count: ${count}`)
    })
}, { scheduled: true, timezone: "America/Denver" });