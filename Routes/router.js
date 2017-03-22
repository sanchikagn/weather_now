/**
 * Created by kasumi on 3/7/17.
 */
var express = require('express');
var router = express.Router();

var Login = require('../Module/login');
var Weather = require('../Schema/location');
var User = require('../Schema/user');
var Cloud = require('../Schema/cloud');
var Wind = require('../Schema/wind');
var Summary = require('../Schema/summary');

var DarkSky = require('dark-sky');
var forecast = new DarkSky('884320426b9dd451e7d3d782f5c277c7');

router.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log('Username : ' + username);
    Login.userLogin(username, password, function (err, code) {
        if(err) {
            response.status(500).json({
                "success":false
            });
            console.log('server error');
        } else if(code === 2) {
            response.status(404).json({
                "success":false
            });
            console.log('User Not Found');
        } else if(code === 3) {
            response.status(404).json({
                "success":false
            });
            console.log('Incorrect password');
        } else {
            response.status(200).json({
                "success": true,
                "username": username
            });
            console.log('Successfully user logged in');
        }
    });
});
router.post('/signup', function(request,response) {
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    console.log('Username : ' + username);

    User.findOne({username: username}, function (err, user) {
        if (err) {
            console.log(err);
            response.status(500).json({"success": false});
        }
        else if (!user) {
            var newUser = new User();
            newUser.username = username;
            newUser.password = password;
            newUser.email = email;
            newUser.save(function (err, savedUser) {
                if (err) {
                    response.status(500).json({"success": false});
                    console.log(err);
                } else {
                    response.status(200).json({"success": true});
                    console.log('User saved successfully: ', savedUser);
                }
            });
        }
        else {
            console.log(user);
            console.log('user already exists');
            response.status(404).json({
                "success": false
            });
        }
    });
});
router.post('/weather', function (request, response) {
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;

    forecast.latitude(latitude).longitude(longitude).units('si').get().then(function (responseDark) {
        var data = JSON.parse(JSON.stringify(responseDark));
        var cloudType, windType, weatherType;

        var c = String(data.currently.cloudCover);
        if(c < 0.15){
            cloudType = "No Clouds";
        }else if((c >= 0.15) && (c < 0.45)){
            cloudType = "Moderate";
        } else cloudType = "Cloudy";

        var w = String(data.currently.windSpeed);
        if(w < 1.00){
            windType = "None";
        }else if((c >= 1.00) && (c < 2.50)){
            windType = "Normal";
        } else windType = "Heavy";

        var s = String(data.currently.summary);
        switch(s){
            case 'Clear':
                weatherType = "Sunny";
                break;
            case 'Overcast':
                weatherType = "About to rain";
                break;
            default:
                weatherType = "Rain";
        }
        response.json({
            "success": "true",
            "temperature": String(data.currently.temperature),
            "wind": windType,
            "cloud": cloudType,
            "weather": weatherType
        });
    });
});
router.post('/weatherAndroid', function(request, response){
    var body_string = JSON.stringify(request.body);
    var res = body_string.match("^{[.]*$\"}");
    body_string = body_string.substr(2,body_string.length-7);
    var body_stringObj = JSON.parse(body_string.split("\\\"").join("\""));
    var req_string = Object.keys(request.body)[0];
    var req_stringJSON = JSON.parse(req_string);
    var l = req_stringJSON.location;
    var location = l.toLowerCase();
    var latitude = req_stringJSON.latitude;
    var longitude = req_stringJSON.longitude;

    forecast.latitude(latitude).longitude(longitude).units('si').get().then(function (responseDark) {
        var data = JSON.parse(JSON.stringify(responseDark));
        var cloudType, windType, weatherType;

        var c = String(data.currently.cloudCover);
        if(c < 0.15){
            cloudType = "No Clouds";
        }else if((c >= 0.15) && (c < 0.45)){
            cloudType = "Moderate";
        } else cloudType = "Cloudy";

        var w = String(data.currently.windSpeed);
        if(w < 1.00){
            windType = "None";
        }else if((c >= 1.00) && (c < 2.50)){
            windType = "Normal";
        } else windType = "Heavy";

        var s = String(data.currently.summary);
        switch(s){
            case 'Clear':
                weatherType = "Sunny";
                break;
            case 'Overcast':
                weatherType = "About to rain";
                break;
            default:
                weatherType = "Rain";
        }
        response.json({
            "success":"true",
            "temperature":String(data.currently.temperature),
            "wind":windType,
            "cloud":cloudType,
            "weather":weatherType
        });
    });
});
router.post('/update', function(request, response) {
    var cloudType = request.body.cloud;
    var weatherType = request.body.weather;
    var windType = request.body.wind;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var username = request.body.username;
    var l = request.body.location;
    var location = l.toLowerCase();
    var c, w, s, count = 0, cloudID = 0, windID = 0, weatherID = 0;

    switch (cloudType) {
        case 'Cloudy':
            cloudID = 1;
            break;
        case 'Moderate':
            cloudID = 2;
            break;
        case 'NoClouds':
            cloudID = 3;
            break;
        default:
            cloudID = 0;
    }
    switch (windType) {
        case 'Heavy':
            windID = 1;
            break;
        case 'Normal':
            windID = 2;
            break;
        case 'None':
            windID = 3;
            break;
        default:
            windID = 0;
    }
    switch (weatherType) {
        case 'Sunny':
            weatherID = 1;
            break;
        case 'Rain':
            weatherID = 2;
            break;
        case 'AboutToRain':
            weatherID = 3;
            break;
        default:
            weatherID = 0;
    }
    var time = new Date().toLocaleTimeString();
    var date = new Date().toLocaleDateString();

    forecast.latitude(latitude).longitude(longitude).units('si').get().then(function (responseDark) {
        var data = JSON.parse(JSON.stringify(responseDark));
        console.log(data.currently);
        c = data.currently.cloudCover;
        w = data.currently.windSpeed;
        s = data.currently.summary;
        Cloud.findOne({cloudID: cloudID}, ['minimum', 'maximum'], function (err, cloud) {
            if (err) {
                console.log(err);
            }
            else {
                var cloudObj = JSON.parse(JSON.stringify(cloud));
                if ((cloudObj.minimum < c) && (c <= cloudObj.maximum)) {
                    Weather.update({location: location}, {$set: {cloud: cloudType}}, {new: true}, function (err, doc) {
                        if (err)
                            console.log(err);
                    });
                    count++;
                    //console.log(count);
                }
            }
            Wind.findOne({windID: windID}, ['minimum', 'maximum'], function (err, wind) {
                if (err)
                    console.log(err);
                else {
                    var windObj = JSON.parse(JSON.stringify((wind)));
                    if ((windObj.minimum < w) && (windObj.maximum >= w)) {
                        Wind.update({location: location}, {$set: {wind: windType}}, {new: true}, function (err, doc) {
                            if (err)
                                console.log(err);
                        });
                        count++;
                      //  console.log(count);
                    }
                }
                Summary.findOne({weatherID: weatherID}, ['type', 'summary'], function (err, summary) {
                    if (err)
                        console.log(err);
                    else {
                        var summaryObj = JSON.parse(JSON.stringify((summary)));
                        if (summaryObj.summary === s) {
                            Summary.update({location: location}, {$set: {weather: weatherType}}, {new: true}, function (err, doc) {
                                if (err)
                                    console.log(err);
                            });
                            count++;
                           // console.log(count);
                        }
                        if (count >= 2) {
                            User.update({username: username}, {$inc: {accurateUpdates: 1, totalUpdates: 1}}, {
                                new: true,
                                upsert: true
                            }, function (err, doc) {
                                if (err)
                                    console.log(err);
                                User.findOne({username: username}, {
                                    "_id": 0,
                                    "username": 1,
                                    "accurateUpdates": 1,
                                    "totalUpdates": 1,
                                    "rate": 1
                                }, function (err, user) {
                                    if (err) {
                                        response.status(500).json({
                                            "success": "false"
                                        });
                                    }
                                    var profile = JSON.parse(JSON.stringify(user));
                                    var value = ((profile.accurateUpdates) / (profile.totalUpdates)) * 100;
                                    var score = value.toFixed(1);
                                    User.update({username: username}, {
                                        $set: {
                                            rate: score,
                                            userUpdated: username
                                        }
                                    }, {new: true, upsert: true}, function (err, doc) {
                                        if (err)
                                            console.log(err);
                                    });
                                });
                            });

                            Weather.update({location: location},
                                {
                                    $set: {
                                        time: new Date().toLocaleTimeString(),
                                        date: new Date().toLocaleDateString()
                                    }
                                },
                                {new: true, upsert: true},
                                function (err, doc) {
                                    if (err)
                                        console.log(err);
                                });
                        } else {
                            User.update({username: username}, {$inc: {totalUpdates: 1}}, {
                                new: true,
                                upsert: true
                            }, function (err, doc) {
                                if (err)
                                    console.log(err);
                            });
                            User.findOne({username: username}, {
                                "_id": 0,
                                "username": 1,
                                "accurateUpdates": 1,
                                "totalUpdates": 1,
                                "rate": 1
                            }, function (err, user) {
                                if (err) {
                                    response.status(500).json({
                                        "success": "false"
                                    });
                                }
                                var profile = JSON.parse(JSON.stringify(user));
                                console.log(typeof(profile.accurateUpdates));
                                var value = ((profile.accurateUpdates) / (profile.totalUpdates)) * 100;
                                var score = value.toFixed(1);
                                User.update({username: username}, {$set: {rate: score}}, {
                                    new: true,
                                    upsert: true
                                }, function (err, doc) {
                                    if (err)
                                        console.log(err);
                                });
                            });

                            Weather.update({location: location},
                                {
                                    $set: {
                                        time: new Date().toLocaleTimeString(),
                                        date: new Date().toLocaleDateString()
                                    }
                                },
                                {new: true, upsert: true},
                                function (err, doc) {
                                    if (err)
                                        console.log(err);
                                });
                        }
                    }
                });
            });
        });
    });
    response.status(200).json({
        "success": "true"
    });
});
router.post('/profileAndroid', function(request, response) {
    var username = request.body.username;
    User.findOne({username:username},{
            "_id":0,
            "username":1,
            "accurateUpdates":1,
            "totalUpdates":1,
            "rate":1}, function(err, user){
        if(err) {
            response.status(500).json({
               "success" : "false"
            });
        }
        var profile = JSON.parse(JSON.stringify(user));
        response.status(200).json({
                "success":"true",
                "accurateUpdates": profile.accurateUpdates,
                "totalUpdates": profile.totalUpdates,
                "rate": profile.rate
        });
    });
});
router.get('/leaderboard', function (request, response) {
     User
         .find({rate: {$lte: 100}},
             ['username', 'rate']
             , {sort: {rate: -1}}, function (err, leaderboard) {
                 if (err) {
                     response.status(500).json({
                         "error": "Internal Server Error"
                     });
                     console.log(err);
                 } else if (!leaderboard) {
                     response.status(404).json({
                         "error": "Leaderboard not found"
                     });
                 } else {
                     response.status(200).json({
                         "success":"true",
                         "leaderboard": leaderboard
                     });
                 }
             });
 });

router.post('/profileAndroid', function(request, response) {
    var username = request.body.username;
    User.findOne({username:username},{
        "_id":0,
        "username":1,
        "accurateUpdates":1,
        "totalUpdates":1,
        "rate":1}, function(err, user){
        if(err) {
            response.status(500).json({
                "success" : "false"
            });
        }
        var profile = JSON.parse(JSON.stringify(user));
        response.status(200).json({
            "success":"true",
            "accurateUpdates": profile.accurateUpdates,
            "totalUpdates": profile.totalUpdates,
            "rate": profile.rate
        });
    });
});

router.get('/profile/:id', function(request, response) {
    var username = request.params.id;
    User.findOne({username:username},{
        "_id":0,
        "username":1,
        "accurateUpdates":1,
        "totalUpdates":1,
        "rate":1}, function(err, user){
        if(err) {
            response.status(500).json({
                "success" : "false"
            });
        }
        var profile = JSON.parse(JSON.stringify(user));
        response.status(200).json({
            "success":"true",
            "username": profile.username,
            "accurateUpdates": profile.accurateUpdates,
            "totalUpdates": profile.totalUpdates,
            "rate": profile.rate
        });
    });
});

router.post('/profile/', function(request, response) {
    var username = request.body.username;
    console.log(username);
    User.findOne({username:username},{
        "_id":0,
        "username":1,
        "accurateUpdates":1,
        "totalUpdates":1,
        "rate":1}, function(err, user){
        if(err) {
            response.status(500).json({
                "success" : "false"
            });
        }
        var profile = JSON.parse(JSON.stringify(user));
        response.status(200).json({
            "success":"true",
            "username": profile.username,
            "accurateUpdates": profile.accurateUpdates,
            "totalUpdates": profile.totalUpdates,
            "rate": profile.rate
        });
    });
});


router.get('/leaderboard', function (request, response) {
    User
        .find({rate: {$lte: 100}},
            ['username', 'rate']
            , {sort: {rate: -1}}, function (err, leaderboard) {
                if (err) {
                    response.status(500).json({
                        "error": "Internal Server Error"
                    });
                    console.log(err);
                } else if (!leaderboard) {
                    response.status(404).json({
                        "error": "Leaderboard not found"
                    });
                } else {
                    response.status(200).json({
                        "success":"true",
                        "leaderboard": leaderboard
                    });
                }
            });
});
module.exports = router;