const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const botSchema = new Schema({
    _id: String,
    userId: String,
    twitterHandle: String,
    token: String,
    tokenSecret: String,
    searchTerm: String,
    searchCount: Number,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});


botSchema.pre('save', next => {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;