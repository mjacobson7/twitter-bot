const mongoose = require('mongoose');

const bannedDescription = mongoose.Schema({
    descriptions: Array
});

module.exports = mongoose.model('BannedDescription', bannedDescription);