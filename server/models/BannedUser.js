const mongoose = require('mongoose');

const bannedUserSchema = mongoose.Schema({
    users: Array
});

module.exports = mongoose.model('BannedUser', bannedUserSchema);