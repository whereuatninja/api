var _ = require('lodash');
var db = require('../lib/db')

module.exports = function(app) {
    /* Create */
    app.post( '/api/users', function ( req, res ) {
       //todo add create stuff
    });
    /* Read */
    app.get('/api/users', function ( req, res ) {
        db.findAllUsers(function( err, users ) {
            if (err) { throw err; }
            res.json(users);
        });
        //res.json({"hello":"world!"});
    });

    app.get('/api/users/:id', function ( req, res ) {
        //todo add get stuff
    });

    /* Update */
    app.put('/api/users/:id', function ( req, res ) {
        //todo add update stuff
    });

    /* Delete */
    app.delete('/api/users/:id', function ( req, res ) {
        //todo add delete stuff
    });

};
