exports.register = function (server, options, next) {
  const io = require('socket.io')(server.listener);

  io.on('connection', (socket) => {
    console.info('New websocket connection');
    socket.emit('initialize');
  });

  next();
};

exports.register.attributes = {
  name: 'socket.io',
  version: '1.0.0'
};