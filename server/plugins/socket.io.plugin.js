const _ = require('lodash');

exports.register = function (server, options, next) {
  const io = require('socket.io')(server.listener);
  const players = [];
  let clientCount = 0;

  io.on('connection', (socket) => {
    console.log('Player connected with id: ' + socket.id);
    socket.emit('initialize');

    console.log('Player count', players.length);

    socket.on('player:add', function (data, fn) {
      var playerExists = _.some(players, function (val) {
        return val.id == socket.id;
      });

      if (playerExists) {
        console.log('Player already joined in the lobby!');
        fn(null, false);
      } else {
        players.push({ id: socket.id, name: data.name });
        fn({ id: socket.id, name: data.name }, true);
        socket.broadcast.emit('player:joined', { id: socket.id, name: data.name });
        console.log('Added new player.. There are now ' + players.length + ' players');
      }
    });

    socket.on('drawingPageEntered', () => {
      io.emit('players:get', players);
      io.emit('clientCountIncreased', ++clientCount);
    });

    socket.on('drawingPageLeft', () => {
      if ((clientCount.toFixed(0).substr(0) - 1) === 0) {
        clientCount = 0;
        io.emit('clientCountDecreased', clientCount);
      } else {
        io.emit('clientCountDecreased', --clientCount);
      }

      const socketIndex = _.findIndex(players, function (player) {
        return player.id === socket.id;
      });

      if (socketIndex !== -1) {
        players.splice(socketIndex, 1);
        io.emit('players:get', players);
      }
    });

    socket.on('recordMouseEvent', (event) => {
      socket.broadcast.emit('drawn', event);
    });

    socket.on('clearCanvas', (event) => {
      socket.broadcast.emit('clearCanvas');
    });

    socket.on('disconnect', function () {
      console.log('Player disconnected');

      const socketIndex = _.findIndex(players, function (player) {
        return player.id === socket.id;
      });

      if (socketIndex !== -1) {
        players.splice(socketIndex, 1);
        io.emit('players:get', players);
      }
    });
  });

  next();
};

exports.register.attributes = {
  name: 'socket.io',
  version: '1.0.0'
};