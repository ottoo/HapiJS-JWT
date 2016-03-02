'use strict';

var Hapi = require('hapi');
var HapiJwt2 = require('hapi-auth-jwt2');
var Inert = require('inert');
var Good = require('good');
var _ = require('lodash');
var JWT = require('jsonwebtoken');
var mongoose = require('mongoose');

var config = require('./config/config');
console.log(config.getDBAddress())
var routes = require('./routes');

var users = [
        {
            username: 'ottoki',
            password: 'sala'
        }
    ];

var validate = function (decoded, request, callback) {
    let foundUser = _.some(users, (user) => {
        return user.username === decoded.username && user.password === decoded.password;
        console.log('user found')
    });

    console.log(decoded)

    if (!foundUser) {
      return callback(null, false);
    }
    else {
      return callback(null, true);
    }
};

// Create server instance
var server = new Hapi.Server();
server.connection({
    port: 3333
});

// Register plugins, routes and start the server
server.register([{
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, {
    register: Inert,
    options: {}
}, {
    register: HapiJwt2,
    options: {}
}], function(err) {
    if (err) {
        throw err;
    }

    server.auth.strategy('jwt', 'jwt', 'required', { 
        key: 'NeverShareYourSecret',
        validateFunc: validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.route(routes);

    server.start(() => {
        var MongoDB = mongoose.connect(config.getDBAddress()).connection;

        MongoDB.on('error', function(err) { 
            console.log(err.message); 
        });

        MongoDB.once('open', function() {
          console.log("mongodb connection open");
        });
    });
});