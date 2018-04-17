exports.plugin = {
  name: 'frontend-static-route',
  version: '1.0.0',
  register: (server) => {
    server.route({
      method: 'GET',
      path: '/static/{path*}',
      config: {
        auth: false
      },
      handler: {
        directory: {
          path: '../../frontend/dist/static',
          listing: false,
          redirectToSlash: true
        }
      }
    });
    server.route({
      method: 'GET',
      path: '/{path*}',
      config: {
        auth: false
      },
      handler: {
        file: {
          path: '../../frontend/dist/index.html',
          confine: false
        }
      }
    });
  }
};
