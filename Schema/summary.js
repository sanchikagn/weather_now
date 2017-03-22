/**
 * Created by kasumi on 3/16/17.
 */
var mongoose = require('mongoose');

var summarySchema = new mongoose.Schema({
    type: {type: String, unique: true},
    summary: String,
});

var Summary = mongoose.model('summary', summarySchema);
module.exports = Summary;