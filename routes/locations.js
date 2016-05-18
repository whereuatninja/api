var _ = require('lodash');
var db = require('../lib/db');
var dbAccounts = require('../lib/dbAccounts');

module.exports = function(app) {

    /* Create */
    app.post( '/api/locations', function ( req, res ) {
      dbAccounts.findUserByAuthId(req.user.sub, function(err, user) {
        if (err) { throw err; }
        var userId = user.id;
        var location = req.body;
        location['user_id'] = req.whereuatUserId;

        if ( location.time == null ) {
            location.time = new Date();
        }
        else {
            location.time = db.getDateForEpoch(location.time);
        }
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
        db.findLocationsByUserId( req.params.user_id, function( err, user ) {
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
