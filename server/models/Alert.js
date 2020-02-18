const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    message: String,
    dismissUserId: Array
}, {
    timestamps: true
    });

module.exports = mongoose.model('Alert', alertSchema);