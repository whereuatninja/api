/**
 * Created by jshaloo on 5/6/2016.
 */
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var db = require('./lib/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

db.setup();

var users = require('./routes/users.js')(app);

var server = app.listen(3000, function () {
    console.log('Server running at http://127.0.0.1:3000/');
});