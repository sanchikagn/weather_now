/**
 * Created by kasumi on 3/16/17.
 */
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type:String, unique:true},
    password: String,
    email: String,
    accurateUpdates: Number,
    totalUpdates: Number,
    rate: Number
});

var User = mongoose.model('User', userSchema);
module.exports = User;