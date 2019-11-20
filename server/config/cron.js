const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
const secrets = require('./secrets');
var Twitter = require('twitter');
const moment = require('moment-timezone');

// Runs at midnight every day
cron.schedule('0 0 * * *', async () => {
    const users = await User.find({ daysRemaining: { $gte: 0 } })
    await Promise.all(users.map(async user => {
        user.daysRemaining -= 1;
        await user.save();
    }))
}, { scheduled: true, timezone: "America/Denver" });


// Runs every two hours (daily) starting at 2AM until 8PM 
cron.schedule('0 5-23/2 * * *', async () => {
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
                        let isBot = await isBotAccount(tweets[i]);
                        let keywordBan = await hasBannedKeywords(tweets[i]);
                        let bannedUser = await isBannedUser(tweets[i]);

                        if (!isBot || !keywordBan || !bannedUser) {
                            let liked = await like(T, tweets[i]);

                            let followed = await follow(T, tweets[i]);

                            let retweeted = await retweet(T, tweets[i]);

                            if (liked || followed || retweeted) {
                                user.contestsEntered++;
                                user.save();
                            }
                        };

                        i++;

                        if (i < tweets.length) {
                            likeFollowRetweet();
                        }
                    }, 5000)
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

    const searchTweets = async () => {
        const yesterday = moment().tz('America/Denver').subtract(1, "days").format("YYYY-MM-DD")

        if (i >= 10) return;

        if (i == 0) {
            try {
                let results = await T.get('search/tweets', { q: 'retweet to win since:' + yesterday, count: 100 });
                if (results.statuses.length > 0) {
                    let contest = new Contest();
                    contest.tweets = results.statuses;
                    i++;
                    await contest.save();
                    await setTimeout(async () => {
                        await searchTweets();
                    }, 1000)

                }
            } catch (err) {
                console.log(err)
            }

        } else {
            let contests = await Contest.find().select("tweets.id_str");

            let test = contests.map(item => {
                return item.tweets;
            })

            let flattened = test.reduce((a, b) => {
                return a.concat(b);
            });

            let maxId = await Math.min.apply(Math, flattened.map(tweet => { return tweet.id_str; }))
            let maxIdMinusOne = decStrNum(maxId)
            let results = await T.get('search/tweets', { q: 'retweet to win since:' + yesterday, count: 100, max_id: maxIdMinusOne });

            if (results.statuses.length > 0) {
                let contest = new Contest();
                contest.tweets = results.statuses;
                i++;
                await contest.save();

                await setTimeout(async () => {
                    await searchTweets();
                }, 10000)

            }
        }
    }

    await searchTweets();

}, { scheduled: true, timezone: "America/Denver" });
// })()














// HELPER FUNCTIONS

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

const like = async (T, tweet) => {
    try {
        await T.post('favorites/create', { id: tweet.id_str })
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

const follow = async (T, tweet) => {
    try {
        await T.post('friendships/create', { screen_name: tweet.user.screen_name });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

const retweet = async (T, tweet) => {
    try {
        await T.post('statuses/retweet/' + tweet.id_str, {});
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

const isBotAccount = async (tweet) => {
    if ((tweet.user.screen_name).toLowerCase().includes('bot') || (tweet.user.screen_name).toLowerCase().includes('b0t') || (tweet.user.screen_name).toLowerCase().includes('spam') || (tweet.user.screen_name).toLowerCase().includes('spot') || (tweet.user.name).toLowerCase().includes('bot') || (tweet.user.name).toLowerCase().includes('b0t') || (tweet.user.name).toLowerCase().includes('spam') || (tweet.user.name).toLowerCase().includes('spot')) {
        return true;
    }
    return false;
}

const hasBannedKeywords = async (tweet) => {
    const bannedDescriptionKeywords = ['Taylor Swift', 'sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy']
    let bannedKeywordCount = 0;
    await Promise.all(bannedDescriptionKeywords.map(async keyword => {
        tweet.user.description.includes(keyword) ? bannedKeywordCount++ : ''
    }))

    if (bannedKeywordCount > 0) true;
    return false;
}

const isBannedUser = async (tweet) => {
    const bannedUsers = ['RelaxedReward', 'ilove70315673', 'FuckLymax', 'timetoaddress', 'FitzwilliamDan', 'Giveawayxxage', 'TashaGiveaway', 'followandrt2win', 'SwiftiesIndia13', 'JsmallSAINTS', 'thetaylight', 'bbc_thismorning', 'lion_of_judah2k', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg', 'Michael32558988', 'TerryMasonjr', 'mnsteph', 'BotSp0tterBot', 'bottybotbotl', 'RealB0tSpotter', 'jflessauSpam', 'RealBotSp0tter'];
    let bannedUsersCount = 0;
    await Promise.all(bannedUsers.map(async bannedUser => {
        tweet.user.screen_name.includes(bannedUser) ? bannedUsersCount++ : '';
    }))

    if (bannedUsersCount > 0) return true;
    return false;
}