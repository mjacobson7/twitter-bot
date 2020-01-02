const mongoose = require('mongoose');

const errorSchema = mongoose.Schema({
    message: String,
    username: String,
    tweetId: String,
    userId: Number
}, {
    timestamps: true
    });

module.exports = mongoose.model('Error', errorSchema);