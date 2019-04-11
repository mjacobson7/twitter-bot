// var Twit = require('twit')
// var config = require('./config');

// var T = new Twit(config)
// const date = new Date();
// const yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`

// console.log('Twitter Bot Starting...');

// const findTweets = async () => {
//     return await T.get('search/tweets', { q: 'retweet to win since:' + yesterday, count: 200 })
// };

// const retweet = async (id) => {
//     try {
//         await T.post('statuses/retweet/' + id);
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// const follow = async (screenName) => {
//     try {
//         await T.post('friendships/create', { screen_name: screenName });
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// const likeTweet = async (id) => {
//     try {
//         await T.post('favorites/create', { id: id });
//     }
//     catch (error) {
//         console.error(error);
//     }
// }

// const enterContests = async (tweet) => {
//     try {
//         console.log(tweet);
//         if (!tweet.hasOwnProperty('retweeted_status')) {
//             await retweet(tweet.id_str);
//             await follow(tweet.user.screen_name);
//             await likeTweet(tweet.id_str);
//             console.log("Contest Entered!!!");
//         }
//         else {
//             retweet(tweet.retweeted_status.id_str)
//             follow(tweet.retweeted_status.user.screen_name)
//             likeTweet(tweet.retweeted_status.id_str)
//             console.log("Contest Entered!!!");
//         }
//     }

//     catch (error) {
//         console.log(error);
//     }
// }


// const checkForContests = async () => {
//     try {
//         let tweets = await findTweets();

//         if (tweets.data.statuses.length > 0) {
//             let counter = 0;
//             let i = await setInterval(() => {
//                 enterContests(tweets.data.statuses[counter])
            
//                 counter++;
//                 if(counter === tweets.data.statuses.length - 1) {
//                     clearInterval(i);
//                 }
//             }, 420000);
//         }

//         await setTimeout(checkForContests, 86400000);
//     }
//     catch (error) {
//         console.error(error);
//     }

// }

// // checkForContests();




