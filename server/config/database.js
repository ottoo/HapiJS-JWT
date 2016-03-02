var mongoose = require('mongoose');
var config = require('./config');

var MongoDB = mongoose.connect('mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.db).connection;

MongoDB.on('error', function(err) { 
    console.log(err.message); 
});

MongoDB.once('open', function() {
  console.log("mongodb connection open");
});

exports.db = MongoDB;