var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
    UserEmail:String,
    Password:String,
    UserConfirmPassword:String,
    UserOtp:String
});