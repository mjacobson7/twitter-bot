const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: Number,
    token: String,
    tokenSecret: String,
    username: String,
    daysRemaining: Number,
    contestsEntered: Number,
    termsAccepted: Boolean,
    termsAcceptedDate: Date
});

module.exports = mongoose.model('User', userSchema);