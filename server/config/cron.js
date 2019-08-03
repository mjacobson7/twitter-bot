const cron = require('node-cron');
const User = require('../models/User');
const secrets = require('./secrets');
var Twitter = require('twitter');




// cron.schedule('0 4 * * *', async () => {
(async () => {

    console.log('Starting Twitter Bot...');
    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Denver" }));
    const yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`;
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const users = await User.find({})


    await Promise.all(users.map(async user => {

        if (!user.active) { //need to change this check to see if user is on time with payments or not or hasn't cancelled subscription
            console.log(`Working on @${user.username}`)

            const T = new Twitter({
                consumer_key: secrets.CONSUMER_KEY,
                consumer_secret: secrets.CONSUMER_SECRET,
                access_token_key: user.token,
                access_token_secret: user.tokenSecret,
            });

            const searchTerms = ['"RT to win"', '"retweet to win"']
            const bannedUsers = ['ilove70315673', 'followandrt2win', 'walkermarkk11']
            const bannedDescriptionKeywords = ['sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy']

            let tweets = [];



            // Get tweets between yesterday and today with the search terms provided
            await Promise.all(searchTerms.map(async search => {
                let retVal = await T.get('search/tweets', { q: `${search} -filter:retweets -filter:replies`, count: 400, lang: 'en', since: yesterday, until: today });
                console.log(`OG Length: ${retVal.statuses.length} for ${search}`)
                if (retVal.statuses.length > 0) {
                    tweets.push(...retVal.statuses);
                }
            }))
            console.log(`Tweets Length: ${tweets.length}`)

            let filteredTweets = tweets.filter((tweet, index) => {

                // Remove tweets that have already been favorited or retweeted
                if (tweet.favorited || tweet.retweeted) {
                    console.log('favorited or retweeted already')
                    return false;
                }

                // Don't include tweets where bot or b0t is in the screenname
                if ((tweet.user.screen_name).toLowerCase().includes('bot') || (tweet.user.screen_name).toLowerCase().includes('b0t') || (tweet.user.screen_name).toLowerCase().includes('spam') || (tweet.user.screen_name).toLowerCase().includes('spot') || (tweet.user.name).toLowerCase().includes('bot') || (tweet.user.name).toLowerCase().includes('b0t') || (tweet.user.name).toLowerCase().includes('spam') || (tweet.user.name).toLowerCase().includes('spot')) {
                    console.log(`User [${tweet.user.screen_name}] is a bot`)
                    return false;
                }

                // Don't include tweets from banned description list
                let bannedKeywordsSum = 0;
                bannedDescriptionKeywords.map(keyword => {
                    if (tweet.user.description.includes(keyword)) bannedKeywordsSum += 1;
                })

                if (bannedKeywordsSum > 0) {
                    console.log('banned keyword')
                    return false;
                }

                //Don't include tweets from banned users list
                let bannedUsersSum = 0;
                bannedUsers.map(bannedUser => tweet.user.screen_name.includes(bannedUser) ? bannedUsersSum += 1 : '')

                if (bannedUsersSum > 0) {
                    console.log(`User [${tweet.user.screen_name} is banned`)
                    return false;
                }

                return true;
            });

            console.log(`filteredTweets length: ${filteredTweets.length}`)


            await Promise.all(filteredTweets.map(async tweet => {
                T.post('friendships/create', { screen_name: tweet.user.screen_name }).catch(err => console.log(err[0].message)),
                T.post('favorites/create', { id: tweet.id_str }).catch(err => console.log(err[0].message)),
                T.post('statuses/retweet/' + tweet.id_str, {}).catch(err => console.log(err[0].message))
            }))
                .then(data => {
                    // console.log(data)
                })
                .catch(err => {
                    // console.log(err.message)
                })

        }

    }))

})()
// }, { scheduled: true, timezone: "America/Denver" });


