'use strict';

let Hapi = require('hapi');
let HapiJwt2 = require('hapi-auth-jwt2');
let Inert = require('inert');
let Good = require('good');
let _ = require('lodash');
let JWT = require('jsonwebtoken');

let DB = require('./config/database');
let routes = require('./routes');

let validate = function (decoded, request, callback) {
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
let server = new Hapi.Server();
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

    server.start(function() {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});