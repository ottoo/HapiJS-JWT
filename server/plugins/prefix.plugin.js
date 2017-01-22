const assetsRoutes = require('./../routes/assets');
const userRoutes = require('./../routes/user');
const testRoutes = require('./../routes/test');

exports.register = function (server, options, next) {
  server.route([
    ...assetsRoutes,
    ...userRoutes,
    ...testRoutes
  ]);
  next();
};

exports.register.attributes = {
  name: 'api',
  version: '1.0.0'
};