/*
This script creates a connection to the databases associated with this API.
*/

// Lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Store the db connection in an object
var dbState = {
  db: null
}

// Use connect method to connect to the Server
exports.connect = function(dbName, done) {
    // Connection URL. This is where your mongodb server is running.
    var dbUrl = 'mongodb://localhost:27017/'+ dbName;
    if (dbState.db) {
      return done();
    }

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            // Connection to database is sucessful.
            console.log('Connection established to: ', url);
            dbState.db = db;
            done()
        }
    });
}

exports.get = function() {
    return dbState.db
}

exports.close = function(done) {
    if (dbState.db) {
        dbState.db.close(function(err, result) {
            dbState.db = null
            dbState.mode = null
            done(err)
        })
    }
}
