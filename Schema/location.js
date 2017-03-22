/**
 * Created by kasumi on 3/16/17.
 */
var mongoose = require('mongoose');

var weatherSchema = new mongoose.Schema({
    location: {type: String, unique: true},
    locationID: {type: Number, unique: true},
    temperature: Number,
    weather: String,
    cloud: String,
    wind: String,
    userUpdated: {type: String, unique: true},
    time: {type: String, default: new Date().toLocaleTimeString()},
    date: {type: String, default: new Date().toLocaleDateString()}
});

var Weather = mongoose.model('weather', weatherSchema);
module.exports = Weather;