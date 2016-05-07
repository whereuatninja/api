var _ = require('lodash');
var db = require('../lib/db')

module.exports = function(app) {
    /* Read */
    app.get('/ninjas', function ( req, res ) {
        db.findAllUsers(function( err, users ) {
            if (err) { throw err; }
            res.json(users);
        });
    });

    app.get('/ninjas/:id', function ( req, res ) {
        db.findUserById( req.params.id, function( err, user ) {
            if (err) { throw err; }
            res.json(user);
        });
    });

    /* Update */
    app.put('/ninjas/:id', function ( req, res ) {
        //todo add update stuff
    });

    /* Delete */
    app.delete('/ninjas/:id', function ( req, res ) {
        //todo add delete stuff
    });

};