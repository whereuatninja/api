var _ = require('lodash');
var db = require('../lib/db');
var dbAccounts = require('../lib/dbAccounts');
var rp = require('request-promise');

var geocoderProvider = 'google';
var httpAdapter = 'https';
// optional
var extra = {
    apiKey: 'AIzaSyAy2jX1ktVrXlTrFaht_ZMYQPlOrJpV7pM', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

module.exports = function(app) {

    /* Create */
    app.post( '/api/locations', function ( req, res ) {
        console.log("/locations posted body: %j", req.body);
        var location = req.body;
        location['user_id'] = req.whereuatUserId;
        console.log("user: "+req.whereuatUserId);
        if ( location.time == null ) {
            location.time = new Date();
        }
        else {
            location.time = db.getDateForEpoch(location.time);
        }

        geocoder.reverse({lat:location.lat, lon:location.long})
            .then(function(geoCodingResult) {
                console.log("geocoder: %j", geoCodingResult);
                location.city = geoCodingResult[0].city;
                location.country = geoCodingResult[0].country;
                if(geoCodingResult[0].extra){
                    location.neighborhood = geoCodingResult[0].extra.neighborhood || "";
                }

                db.insertLocation(location, function( locErr, result ){
                    if (locErr) { throw locErr; }
                    res.json(result);
                });
            })
            .catch(function(err) {
                console.log(err);
            });

        /*getGeoCodingDataFromGoogle(location)
        .then(function(json){
            location.locality = getLocationNameGeocodingData(json, ['locality', 'political']) || "";
            location.neighborhood = getLocationNameGeocodingData(json, 'neighborhood') || "";
            db.insertLocation(location, function( locErr, result ){
                if (locErr) { throw locErr; }
                res.json(result);
            });
        });*/

    });

    /* Read */
    // app.get('/locations', function ( req, res ) {
    //     db.findAllUsers(function( err, users ) {
    //         if (err) { throw err; }
    //         res.json(users);
    //     });
    // });

    app.get('/api/locations/:user_id', function ( req, res ) {
        var after = parseInt(req.query.after);
        var before = parseInt(req.query.before);
        db.findLocationsByUserId( req.params.user_id, after, before, function( err, user ) {
            if (err) { throw err; }
            res.json(user);
        });
    });

    /* Update */
    app.put('/api/ninjas/:id', function ( req, res ) {
        //todo add update stuff
    });

    /* Delete */
    app.delete('/api/ninjas/:id', function ( req, res ) {
        //todo add delete stuff
    });
};


function getGeoCodingDataFromGoogle(location){
    var options = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.lat+','+location.long+'&key=AIzaSyAy2jX1ktVrXlTrFaht_ZMYQPlOrJpV7pM',
        method: 'GET',
        json: true
    };
    return rp(options).promise();
};

function getLocationNameGeocodingData(json, result_type){
    var locality = "";
    try {
        if (json && json.results && json.results.length > 0) {
            var address_components = json.results[0].address_components;
            for (var i = 0; i < address_components.length; i++){
                var hasType = doesListHaveType(address_components[i].types, result_type);
                if(hasType){
                    console.log("type: "+address_components[i].long_name);
                    return address_components[i].long_name;
                }
            }
        }
    }
    catch(e){

    }
    return locality;
}

function doesListHaveType(list, type){
    if(Array.isArray(type)){
        for(var i=0;i<type.length;i++){
            if(_.indexOf(list, type[i]) < 0){
                return false;
            }
        }
        return true;
    }
    else{
        return _.indexOf(list, type) > -1;
    }
}