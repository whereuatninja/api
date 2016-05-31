var _ = require('lodash');
var db = require('../lib/db');
var dbAccounts = require('../lib/dbAccounts');
var rp = require('request-promise');

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


        getGeoCodingDataFromGoogle(location)
        .then(function(json){
            location.locality = getLocationNameGeocodingData(json, 'locality') || "";
            location.neighborhood = getLocationNameGeocodingData(json, 'neighborhood') || "";
            db.insertLocation(location, function( locErr, result ){
                if (locErr) { throw locErr; }
                res.json(result);
            });
        });
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
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+location.lat+','+location.long+'&result_type=locality|neighborhood&key=AIzaSyAy2jX1ktVrXlTrFaht_ZMYQPlOrJpV7pM',
        method: 'GET',
        json: true
    };
    return rp(options).promise();
};

function getLocationNameGeocodingData(json, result_type){
    var locality;
    try {
        if (json && json.results && json.results.length > 0) {
            var address_components = json.results[0].address_components;
            for (var i = 0; i < address_components.length; i++){
                var isNeighborhood = doesListHaveType(address_components[i].types, result_type);
                if(isNeighborhood){
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
    return _.indexOf(list, type) > -1;
}