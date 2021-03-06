const User = require('../models/User');

module.exports = {
    timeout: async ms => await new Promise(resolve => setTimeout(resolve, ms)),
    like: async (T, tweet) => {
        if ((tweet.full_text.includes('fav') || tweet.full_text.includes('Fav') || tweet.full_text.includes('FAV') || tweet.full_text.includes('LIKE') || tweet.full_text.includes('Like')) && !tweet.favorited) {
            try {
                await T.post('favorites/create', { id: tweet.id_str })
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        }
        return false;
    },
    follow: async (T, tweet) => {
        if ((tweet.full_text.includes('follow') || tweet.full_text.includes('#follow') || tweet.full_text.includes('#Follow') || tweet.full_text.includes('Follow') || tweet.full_text.includes('FOLLOW') || tweet.full_text.includes('#FOLLOW') || tweet.full_text.includes('following') || tweet.full_text.includes('#following') || tweet.full_text.includes('FOLLOWING') || tweet.full_text.includes('#FOLLOWING') || tweet.full_text.includes('Following') || tweet.full_text.includes('#Following')) && !tweet.following) {
            try {
                await T.post('friendships/create', { screen_name: tweet.screen_name });
                return true;
            }
            catch (err) {
                console.log(err);
                return Error(err);
            }
        } else {
            return false;
        }
    },
    retweet: async (T, tweet, userId) => {
        if (!tweet.retweeted) {
            try {
                await T.post('statuses/retweet/' + tweet.id_str, {});
                return true;
            }
            catch (err) {
                console.log({error: err, userId: userId});
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
        const keywords = ['uk', 'corruption', 'asim', 'bar', 'AK-47', 'fortnite', 'justin', 'skins', 'fan', 'oneus', 'CSGO', 'CS:GO', 'loot', 'taylor swift', 'nsfw', 'club', 'xxx', '18+', 'onlyfans', 'sugarbaby', 'sugardaddy', 'sugar baby', 'sugar daddy', 'onlyfans', 'ariana', 'iphone', 'whatsapp'];

        return keywords.reduce((val, keyword) => {
            if (tweet.user.description.toLowerCase().includes(keyword)) {
                val = true;
            }
            return val;
        }, false)
    },
    isBannedUser: tweet => {
        const bannedUsers = ['zachh_attack', 'jbvotingupdate', 'giniqgin', 'CarI_theCutie', 'TheKPVotes', 'batfloke', 'pettergiveaway', 'h0neytheunicorn', 'milesl0renz0', 'soulone69', 'emilia0s', 'itsasiag', 'KillySmithh', 'moneypuguk', 'ggvertigo', 'HypeMikeYT', 'BxArmyph', 'LionRewards', 'WeCryptoGamers', 'TheBuffsheep', 'mercurylarents', 'Bet9jaWinnigs', 'doggishcat', 'se0nghwahwa', 'HealthLottery', 'lateriser12', 'JenPughPsychic', 'SallyZari', 'magic2192', 'mynameispaul', 'amariaajin', 'luisgp51', 'bloggeryanke', 'ukgovcoverup', 'QThePink', 'lion_of_judah2k', 'lkuya5ama', 'bettingvillage', 'flashyflashycom', 'clappedout24v', 'jiminoosaurus', 'bbc_thismorning', 'GIVEAWAY_2006', 'RelaxedReward', 'timetoaddress', 'FitzwilliamDan', 'Giveawayxxage', 'TashaGiveaway', 'SwiftiesIndia13', 'JsmallSAINTS', 'thetaylight', 'bbc_thismorning', 'lion_of_judah2k', 'realnews1234', 'timetoaddress', 'ilove70315673', 'followandrt2win', 'walkermarkk11', 'MuckZuckerburg', 'Michael32558988', 'TerryMasonjr', 'mnsteph', 'BotSp0tterBot', 'bottybotbotl', 'RealB0tSpotter', 'jflessauSpam', 'FuckLymax', 'RealBotSp0tter', 'RealBotSpotter', 'B0tSp0tterB0t', 'BotSpotterBot', 'b0ttem', 'RealBotSpotter', 'b0ttt0m', 'retweeejt', 'JC45195042', 'colleensteam', 'XgamerserX']

        return bannedUsers.reduce((val, bannedUser) => {
            if (tweet.user.screen_name.toLowerCase().includes(bannedUser.toLowerCase())) {
                val = true;
            }
            return val;
        }, false)
    },
    hasBannedContent: tweet => {
        const bannedContent = ['cash', 'bet', 'ariana', 'skins', 'asim', 'iHeartAwards', 'AK-47', 'fortnite', 'justin', 'oneus', 'fan', 'babe', 'election', 'loot', 'bar', 'club', 'CSGO', 'CS:GO', 'pinned', 'nsfw', 'trump', 'onlyfans', '18+', 'proof', 'taylor', 'swift', 'iphone', 'paypal', 'bot', '$', 'whatsapp', 'voting', 'vote'];

        return bannedContent.reduce((val, content) => {
            if (tweet.full_text.toLowerCase().includes(content)) {
                val = true;
            }
            return val;
        }, false)
    },
    hasValidKeywords: tweet => {
        // const validKeywords = ['rt to', 'rt and win', 'retweet and win', 'rt for', 'rt 4', 'retweet to']
        const validKeywords = ['competition time', 'chance to win', 'chance to #win', 'enter to win', 'enter to #win', 'To enter:', 'giveaway time', 'retweet and win',];
        return validKeywords.reduce((val, keyword) => {
            if(tweet.full_text.toLowerCase().includes(keyword)) {
                val = true;
            }
            return val;
        }, false);
    },
    has100Followers: tweet => tweet.user.followers_count >= 100,
    setDaysRemaining: async () => {
        const users = await User.find({ daysRemaining: { $gt: 0 } })
        await Promise.all(users.map(async user => {
            if(user.daysRemaining == 0) return;
            user.daysRemaining -= 1;
            user.contestsEntered = 0;
            await user.save();
        }))
    },
    isQuoteStatus: tweet => tweet.is_quote_status,
    decStrNum: n => {
        if (!n) return null;
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