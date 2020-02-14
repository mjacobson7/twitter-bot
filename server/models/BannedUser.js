const mongoose = require('mongoose');

const bannedUserSchema = mongoose.Schema({
    name: String,
    username: String,
    profileImg: String
}, {
    timestamps: true
    });

module.exports = mongoose.model('BannedUser', bannedUserSchema);
