var _ = require('lodash');
var db = require('../lib/db')

module.exports = function(app) {
    /* Create */
    app.post( '/users', function ( req, res ) {
       //todo add create stuff
    });
    /* Read */
    app.get('/users', function ( req, res ) {
        //todo add get stuff
        res.json({"hello":"world!"});
    });

    app.get('/users/:id', function ( req, res ) {
        //todo add get stuff
    });

    /* Update */
    app.put('/users/:id', function ( req, res ) {
        //todo add update stuff
    });

    /* Delete */
    app.delete('/users/:id', function ( req, res ) {
        //todo add delete stuff
    });

};