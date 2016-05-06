var express = require('express');
var router = express.Router();
var db = require("../lib/db");

/* GET home page. */
router.get('/', function(req, res, next) {

  var validateUser = function (err, users) {
    if (err) { console.log("error!!!!"+err) }
    console.log("found users.js: "+users);

    var title = JSON.stringify(users);

    res.render('index', { title: title });

  };

  db.findAllUsers(validateUser);
});

module.exports = router;
