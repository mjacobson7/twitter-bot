const cron = require('node-cron');
const User = require('../models/User');
const Contest = require('../models/Contest');
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

            const searchTerms = ["Retweet to win", "RT to win"]

            let tweets = [];

            // Get tweets between yesterday and today with the search terms provided
            await Promise.all(searchTerms.map(async search => {
                let retVal = await T.get('search/tweets', { q: `${search} -filter:retweets -filter:replies`, count: 10, lang: 'en', since: yesterday, until: today });
                if (retVal.statuses.length > 0) {
                    tweets.push(...retVal.statuses);
                }
            }))
            console.log(`Tweets Length: ${tweets.length}`)

            var i = 0;

            const likeFollowRetweet = async () => {
                try {
                    await setTimeout(async () => {
                        const isDup = await isDuplicate(tweets[i]);
                        if (!isDup) {
                            const isBot = await isBotAccount(tweets[i]);
                            if (!isBot) {
                                const keywordBan = await hasBannedKeywords(tweets[i]);
                                if (!keywordBan) {
                                    const bannedUser = await isBannedUser(tweets[i]);
                                    if (!bannedUser) {
                                        let contest = await createContestObject(tweets[i]);
                                        contestLiked = await like(contest, tweets[i]);
                                        contestFollowed = await follow(contestLiked ? contestLiked : contest, tweets[i]);
                                        contestRetweeted = await retweet(contestFollowed ? contestFollowed : contestLiked ? contestLiked : contest, tweets[i]);

                                        if (contestRetweeted) {
                                            contest = await contestRetweeted.save();
                                        } else if (contestFollowed) {
                                            contest = await contestFollowed.save();
                                        } else if (contestLiked) {
                                            contest = await contestLiked.save();
                                        } else {
                                            contest = await contest.save();
                                        }

                                        console.log(contest)
                                    };
                                };
                            };
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

            const createContestObject = async (tweet) => {
                const contest = new Contest();
                contest._id = tweet.id_str;
                contest.userId = user.id;
                contest.screenName = tweet.user.screen_name;
                contest.text = tweet.text;
                contest.date = new Date();
                contest.followed = false;
                contest.retweeted = false;
                contest.favorited = false;
                return await contest.save();
            }

            const like = async (contest, tweet) => {
                try {
                    await T.post('favorites/create', { id: tweet.id_str })
                    contest.favorited = true;
                    return contest;
                }
                catch (err) {
                    console.log(err);
                }
            }

            const follow = async (contest, tweet) => {
                try {
                    await T.post('friendships/create', { screen_name: tweet.user.screen_name });
                    contest.followed = true;
                    return contest;
                }
                catch (err) {
                    console.log(err);
                }
            }

            const retweet = async (contest, tweet) => {
                try {
                    await T.post('statuses/retweet/' + tweet.id_str, {});
                    contest.retweeted = true;
                    return contest;
                }
                catch (err) {
                    console.log(err);
                }
            }

            const isDuplicate = async (tweet) => {
                const contest = await Contest.findById(tweet.id_str);
                if (contest) return true;
                return false;
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
                const bannedUsers = ['ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg']
                let bannedUsersCount = 0;
                await Promise.all(bannedUsers.map(async bannedUser => {
                    tweet.user.screen_name.includes(bannedUser) ? bannedUsersSum++ : ''
                }))

                if (bannedUsersCount > 0) return true;
                return false;
            }








        }

    }))

})()
// }, { scheduled: true, timezone: "America/Denver" });
