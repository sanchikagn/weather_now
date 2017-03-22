/**
 * Created by kasumi on 3/16/17.
 */
var mongoose = require('mongoose');

var cloudSchema = new mongoose.Schema({
    type: {type: String, unique: true},
    minimum: Number,
    maximum: Number
});

var Cloud = mongoose.model('Cloud', cloudSchema);
module.exports = Cloud;