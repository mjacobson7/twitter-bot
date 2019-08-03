const mongoose = require('mongoose');


const contestSchema = mongoose.Schema({
    token: String,
    tokenSecret: String,
    username: String,
    name: String,
    friendsCount: Number,
    active: Boolean,
    suspended: Boolean
});


module.exports = mongoose.model('Contest', contestSchema);