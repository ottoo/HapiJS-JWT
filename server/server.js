'use strict';

const Hapi = require('hapi');
const HapiJwt2 = require('hapi-auth-jwt2');
const Inert = require('inert');
const Good = require('good');
const _ = require('lodash');
const JWT = require('jsonwebtoken');

require('dotenv').config();

const DB = require('./config/db/database');

// Create server instance
const server = new Hapi.Server();
server.connection({
  port: 3334
});

// Register plugins, routes and start the server
server.register([{
  register: Inert,
  options: {}
}, {
  register: HapiJwt2,
  options: {}
}, {
  register: require('./plugins/auth.strategy.plugin')
}, {
  register: require('./plugins/prefix.plugin'),
  routes: {
    prefix: '/api'
  }
}, {
  register: require('./plugins/socket.io.plugin')
}, {
  register: require('hapi-cors'),
  options: {
    origins: ['*']
  }
}, {
  register: Good,
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          log: '*',
          response: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}], function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});

module.exports = server;
