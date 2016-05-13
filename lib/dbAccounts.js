var r = require('rethinkdb')
    , assert = require('assert')
    , logdebug = require('debug')('rdb:debug')
    , logerror = require('debug')('rdb:error');


var dbConfig = {
    host: 'rethinkdb',
    port: 28015,
    db  : 'whereuat_ninja',
    tables: {
        'locations': 'id',
        'users': 'id'
    }
};

module.exports.addUpdateUser = function (user, callback) {
    
    var dbUser = {
        name: user.name,
        email: user.email,
        id: user.sub,
        username: ""
    };
    
    onConnect(function (err, connection) {
        r.db(dbConfig.db).table('users').insert(dbUser, { conflict: "update" }).run(connection, function (err, result) {
            if (err) {
                logerror("[ERROR] Failed to add database user " + err.message);
            }
        });
    });
};

function onConnect(callback) {
    r.connect({ host: dbConfig.host, port: dbConfig.port }, function (err, connection) {
        assert.ok(err === null, err);
        connection['_id'] = Math.floor(Math.random() * 10001);
        callback(err, connection);
    });
}

