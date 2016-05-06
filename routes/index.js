var _ = require('lodash');
var db = require('../lib/db')

module.exports = function(app) {

  /* Read */
  app.get('/', function ( req, res ) {
    //todo figure out what we do at the root context
    res.json({"hello":"world!"});
  });

};

