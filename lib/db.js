// A fork of the [node.js chat app](https://github.com/eiriksm/chat-test-2k)
var r = require('rethinkdb')
    , util = require('util')
    , assert = require('assert')
    , logdebug = require('debug')('rdb:debug')
    , logerror = require('debug')('rdb:error');


// #### Connection details

// RethinkDB database settings. Defaults can be overridden using environment variables.
var dbConfig = {
  host:  'rethinkdb',
  port:  28015,
  db  : 'whereuat_ninja',
  tables: {
    'locations': 'id',
    'users': 'id'
  }
};

/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the `RDB_DB` database (defaults to `chat`)
 * - create tables `messages`, `cache`, `users.js` in this database
 */
module.exports.setup = function() {

    r.connect({host: 'rethinkdb', port: 28015}, function (err, conn) {
        if (err) throw err;

        r.dbCreate(dbConfig.db).run(conn, function (err, result) {
            if (err) {
                logdebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbConfig.db, err.name, err.msg, err.message);
            }
            else {
                logdebug("[INFO ] RethinkDB database '%s' created", dbConfig.db);
            }

            for (var tbl in dbConfig.tables) {
                (function (tableName) {
                    r.db(dbConfig.db).tableCreate(tableName).run(conn, function (err, result) {
                        if (err) {
                            logdebug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
                        }
                        else {
                            logdebug("[INFO ] RethinkDB table '%s' created", tableName);
                        }

                        //seed users data and create indexes
                        if ( tableName == 'users' ) {
                            var seedUsers = [
                                {
                                    "firstname":  "Raphael" ,
                                    "id":  "87c6673b-ca53-440f-80ea-9c581caa6c1b" ,
                                    "lastname":  "Hamato" ,
                                    "ninjas": [ "84af3469-d270-407f-8717-01fd9ffac57e", "51f87610-745c-4f64-882e-7af6dc67867a" ],
                                    "username":  "raph"
                                }, {
                                    "firstname":  "Hamato" ,
                                    "id":  "84af3469-d270-407f-8717-01fd9ffac57e" ,
                                    "lastname":  "Yoshi" ,
                                    "ninjas": [ "f17cea99-2a1c-4511-877f-13fecd76cbfa", "51f87610-745c-4f64-882e-7af6dc67867a", "b98d4461-e118-4779-89b9-d498d076b5f4" ],
                                    "username":  "splinter"
                                }, {
                                    "firstname":  "April" ,
                                    "id":  "51f87610-745c-4f64-882e-7af6dc67867a" ,
                                    "lastname":  "O'Neil" ,
                                    "ninjas": [ ],
                                    "username":  "aoneeil"
                                }, {
                                    "firstname":  "Donatello" ,
                                    "id":  "a7416cd8-2c6b-4f19-a1ec-bdda4073961c" ,
                                    "lastname":  "Hamato" ,
                                    "ninjas": [ "f17cea99-2a1c-4511-877f-13fecd76cbfa", "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ],
                                    "username":  "donnie"
                                }, {
                                    "firstname":  "Leonardo" ,
                                    "id":  "f17cea99-2a1c-4511-877f-13fecd76cbfa" ,
                                    "lastname":  "Hamato" ,
                                    "ninjas": [ "f17cea99-2a1c-4511-877f-13fecd76cbfa", "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ],
                                    "username":  "Leo"
                                }, {
                                    "firstname":  "Oroku" ,
                                    "id":  "b98d4461-e118-4779-89b9-d498d076b5f4" ,
                                    "lastname":  "Saki" ,
                                    "ninjas": [ "e77bf273-2074-482d-ba06-66dfb0c9b0d2", "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ],
                                    "username":  "shredder"
                                }, {
                                    "firstname":  "Michelangelo" ,
                                    "id":  "e77bf273-2074-482d-ba06-66dfb0c9b0d2" ,
                                    "lastname":  "Hamato" ,
                                    "ninjas": [ "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ],
                                    "username":  "mikey"
                                }, {
                                    "firstname":  "Casey" ,
                                    "id":  "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ,
                                    "lastname":  "Jones" ,
                                    "ninjas": [ "e77bf273-2074-482d-ba06-66dfb0c9b0d2", "e8ee84ef-7c6e-41ea-853b-9f6efba83a89" ],
                                    "username":  "caseyj"
                                }
                            ];

                            r.db(dbConfig.db).table('users').insert(seedUsers).run(conn, function ( err, result ) {
                                if (err) {
                                    logerror("[ERROR] Failed to seed database with user: " + err.message);
                                }
                            });

                            r.db(dbConfig.db).table("users").indexCreate("username").run(conn);

                        }
                        else if ( tableName == 'locations' ) {
                            //seed the locations data
                            var locations = [
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.873804, "long": 2.294994, "time": r.epochTime(1462651096)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.871887, "long": 2.300871, "time": r.epochTime(1462650796)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.868394, "long": 2.301139, "time": r.epochTime(1462650496)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.862762, "long": 2.301686, "time": r.epochTime(1462650196)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860651, "long": 2.295516, "time": r.epochTime(1462649896)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.858908, "long": 2.293467, "time": r.epochTime(1462649596)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.858195, "long": 2.293124, "time": r.epochTime(1462649296)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.858153, "long": 2.294379, "time": r.epochTime(1462648996)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.857440, "long": 2.293885, "time": r.epochTime(1462648696)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.857913, "long": 2.295194, "time": r.epochTime(1462648396)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856875, "long": 2.294818, "time": r.epochTime(1462648096)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856423, "long": 2.296406, "time": r.epochTime(1462647796)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.858992, "long": 2.293498, "time": r.epochTime(1462647496)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860551, "long": 2.295648, "time": r.epochTime(1462647196)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.854305, "long": 2.305410, "time": r.epochTime(1462646896)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.853698, "long": 2.314733, "time": r.epochTime(1462646596)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.857997, "long": 2.315227, "time": r.epochTime(1462646296)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.862896, "long": 2.315216, "time": r.epochTime(1462645996)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.862614, "long": 2.318982, "time": r.epochTime(1462645696)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.864072, "long": 2.320059, "time": r.epochTime(1462645396)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860149, "long": 2.333288, "time": r.epochTime(1462645096)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860798, "long": 2.334372, "time": r.epochTime(1462644796)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860664, "long": 2.335477, "time": r.epochTime(1462644496)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.861172, "long": 2.335509, "time": r.epochTime(1462644196)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.861179, "long": 2.335970, "time": r.epochTime(1462643896)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.860515, "long": 2.335820, "time": r.epochTime(1462643596)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.861193, "long": 2.333803, "time": r.epochTime(1462643296)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.858511, "long": 2.332505, "time": r.epochTime(1462642996)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.857868, "long": 2.336195, "time": r.epochTime(1462642696)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.857332, "long": 2.338298, "time": r.epochTime(1462642396)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856732, "long": 2.339028, "time": r.epochTime(1462642096)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856619, "long": 2.338964, "time": r.epochTime(1462641796)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856563, "long": 2.339093, "time": r.epochTime(1462641496)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856888, "long": 2.339190, "time": r.epochTime(1462641196)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856069, "long": 2.340413, "time": r.epochTime(1462640896)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.853676, "long": 2.338385, "time": r.epochTime(1462640596)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.852511, "long": 2.338771, "time": r.epochTime(1462640296)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.852920, "long": 2.337001, "time": r.epochTime(1462639996)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.854995, "long": 2.336819, "time": r.epochTime(1462639696)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856280, "long": 2.336562, "time": r.epochTime(1462639396)},
                                {"user_id": "84af3469-d270-407f-8717-01fd9ffac57e", "lat": 48.856435, "long": 2.335253, "time": r.epochTime(1462639096)}
                            ];
                            r.db(dbConfig.db).table('locations').insert(locations).run(conn, function ( err, result ) {
                                if (err) {
                                    logerror("[ERROR] Failed to seed database with locations: " + err.message);
                                }
                            });

                            r.db(dbConfig.db).table("locations").indexCreate("user_id").run(conn);

                        }


                    });
                })(tbl);
            }


        });
    });
};

module.exports.findAllUsers = function (callback) {
  onConnect(function (err, connection) {
    logdebug("[INFO ][%s][findUsers] Login {user: %s, pwd: 'you really thought I'd log it?'}", connection['_id']);

    r.db('whereuat_ninja').table('users').run(connection, function(err, cursor) {
      if(err) {
        logerror("[ERROR][%s][findAllUsers][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
        connection.close();
      }
      else {
        cursor.toArray(function ( err, results ) {
          if(err) {
            logerror("[ERROR][%s][findAllUsers][toArray] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, [{"name":"scott"}]);
            connection.close();
          }
          else {
            callback( err, results );
            connection.close();
          }

        });
      }
    });



  });
};

// #### Filtering results


/**
 * Every user document is assigned a unique id when created. Retrieving
 * a document by its id can be done using the
 * [`get`](http://www.rethinkdb.com/api/javascript/get/) function.
 *
 * RethinkDB will use the primary key index to fetch the result.
 *
 * @param {String} userId
 *    The ID of the user to be retrieved.
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserById = function (userId, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('users').get(userId).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][findUserById] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(null, null);
      }
      else {
        callback(null, result);
      }
      connection.close();
    });
  });
};

/**
 * Every user document is assigned a unique id when created. Retrieving
 * a document by its id can be done using the
 * [`get`](http://www.rethinkdb.com/api/javascript/get/) function.
 *
 * RethinkDB will use the primary key index to fetch the result.
 *
 * @param {String} userName
 *    The ID of the user to be retrieved.
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserByUsername = function (userName, callback) {
    onConnect(function (err, connection) {
        r.db(dbConfig.db).table('users').getAll(userName, { index: "username" }).run(connection, function(err, result) {
            if(err) {
                logerror("[ERROR][%s][findUserById] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                callback(null, null);
            }
            else {
                result.next(function( err, row ){
                    callback(err, row);
                });
            }
            connection.close();
        });
    });
};

/**
 * To save a new location
 * [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * An `insert` op returns an object specifying the number
 * of successfully created objects and their corresponding IDs:
 *
 * ```
 * {
 *   "inserted": 1,
 *   "errors": 0,
 *   "generated_keys": [
 *     "b3426201-9992-ab84-4a21-576719746036"
 *   ]
 * }
 * ```
 *
 * @param {Object} location
 *    The location to be saved
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.insertLocation = function (location, callback) {
    location['geo_location'] = r.point( location.lat, location.long );
    onConnect(function (err, connection) {
        r.db(dbConfig.db).table('locations').insert(location).run(connection, function(err, result) {
            if(err) {
                logerror("[ERROR][%s][insertLocation] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                callback(err);
            }
            else {
                if(result.inserted === 1) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            }
            connection.close();
        });
    });
};

module.exports.getDateForEpoch = function( epochTime ) {
    return r.epochTime(epochTime);
};

module.exports.findLocationsByUserId = function( userId, callback ) {
    onConnect(function (err, connection) {
        r.db(dbConfig.db).table('locations').getAll( userId, { index: 'user_id' } ).orderBy(r.desc('time')).limit(100).run(connection, function(err, cursor) {
            if(err) {
                logerror("[ERROR][%s][findLocationsByUserId] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                callback(null, []);
                connection.close();
            }
            else {
                cursor.toArray(function(err, results) {
                    if(err) {
                        logerror("[ERROR][%s][findLocationsByUserId][toArray] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                        callback(null, []);
                    }
                    else {
                        callback(null, results);
                    }
                    connection.close();
                });
            }
        });
    });
}



// #### Retrieving chat messages

/**
 * To find the last `max_results` messages ordered by `timestamp`,
 * we are using [`table`](http://www.rethinkdb.com/api/javascript/table/) to access
 * messages in the table, then we
 * [`orderBy`](http://www.rethinkdb.com/api/javascript/order_by/) `timestamp`
 * and instruct the server to return only `max_results` using
 * [`limit`](http://www.rethinkdb.com/api/javascript/limit/).
 *
 * These operations are chained together and executed on the database. Results
 * are collected with [`toArray`](http://www.rethinkdb.com/api/javascript/toArray)
 * and passed as an array to the callback function.
 *
 *
 * @param {Number} max_results
 *    Maximum number of results to be retrieved from the db
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Array} an array of messages
 */
module.exports.findMessages = function (max_results, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('messages').orderBy(r.desc('timestamp')).limit(max_results).run(connection, function(err, cursor) {
      if(err) {
        logerror("[ERROR][%s][findMessages] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(null, []);
        connection.close();
      }
      else {
        cursor.toArray(function(err, results) {
          if(err) {
            logerror("[ERROR][%s][findMessages][toArray] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, []);
          }
          else {
            callback(null, results);
          }
          connection.close();
        });
      }
    });
  });
};


/**
 * To save a new chat message using we are using
 * [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * An `insert` op returns an object specifying the number
 * of successfully created objects and their corresponding IDs:
 *
 * ```
 * {
 *   "inserted": 1,
 *   "errors": 0,
 *   "generated_keys": [
 *     "b3426201-9992-ab84-4a21-576719746036"
 *   ]
 * }
 * ```
 *
 * @param {Object} msg
 *    The message to be saved
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.saveMessage = function (msg, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('messages').insert(msg).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      }
      else {
        if(result.inserted === 1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
};

/**
 * Adding a new user to database using  [`insert`](http://www.rethinkdb.com/api/javascript/insert/).
 *
 * If the document to be saved doesn't have an `id` field, RethinkDB automatically
 * generates an unique `id`. This is returned in the result object.
 *
 * @param {Object} user
 *   The user JSON object to be saved.
 *
 * @param {Function} callback
 *    callback invoked once after the first result returned
 *
 * @returns {Boolean} `true` if the user was created, `false` otherwise
 */
module.exports.saveUser = function (user, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('users').insert(user).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveUser] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      }
      else {
        if (result.inserted === 1) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
};

// #### Helper functions

/**
 * A wrapper function for the RethinkDB API `r.connect`
 * to keep the configuration details in a single function
 * and fail fast in case of a connection error.
 */
function onConnect(callback) {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function(err, connection) {
    assert.ok(err === null, err);
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}

// #### Connection management
//
// This application uses a new connection for each query needed to serve
// a user request. In case generating the response would require multiple
// queries, the same connection should be used for all queries.
//
// Example:
//
//     onConnect(function (err, connection)) {
//         if(err) { return callback(err); }
//
//         query1.run(connection, callback);
//         query2.run(connection, callback);
//     }
//