const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
const secrets = require('./secrets');
var Twitter = require('twitter');
const moment = require('moment-timezone');
const { timeout, like, follow, retweet, isBotAccount, hasBannedDescription, isBannedUser, hasBannedContent, hasValidKeywords, has100Followers, isQuoteStatus, setDaysRemaining, decStrNum } = require('./helper');


if (secrets.PRODUCTION) {
    // Decrements days remaining for each user
    // Runs at midnight every day
    cron.schedule('0 0 * * *', async () => {
        await setDaysRemaining();
    }, { scheduled: true, timezone: "America/Denver" });


    // Get tweets for the day
    // Runs every day at 1 AM
    cron.schedule('0 1 * * *', async () => {
        await getTweets();
    }, { scheduled: true, timezone: "America/Denver" });

    // Likes, Follows, and Retweets
    // Runs every hour (daily) starting at 2AM until 9PM 
    cron.schedule('0 2-20/1 * * *', async () => {
        await enterContests();
    }, { scheduled: true, timezone: "America/Denver" });
}

const enterContests = async () => {
    console.log('Starting Twitter Bot...');

    const contests = await Contest.findOne().sort({ created_at: 1 })
    const tweets = contests ? contests.tweets : [];

    if (tweets.length > 0) {
        const users = await User.find({ daysRemaining: { $gte: 0 } })

        await Promise.all(users.map(async user => {

            console.log(`Working on @${user.username}`)

            const T = new Twitter({
                consumer_key: secrets.CONSUMER_KEY,
                consumer_secret: secrets.CONSUMER_SECRET,
                access_token_key: user.token,
                access_token_secret: user.tokenSecret,
            });

            let i = 0;

            const likeFollowRetweet = async () => {
                try {
                    await timeout(1000);
                    await like(T, tweets[i]);

                    await timeout(1000);
                    await follow(T, tweets[i]);

                    await timeout(1000);
                    let retweeted = await retweet(T, tweets[i]);

                    if (retweeted) {
                        user.contestsEntered++;
                        await user.save();
                    }
                    i++;
                    if (i < tweets.length) {
                        likeFollowRetweet();
                    }

                }
                catch (err) {
                    throw err;
                }
            }
            await likeFollowRetweet();
        }))
    }
    await Contest.deleteOne({ _id: contests.id });
}


const getTweets = async () => {
    console.log('Starting Twitter Bot...');

    const T = new Twitter({
        consumer_key: secrets.CONSUMER_KEY,
        consumer_secret: secrets.CONSUMER_SECRET,
        access_token_key: secrets.PERSONAL_KEY,
        access_token_secret: secrets.PERSONAL_SECRET
    })

    let i = 0;
    Contest.collection.deleteMany({});

    const yesterday = moment().tz('America/Denver').subtract(1, "days").format("YYYY-MM-DD")
    const query = `retweet to win -filter:retweets -filter:replies filter:safe since:${yesterday}`;


    const searchTweets = async () => {
        if (i >= 20) return;
        let results;
        let maxId = null;
        if (i !== 0) {
            let contests = await Contest.find().select("tweets.id_str");
            let contestTweets = contests.map(item => item.tweets)
            let flattened = contestTweets.reduce((a, b) => a.concat(b));

            // Get the smallest id_str of stored contest and get the smallest one so future queries 
            //don't get tweets with ID's greater than this one. This is to prevent duplicate tweets from being stored.
            maxId = flattened.sort((a, b) => {
                if (a.id_str === b.id_str) return 0;
                if (a.id_str.length != b.id_str.length) return a.id_str.length - b.id_str.length;
                return a.id_str > b.id_str ? 1 : -1;
            })[0].id_str;
        }

        let maxIdMinusOne = decStrNum(maxId)

        try {
            results = await T.get('search/tweets', { q: query, count: 100, max_id: maxIdMinusOne, tweet_mode: 'extended' });
        } catch (err) {
            console.log(err)
        }

        if (results && results.statuses.length > 0 && !results.statuses.retweeted_status) {

            const tweetArr = results.statuses.reduce((arr, tweet) => {
                let isBot = isBotAccount(tweet);
                let bannedDescription = hasBannedDescription(tweet);
                let bannedUser = isBannedUser(tweet);
                let bannedContent = hasBannedContent(tweet);
                // let validKeywords = hasValidKeywords(tweet);
                let validKeywords = true;
                let followerThreshold = has100Followers(tweet);
                // let quoteStatus = isQuoteStatus(tweet);
                let quoteStatus = false;
                if (!isBot && !bannedDescription && !bannedUser && !bannedContent && validKeywords && followerThreshold && !quoteStatus) {
                    arr.push(tweet);
                }
                return arr;
            }, [])

            let contest = new Contest();
            contest.tweets = tweetArr;
            i++;
            await contest.save();
            await timeout(1000)
            await searchTweets();
            return;
        }
    }
    await searchTweets();
}

//getTweets()
//enterContests();
