const Error = require('../models/Error');

module.exports = {
    timeout: async ms => await new Promise(resolve => setTimeout(resolve, ms)),
    like: async (T, tweet, user) => {
       if (!tweet.favorited) {
            try {
                await T.post('favorites/create', { id: tweet.id_str })
                return true;
            }
            catch (err) {
                const error = new Error({ userId: user._id, username: user.username, tweetId: tweet.id_str, message: err[0].message})
                await error.save();
                return false;
            }
        }
        return false;
    },
    follow: async (T, tweet, user) => {
        if (!tweet.user.following) {
            try {
                await T.post('friendships/create', { screen_name: tweet.user.username });
                return true;
            }
            catch (err) {
                const error = new Error({ userId: user._id, username: user.username, tweetId: tweet.id_str, message: err[0].message})
                await error.save();
                return false;
            }
        } else {
            return false;
        }
    },
    retweet: async (T, tweet, user) => {
        if (!tweet.retweeted) {
            try {
                await T.post('statuses/retweet/' + tweet.id_str, {});
                return true;
            }
            catch (err) {
                const error = new Error({userId: user._id, username: user.username, tweetId: tweet.id_str, message: err[0].message})
                await error.save();
                return false;
            }
        } else {
            return false;
        }
    },
    isBotAccount: tweet => {
        const botNames = ['bot', 'b0t', 'spam', 'spot'];
        return botNames.reduce((val, name) => {
            if (tweet.user.screen_name.toLowerCase().includes(name) || tweet.user.name.toLowerCase().includes(name)) {
                val = true;
            }
            return val;
        }, false)
    },
    hasBannedDescription: tweet => {
        const keywords = ['uk', 'corruption', 'Asim', 'taylor swift', 'nsfw', 'club', 'xxx', 'sugarbaby', 'sugardaddy', '18+', 'sugar baby', 'sugar daddy', 'onlyfans', 'ariana', 'iphone', 'whatsapp'];

        return keywords.reduce((val, keyword) => {
            if (tweet.user.description.toLowerCase().includes(keyword)) {
                val = true;
            }
            return val;
        }, false)
    },
    isBannedUser: tweet => {
        const bannedUsers = ['zachh_attack', 'soulone69', 'KillySmithh', 'moneypuguk', '_KendelB', 'PLAYINATL', 'ggvertigo', 'HypeMikeYT', 'BxArmyph', 'LionRewards', 'WeCryptoGamers', 'TheBuffsheep', 'mercurylarents', 'Bet9jaWinnigs', 'doggishcat', 'se0nghwahwa', 'HealthLottery', 'lateriser12', 'JenPughPsychic', 'SallyZari', 'magic2192', 'mynameispaul', 'amariaajin', 'luisgp51', 'bloggeryanke', 'ukgovcoverup', 'QThePink', 'lion_of_judah2k', 'lkuya5ama', 'bettingvillage', 'flashyflashycom', 'clappedout24v', 'jiminoosaurus', 'bbc_thismorning', 'GIVEAWAY_2006', 'RelaxedReward', 'timetoaddress', 'FitzwilliamDan', 'Giveawayxxage', 'TashaGiveaway', 'SwiftiesIndia13', 'JsmallSAINTS', 'thetaylight', 'bbc_thismorning', 'lion_of_judah2k', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg', 'Michael32558988', 'TerryMasonjr', 'mnsteph', 'BotSp0tterBot', 'bottybotbotl', 'RealB0tSpotter', 'jflessauSpam', 'FuckLymax', 'RealBotSp0tter', 'RealBotSpotter', 'B0tSp0tterB0t', 'BotSpotterBot', 'b0ttem', 'RealBotSpotter', 'b0ttt0m', 'retweeejt', 'JC45195042', 'colleensteam', 'XgamerserX']

        return bannedUsers.reduce((val, bannedUser) => {
            if (tweet.user.screen_name.toLowerCase().includes(bannedUser.toLowerCase())) {
                val = true;
            }
            return val;
        }, false)
    },
    hasBannedContent: tweet => {
        const bannedContent = ['cash', 'bet', 'pinned', 'Asim', 'nsfw', 'onlyfans', '18+', 'trump', 'proof', 'taylor swift', 'iphone', 'paypal', 'bot', '$', 'whatsapp', 'voting', 'vote', 'flashy'];

        return bannedContent.reduce((val, content) => {
            if (tweet.text.toLowerCase().includes(content)) {
                val = true;
            }
            return val;
        }, false)
    },
    has100Followers: tweet => tweet.user.followers_count >= 100,
    decStrNum: n => {
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

}