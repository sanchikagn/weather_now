/**
 * Created by kasumi on 3/12/17.
 */
var User = require('./../Schema/user');

function userLogin(username, password, callback){
    User.findOne({username: username}, function(err, user){
        if(err) {
            callback(err, 1);
        } else if(!user) {
            callback(null, 2);
        } else if(!(user.password === password)){
            callback(null,3);
        }else {
            callback(null,4);
        }
    });
};

module.exports.userLogin = userLogin;