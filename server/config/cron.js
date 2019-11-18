const cron = require('node-cron');
const User = require('../models/User');
const secrets = require('./secrets');
var Twitter = require('twitter');
const moment = require('moment-timezone');



cron.schedule('0 */3 * * *', async () => {

    // (async () => {
    console.log('Starting Twitter Bot...');

    const users = await User.find();

    await Promise.all(users.map(async user => {

        console.log(`Working on @${user.username}`)

        if (user.daysRemaining <= 0) return;
        user.daysRemaining -= 1;
        user.save();

        const T = new Twitter({
            consumer_key: secrets.CONSUMER_KEY,
            consumer_secret: secrets.CONSUMER_SECRET,
            access_token_key: user.token,
            access_token_secret: user.tokenSecret,
        });


        let tweets = [];

        const searchTweets = async () => {
            const yesterday = moment().tz('America/Denver').subtract(1, "days").format("YYYY-MM-DD")

            if (tweets.length > 1000) return;

            if (tweets.length == 0) {
                try {
                    const results = await T.get('search/tweets', { q: 'retweet to win since:' + yesterday, count: 100 });
                    if (results.statuses.length > 0) {
                        tweets.push(...results.statuses);
                        await searchTweets();
                    }
                } catch (err) {
                    console.log(err)
                }

            } else {
                const maxId = Math.max.apply(Math, tweets.map(tweet => { return tweet.id; }))
                const results = await T.get('search/tweets', { q: 'retweet to win since:' + yesterday, count: 100, max_id: maxId });
                if (results.statuses.length > 0) {
                    tweets.push(...results.statuses);
                    await searchTweets();
                }
            }
        }

        await searchTweets();

        console.log(`Tweets Length: ${tweets.length}`)

        if (tweets.length > 0) {

            var i = 0;

            const likeFollowRetweet = async () => {
                try {
                    await setTimeout(async () => {
                        const isBot = await isBotAccount(tweets[i]);
                        const keywordBan = await hasBannedKeywords(tweets[i]);
                        const bannedUser = await isBannedUser(tweets[i]);

                        if (!isBot || !keywordBan || !bannedUser) {

                            const liked = await like(tweets[i]);
                            const followed = await follow(tweets[i]);
                            const retweeted = await retweet(tweets[i]);

                            if (liked || followed || retweeted) {
                                user.contestsEntered++;
                                user.save();
                            }
                        };

                        i++;

                        if (i < tweets.length) {
                            likeFollowRetweet();
                        }
                    }, 3000)
                }
                catch (err) {
                    throw err;
                }
            }

            likeFollowRetweet();



            const like = async (tweet) => {
                try {
                    await T.post('favorites/create', { id: tweet.id_str })
                    return true;
                }
                catch (err) {
                    console.log(err);
                    return false;
                }
            }

            const follow = async (tweet) => {
                try {
                    await T.post('friendships/create', { screen_name: tweet.user.screen_name });
                    return true;
                }
                catch (err) {
                    console.log(err);
                    return false;
                }
            }

            const retweet = async (tweet) => {
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
                const bannedDescriptionKeywords = ['sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy']
                let bannedKeywordCount = 0;
                await Promise.all(bannedDescriptionKeywords.map(async keyword => {
                    tweet.user.description.includes(keyword) ? bannedKeywordCount++ : ''
                }))

                if (bannedKeywordCount > 0) true;
                return false;
            }

            const isBannedUser = async (tweet) => {
                const bannedUsers = ['bbc_thismorning', 'lion_of_judah2k', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg', 'Michael32558988', 'TerryMasonjr', 'mnsteph', 'BotSp0tterBot', 'bottybotbotl', 'RealB0tSpotter', 'jflessauSpam', 'RealBotSp0tter']
                let bannedUsersCount = 0;
                await Promise.all(bannedUsers.map(async bannedUser => {
                    tweet.user.screen_name.includes(bannedUser) ? bannedUsersCount++ : ''
                }))

                if (bannedUsersCount > 0) return true;
                return false;
            }


        }
    }))
    // })();
}, { scheduled: true, timezone: "America/Denver" });
