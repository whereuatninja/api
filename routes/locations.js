var _ = require('lodash');
var db = require('../lib/db')

module.exports = function(app) {

    /* Create */
    app.post( '/api/locations', function ( req, res ) {
        //for now just hard code the user until we figure out how to get that info from the request
        username = 'mikey';
        db.findUserByUsername( username, function( err, user ) {
            if (err) { throw err; }
            var location = req.body;
            location['user_id'] = user.id;

            if ( location.time == null ) {
                location.time = new Date();
            }
            else {
                location.time = db.getDateForEpoch(location.time);
            }

            db.insertLocation(location, function( locErr, result ){
                if (err) { throw err; }
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
