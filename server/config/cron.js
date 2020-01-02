const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
const Following = require('../models/Following');
const Error = require('../models/Error');
const secrets = require('./secrets');
var Twitter = require('twitter');
const moment = require('moment-timezone');
const { timeout, like, follow, retweet, isBotAccount, hasBannedDescription, isBannedUser, hasBannedContent, has100Followers, decStrNum } = require('./helper');


if (secrets.PRODUCTION) {
    // Decrements days remaining for each user
    // Runs at midnight every day
    cron.schedule('0 0 * * *', async () => {
        await setDaysRemaining();
        await unfollowOldContests();
        await Error.collection.deleteMany({});
    }, { scheduled: true, timezone: "America/Denver" });


    // Get tweets for the day
    // Runs every day at 1 AM
    cron.schedule('0 1 * * *', async () => {
        await getTweets();
    }, { scheduled: true, timezone: "America/Denver" });

    // Likes, Follows, and Retweets
    // Runs every two hours (daily) starting at 2AM until 8PM 
    cron.schedule('0 2-20/2 * * *', async () => {
        await enterContests();
    }, { scheduled: true, timezone: "America/Denver" });
}

const setDaysRemaining = async () => {
    const users = await User.find({ daysRemaining: { $gte: 0 } })
    await Promise.all(users.map(async user => {
        user.daysRemaining -= 1;
        user.contestsEntered = 0;
        await user.save();
    }))
}

const unfollowOldContests = async () => {
    const following = await Following.find({}).sort({ created_at: -1 }).limit(300);
    const users = await User.find({});

    await Promise.all(users.map(async user => {

        const T = new Twitter({
            consumer_key: secrets.CONSUMER_KEY,
            consumer_secret: secrets.CONSUMER_SECRET,
            access_token_key: user.token,
            access_token_secret: user.tokenSecret,
        });

        try {
            const friendsList = await T.get('friends/ids', {});

            if (friendsList.ids.length > 3000) {

                await Promise.all(following.map(async val => {
                    try {
                        await timeout(250);
                        await T.post('friendships/destroy', { id: val.userId });
                    } catch (err) {
                        let error = new Error({ message: err[0].message, username: user.username, tweetId: null, userId: user._id })
                        await error.save();
                    }
                }))
            }
        } catch (err) {
            console.log(err)
        }
    }))
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

            let followLimit = false;
            let i = 0;

            const likeFollowRetweet = async () => {
                try {
                    await timeout(1000);
                    await like(T, tweets[i], user);

                    if (!followLimit) {
                        await timeout(1000);
                        var followed = await follow(T, tweets[i], user);
                    }

                    if (!followed) {
                        followLimit = true;
                    }

                    await timeout(1000);
                    let retweeted = await retweet(T, tweets[i], user);

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
        await Contest.deleteOne({ _id: contests.id });
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
        if (i >= 10) return;
        let results;

        if (i == 0) {
            try {
                results = await T.get('search/tweets', { q: query, count: 100 });
            } catch (err) {
                console.log(err)
            }

        } else {
            let contests = await Contest.find().select("tweets.id_str");
            let contestTweets = contests.map(item => item.tweets)
            let flattened = contestTweets.reduce((a, b) => a.concat(b));

            let maxId = await Math.min.apply(Math, flattened.map(tweet => { return tweet.id_str; }))
            let maxIdMinusOne = decStrNum(maxId)
            try {
                results = await T.get('search/tweets', { q: query, count: 100, max_id: maxIdMinusOne });
            } catch (err) {
                console.log(err)
            }
        }

        if (results && results.statuses.length > 0 && !results.statuses.retweeted_status) {

            const tweetArr = results.statuses.reduce((arr, tweet) => {
                let isBot = isBotAccount(tweet);
                let bannedDescription = hasBannedDescription(tweet);
                let bannedUser = isBannedUser(tweet);
                let bannedContent = hasBannedContent(tweet);
                let followerThreshold = has100Followers(tweet);

                if (!isBot && !bannedDescription && !bannedUser && !bannedContent && followerThreshold) {
                    following = new Following({ userId: tweet.user.id_str });
                    following.save()                        
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