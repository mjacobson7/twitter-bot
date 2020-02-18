const mongoose = require('mongoose');

const contestSchema = mongoose.Schema({
    id_str: String,
    full_text: String,
    favorited: Boolean,
    retweeted: Boolean,
    following: Boolean,
    is_quote_status: Boolean,
    screen_name: String,
    name: String,
    description: String,
    followers_count: Number
}, {
    timestamps: true
    });

module.exports = mongoose.model('Contest', contestSchema);