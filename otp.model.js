var mongoose = require('mongoose');

module.exports = mongoose.model('otpVerification', {
    UserEmail:String,
    Otp:String,
    IsValidate:Boolean,
    CreatedTime:Date
});