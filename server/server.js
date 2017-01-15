'use strict';

const Hapi = require('hapi');
const HapiJwt2 = require('hapi-auth-jwt2');
const Inert = require('inert');
const Good = require('good');
const _ = require('lodash');
const Moment = require('moment');
const JWT = require('jsonwebtoken');

require('dotenv').config();

const DB = require('./config/db/database');
const routes = require('./routes');

const validate = function(decoded, request, callback) {
    var diff = Moment().diff(Moment(decoded.iat * 1000));

    if (diff > process.env.TOKEN_EXPIRY * 1000) {
        return callback(null, false);
    }

    callback(null, true);
};

// Create server instance
const server = new Hapi.Server();
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
        key: process.env.JWT_SECRET,
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
