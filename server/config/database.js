const mongoose = require('mongoose');
const Utils = require('./../utils/utils');

if (!Utils.isTesting()) {
  const authSource = process.env.MONGODB_AUTH_DB || process.env.MONGODB_DATABASE;
  const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.MONGODB_DATABASE}?authSource=${authSource}`;

  const opts = {
    poolSize: 5,
    socketTimeoutMS: 0,
    autoReconnect: true,
    keepAlive: true,
    reconnectInterval: 1000,
    reconnectTries: Number.MAX_VALUE,
    user: process.env.MONGODB_USERNAME,
    pass: process.env.MONGODB_PASSWORD,
    useNewUrlParser: true
  };

  mongoose.connect(uri, opts).then(() => {
    console.log('-- mongodb connection open --');
  }).catch((err) => {
    console.log('-- error happened while connecting to mongodb --');
    console.log(err);
  });
}
