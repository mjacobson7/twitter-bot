const mongoose = require('mongoose');

const contestSchema = mongoose.Schema({
    tweets: Array
}, {
    timestamps: true
    });

module.exports = mongoose.model('Contest', contestSchema);