const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: Number,
    token: String,
    tokenSecret: String,
    username: String,
    daysRemaining: Number,
    contestsEntered: Number,
    totalContestsEntered: Number,
    isAdmin: Boolean
}, {
    timestamps: true
    });

module.exports = mongoose.model('User', userSchema);