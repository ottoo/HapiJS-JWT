var Mongoose = require('mongoose');
var Config = require('./config');

var MongoDB = Mongoose.connect('mongodb://' + Config.database.host + ':' + Config.database.port + '/' + Config.database.db).connection;

MongoDB.on('error', function(err) {
    console.log(err.message);
});

MongoDB.once('open', function() {
    console.log('mongodb connection open');
});

exports.db = MongoDB;
