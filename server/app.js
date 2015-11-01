var Hapi = require('hapi');
var Inert = require('inert');
var Good = require('good');

var routes = require('./routes');

// Create server instance
var server = new Hapi.Server();
server.connection({ port: 3333 });

// Register plugins, routes and start the server
server.register([
    {
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
    },
    {
        register: Inert,
        options: {}
    }
], function (err) {
    if (err) {
        throw err;
    }

    server.route(routes);

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
