const Mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'test') {
  const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  const MongoDB = Mongoose.connect(uri, {
    db: { native_parser: true },
    server: { poolSize: 5 },
    auth: {
      authdb: 'admin'
    },
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD
  }).connection;

  MongoDB.on('error', function(err) {
      console.log(err.message);
  });

  MongoDB.once('open', function() {
      console.log('-- mongodb connection open --');
  });

  exports.db = MongoDB;
}
