/**
 * Created by kasumi on 3/16/17.
 */
var mongoose = require('mongoose');

var windSchema = new mongoose.Schema({
    type: {type: String, unique: true},
    minimum: Number,
    maximum: Number
});

var Wind = mongoose.model('wind', windSchema);
module.exports = Wind;