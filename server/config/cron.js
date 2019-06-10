const cron = require('node-cron');
const Bot = require('../models/Bot');
const Twit = require('twit');
const secrets = require('./secrets');

cron.schedule('0 4 * * *', async () => {
    
    console.log('Starting Twitter Bot...');
    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Denver" }));
    const yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`;
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const bots = await Bot.find({})

    await Promise.all(bots.map(async bot => {

        if (bot.active) {
            console.log(`Working on @${bot.twitterHandle}`)

            const T = new Twit({
                consumer_key: secrets.CONSUMER_KEY,
                consumer_secret: secrets.CONSUMER_SECRET,
                access_token: bot.token,
                access_token_secret: bot.tokenSecret,
            })

            const keywords = ['rt to', 'rt and win', 'retweet and win', 'rt for', 'rt 4', 'retweet to']
            const searchTerms = ['RT to win', 'retweet to win']
            const bannedUsers = ['ilove70315673', 'followandrt2win']
            const bannedDescriptionKeywords = ['sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy']

            let tweets = [];

            // Get tweets between yesterday and today with the search terms provided
            await Promise.all(searchTerms.map(async search => {
                let retVal = await T.get('search/tweets', { q: `${search} -filter:retweets -filter:replies`, count: bot.searchCount, lang: 'en', since: yesterday, until: today });
                if (retVal.data.statuses.length > 0 && !tweets.includes(retVal.data.statuses.id)) {
                    tweets.push(...retVal.data.statuses);
                }
            }))

            console.log(`Tweets Length: ${tweets.length}`)

            let filteredTweets = tweets.filter((tweet, index) => {
                // Remove tweets that have already been retweeted or favorited
                if (tweet.retweeted || tweet.favorited) {
                    return false;
                }
                // Don't include tweets where bot or b0t is in the screenname
                if ((tweet.user.screen_name).toLowerCase().includes('bot') || (tweet.user.screen_name).toLowerCase().includes('b0t') || (tweet.user.screen_name).toLowerCase().includes('spam') || (tweet.user.screen_name).toLowerCase().includes('spot') || (tweet.user.name).toLowerCase().includes('bot') || (tweet.user.name).toLowerCase().includes('b0t') || (tweet.user.name).toLowerCase().includes('spam') || (tweet.user.name).toLowerCase().includes('spot')) {
                    return false;
                }

                // Don't include tweets from banned description list
                const bannedKeywordsExists = bannedDescriptionKeywords.filter(keyword => {
                    return !tweet.user.description.includes(keyword);
                })

                if(bannedKeywordsExists.length > 0) return false;

                //Don't include tweets from banned users list
                let bannedExists = bannedUsers.filter(bannedUser => {
                    if (tweet.user.screen_name.includes(bannedUser)) return true;
                    return false;
                })

                if (bannedExists.length > 0) return false;

                return true;
            });

            let contestsEntered = 0;
            console.log(`filteredTweets length: ${filteredTweets.length}`)
            filteredTweets.map(tweet => {
                if (tweet.text.includes('follow') || tweet.text.includes('#follow') || tweet.text.includes('Follow') || tweet.text.includes('#Follow') || tweet.text.includes('FOLLOW') || tweet.text.includes('#FOLLOW') || tweet.text.includes('#following') || tweet.text.includes('FOLLOWING') || tweet.text.includes('#FOLLOWING') || tweet.text.includes('Following') || tweet.text.includes('#Following')) {
                    T.post('friendships/create', { screen_name: tweet.user.screen_name }, (err) => {
                        if (err) return;
                        T.post('statuses/retweet/' + tweet.id_str, {}, (err) => {
                            if (err) return;
                            T.post('favorites/create', { id: tweet.id_str });
                            contestsEntered++;
                        });
                    })
                }
            })


            console.log(`Contests Entered: ${contestsEntered}`)
            console.log(`Finished work for @${bot.twitterHandle}`)
        }

    }))
}, { scheduled: true, timezone: "America/Denver" });