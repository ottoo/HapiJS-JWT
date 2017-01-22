const routes = require('./../routes/user');

exports.register = function (server, options, next) {
    server.route(routes);
    next();
};

exports.register.attributes = {
    name: 'api',
    version: '1.0.0'
};