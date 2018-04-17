const userRoutes = require('./../routes/user');
const testRoutes = require('./../routes/test');

exports.plugin = {
  name: 'api',
  version: '1.0.0',
  register: (server) => {
    server.route([
      ...userRoutes,
      ...testRoutes
    ]);
  }
};
