const Mongoose = require('mongoose');
const Config = require('./../index.js');

const uri = `mongodb://${Config.database.host}:${Config.database.port}/${Config.database.db}`;
const MongoDB = Mongoose.connect(uri, {
  db: { native_parser: true },
  server: { poolSize: 5 },
  auth: {
    authdb: 'admin'
  },
  user: Config.database.username,
  pass: Config.database.password
}).connection;

MongoDB.on('error', function(err) {
    console.log(err.message);
});

MongoDB.once('open', function() {
    console.log('-- mongodb connection open --');
});

exports.db = MongoDB;
