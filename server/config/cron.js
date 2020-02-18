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
    // Runs every day at 12:30 AM
    cron.schedule('30 0 * * *', async () => {
        await getTweets();
    }, { scheduled: true, timezone: "America/Denver" });

    // Likes, Follows, and Retweets
    // Runs every hour (daily) starting at 2AM until 9PM 
    // UPDATE: Now runs every two hours starting at 2AM until 10PM to see if Twitter Limit Issues get resolved
    // NEW UPDATE:  Runs every 3rd hour from 1AM to 10PM which happens 8 times per day
    cron.schedule('0 1-22/3 * * *', async () => {
        await enterContests();
    }, { scheduled: true, timezone: "America/Denver" });
}

const enterContests = async () => {
    console.log('Starting Twitter Bot...');

    const tweets = await Contest.find().sort({ created_at: 1 }).limit(15);

    if (tweets.length > 0) {
        const users = await User.find({ daysRemaining: { $gt: 0 } })

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
                    let retweeted = await retweet(T, tweets[i], user._id);

                    if (retweeted) {
                        user.contestsEntered++;
                        user.totalContestsEntered++;
                        await user.save();
                    }
                    await Contest.deleteOne({ _id: tweets[i].id });

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
            let contests = await Contest.find().select("id_str");

            // Get the smallest id_str of stored contest and get the smallest one so future queries 
            // don't get tweets with ID's greater than this one. This is to prevent duplicate tweets from being stored.
            maxId = contests.sort((a, b) => {
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
  
            if (tweetArr.length > 0) {
                await Promise.all(tweetArr.map(async (tweet) => {
                    let contest = new Contest();
                    contest.id_str = tweet.id_str;
                    contest.full_text = tweet.full_text;
                    contest.favorited = tweet.favorited;
                    contest.retweeted = tweet.retweeted;
                    contest.following = tweet.user.following;
                    contest.is_quote_status = tweet.is_quote_status;
                    contest.screen_name = tweet.user.screen_name;
                    contest.name = tweet.user.name;
                    contest.description = tweet.user.description;
                    contest.followers_count = tweet.user.followers_count;
                    await contest.save();
                }))
            }
            i++;
            await timeout(1000)
            let numContests = await Contest.countDocuments();
            //This is to allow 20 users to use the bot and enter up to 150 contests per day without going over rate limit
            if(numContests <= 150) {
                await searchTweets();
            }
            return;
        }
    }
    await searchTweets();
}

//getTweets()
//enterContests();
