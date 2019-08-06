const mongoose = require('mongoose');


const contestSchema = mongoose.Schema({
    _id: Number,
    userId: Number,
    screenName: String,
    text: String,
    followed: Boolean,
    favorited: Boolean,
    retweeted: Boolean,
    date: Date
});


module.exports = mongoose.model('Contest', contestSchema);