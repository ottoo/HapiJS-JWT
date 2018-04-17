const Hapi = require('hapi');
const HapiJwt2 = require('hapi-auth-jwt2');
const Inert = require('inert');
const Good = require('good');
const { parsed } = require('dotenv').config();

const Utils = require('./utils/utils');
require('./config/database');

Utils.verifyEnvVars(parsed);

const registerPlugins = async (server) => {
  await server.register([{
    plugin: Inert,
    options: {}
  }, {
    plugin: HapiJwt2
  }, {
    plugin: require('./plugins/auth.strategy.plugin')
  }, {
    plugin: require('./plugins/prefix.plugin'),
    routes: {
      prefix: '/api'
    }
  }, {
    plugin: require('./plugins/frontend.static.route.plugin')
  }, {
    plugin: require('./plugins/socket.io.plugin')
  }]);

  if (!Utils.isTesting()) {
    await server.register({
      plugin: Good,
      options: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              error: '*',
              response: '*'
            }]
          }, {
            module: 'good-console'
          }, 'stdout']
        }
      }
    });
  }
};

const initialize = async ({ port }) => {
  const server = new Hapi.Server({
    port,
    routes: {
      cors: true,
      files: {
        relativeTo: __dirname
      }
    },
    router: {
      stripTrailingSlash: true
    }
  });

  await registerPlugins(server);

  process.on('SIGINT', () => {
    console.log('Server shutting down..');

    server.stop({ timeout: 5000 }).then(() => {
      console.log('Server shut down.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });

  await server.start();
  return server;
};

if (!Utils.isTesting()) {
  initialize({ port: 3334 }).then((server) => {
    console.log(`Server running at: ${server.info.uri}`);
  });
}

module.exports = { initialize };
