'use strict';

let Hapi = require('hapi');
let HapiJwt2 = require('hapi-auth-jwt2');
let Inert = require('inert');
let Good = require('good');
let _ = require('lodash');
let Moment = require('moment');
let JWT = require('jsonwebtoken');

let DB = require('./config/db/database');
let routes = require('./routes');

let tokenExpiry = require('./config').tokenExpiry;
let jwtSecret = require('./config').jwtSecret;

let validate = function(decoded, request, callback) {
    var diff = Moment().diff(Moment(decoded.iat * 1000));

    if (diff > tokenExpiry * 1000) {
        return callback(null, false);
    }

    callback(null, true);
};

// Create server instance
let server = new Hapi.Server();
server.connection({
    port: 3334
});

// Register plugins, routes and start the server
server.register([{
    register: require('hapi-cors'),
	options: {
		origins: ['*']
	}
},{
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
        key: jwtSecret,
        validateFunc: validate,
        verifyOptions: {
            algorithms: ['HS256']
        }
    });

    server.route(routes);

    server.start(function() {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
