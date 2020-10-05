const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const players = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`> Player connected: ${socket.id}`);

  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: Math.random() < 0.5 ? 'red' : 'blue',
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);

  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
    console.log(`> Player disconnected: ${socket.id}`);

    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});

server.listen(3000, () => {
  console.log(`Listening on ${server.address().port}`);
});
