const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');


const userSchema = mongoose.Schema({
    _id: Number,
    token: String,
    tokenSecret: String,
    username: String,
    name: String,
    friendsCount: Number,
    active: Boolean,
    suspended: Boolean
});


// // generating a hash
// userSchema.methods.generateHash = function (password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.password);
// };

module.exports = mongoose.model('User', userSchema);