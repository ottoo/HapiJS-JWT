const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

if (process.env.NODE_ENV !== 'test') {
  const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  const MongoDB = mongoose.connect(uri, {
    useMongoClient: true,
    poolSize: 5,
    reconnectInterval: 1000,
    reconnectTries: Number.MAX_VALUE,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD
  }).then(() => {
    console.log('-- mongodb connection open --');
  });
}
