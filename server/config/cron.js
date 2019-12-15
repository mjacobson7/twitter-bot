const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
const secrets = require('./secrets');
var Twitter = require('twitter');
const moment = require('moment-timezone');

// Decrements days remaining for each user
// Runs at midnight every day
cron.schedule('0 0 * * *', async () => {
    const users = await User.find({ daysRemaining: { $gte: 0 } })
    await Promise.all(users.map(async user => {
        user.daysRemaining -= 1;
        user.contestsEntered = 0;
        await user.save();
    }))
}, { scheduled: true, timezone: "America/Denver" });


// Likes, Follows, and Retweets
// Runs every two hours (daily) starting at 2AM until 8PM 
cron.schedule('0 2-20/2 * * *', async () => {
    // (async () => {
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
                    await setTimeout(async () => {
                        let isBot = isBotAccount(tweets[i]);
                        let bannedDescription = hasBannedDescription(tweets[i]);
                        let bannedUser = isBannedUser(tweets[i]);
                        let bannedContent = hasBannedContent(tweets[i]);
                        let followerThreshold = has100Followers(tweets[i])


                        if (!isBot && !bannedDescription && !bannedUser && !bannedContent && followerThreshold) {

                            await like(T, tweets[i]);
                            await follow(T, tweets[i]);
                            let retweeted = await retweet(T, tweets[i]);

                            if (retweeted) {
                                user.contestsEntered++;
                                await user.save();
                            }
                        };

                        i++;

                        if (i < tweets.length) {
                            likeFollowRetweet();
                        }
                    }, 0)
                }
                catch (err) {
                    throw err;
                }
            }

            await likeFollowRetweet();
        }))

        await Contest.deleteOne({ _id: contests.id });
    }
    // })();
}, { scheduled: true, timezone: "America/Denver" });












// Get tweets for the day
// Runs every day at 1 AM
cron.schedule('0 1 * * *', async () => {
// (async () => {

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
    const query = queryBuilder(yesterday);


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
            let contest = new Contest();
            contest.tweets = results.statuses;
            i++;
            await contest.save();
            await setTimeout(async () => {
                await searchTweets();
            }, 10000)
        }
    }

    await searchTweets();

    }, { scheduled: true, timezone: "America/Denver" });
// })()










// HELPER FUNCTIONS

function queryBuilder(yesterday) {
    const bannedUsers = ['justicerebooted', 'ukgovcoverup', 'lion_of_judah2k', 'bbc_thismorning', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'BotSp0tterBot', 'bottybotbotl', 'jflessauSpam', 'RealBotSp0tter', 'RealBotSpotter', 'B0tSp0tterB0t', 'BotSpotterBot', 'b0ttem', 'b0ttt0m', 'retweeejt']
    return bannedUsers.reduce((arr, currUser) => `${arr} -from:${currUser}`, `"retweet to win" -filter:retweets -filter:nativeretweets -filter:replies filter:safe since:${yesterday}`);
}

const like = async (T, tweet) => {
    if (!tweet.favorited) {
        try {
            await T.post('favorites/create', { id: tweet.id_str })
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    } else {
        return false;
    }
}

const follow = async (T, tweet) => {
    if (!tweet.user.following) {
        try {
            await T.post('friendships/create', { screen_name: tweet.user.screen_name });
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    } else {
        return false;
    }
}

const retweet = async (T, tweet) => {
    if (!tweet.retweeted) {
        try {
            await T.post('statuses/retweet/' + tweet.id_str, {});
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    } else {
        return false;
    }
}

const isBotAccount = (tweet) => {
    const botNames = ['bot', 'b0t', 'spam', 'spot'];
    return botNames.reduce((val, name) => {
        if (tweet.user.screen_name.toLowerCase().includes(name) || tweet.user.name.toLowerCase().includes(name)) {
            val = true;
        }
        return val;
    }, false)
}

const hasBannedDescription = (tweet) => {
    const keywords = ['uk', 'corruption', 'taylor swift', 'sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy', 'ariana', 'iphone', 'whatsapp'];

    return keywords.reduce((val, keyword) => {
        if (tweet.user.description.toLowerCase().includes(keyword)) {
            val = true;
        }
        return val;
    }, false)
}

const isBannedUser = (tweet) => {
    const bannedUsers = ['magic2192', 'mynameispaul', 'amariaajin', 'luisgp51', 'bloggeryanke', 'ukgovcoverup', 'QThePink', 'lion_of_judah2k', 'lkuya5ama', 'bettingvillage', 'flashyflashycom', 'clappedout24v', 'jiminoosaurus', 'bbc_thismorning', 'GIVEAWAY_2006', 'RelaxedReward', 'timetoaddress', 'FitzwilliamDan', 'Giveawayxxage', 'TashaGiveaway', 'SwiftiesIndia13', 'JsmallSAINTS', 'thetaylight', 'bbc_thismorning', 'lion_of_judah2k', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg', 'Michael32558988', 'TerryMasonjr', 'mnsteph', 'BotSp0tterBot', 'bottybotbotl', 'RealB0tSpotter', 'jflessauSpam', 'FuckLymax', 'RealBotSp0tter', 'RealBotSpotter', 'B0tSp0tterB0t', 'BotSpotterBot', 'b0ttem', 'RealBotSpotter', 'b0ttt0m', 'retweeejt', 'JC45195042', 'colleensteam', 'XgamerserX']

    return bannedUsers.reduce((val, bannedUser) => {
        if (tweet.user.screen_name.toLowerCase().includes(bannedUser.toLowerCase())) {
            val = true;
        }
        return val;
    }, false)
}

const hasBannedContent = (tweet) => {
    const bannedContent = ['trump', 'proof', 'taylor swift', 'iphone', 'paypal', 'bot', '$', 'whatsapp', 'voting', 'vote'];

    return bannedContent.reduce((val, content) => {
        if (tweet.text.toLowerCase().includes(content)) {
            val = true;
        }
        return val;
    }, false)
}

const has100Followers = (tweet) => tweet.user.followers_count >= 100;

function decStrNum(n) {
    n = n.toString();
    var result = n;
    var i = n.length - 1;
    while (i > -1) {
        if (n[i] === "0") {
            result = result.substring(0, i) + "9" + result.substring(i + 1);
            i--;
        }
        else {
            result = result.substring(0, i) + (parseInt(n[i], 10) - 1).toString() + result.substring(i + 1);
            return result;
        }
    }
    return result;
}






