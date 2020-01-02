const mongoose = require('mongoose');

const followingSchema = mongoose.Schema({
    userId: Number
}, {
    timestamps: true
    });

module.exports = mongoose.model('Following', followingSchema, 'following');