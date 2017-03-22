/**
 * Created by kasumi on 3/7/17.
 */
var express = require('express');
var router = require('./Routes/router');
var bodyParser = require('body-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/weather';
mongoose.connect(url);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(logger('dev'));
app.use(router);
app.use('/', express.static('app'));
app.listen(3000);