exports.plugin = {
  name: 'socket.io',
  version: '1.0.0',
  register: (server) => {
    const io = require('socket.io')(server.listener);

    io.on('connection', (socket) => {
      console.log('New connection!', socket.id);
    });
  }
};
