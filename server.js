/**
 * Created by jshaloo on 5/6/2016.
 */
var express = require('express');
var app = express();
var jwt = require('express-jwt');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');

var userIdAuth = require('./userIdAuth');
var db = require('./lib/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var jwtCheck = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

app.use('/api/locations', [jwtCheck, userIdAuth]);
app.use('/api/ninjas', [jwtCheck, userIdAuth]);
app.use('/api/users', [jwtCheck, userIdAuth]);

//db.setup();

var index = require('./routes/index.js')(app);
var users = require('./routes/users.js')(app);
var locations = require('./routes/locations.js')(app);
var ninjas = require('./routes/ninjas.js')(app);

var server = app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000/');
});
