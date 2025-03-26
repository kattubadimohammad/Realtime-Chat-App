const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', (socket) => {
  console.log("New connection established", socket.id);
  
  socket.on('new-user-joined', (name) => {
    if (name) {
      console.log(`User connected: ${name}, Socket ID: ${socket.id}`);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
    }
  });

  socket.on('send', (message) => {
    console.log(`Message from ${users[socket.id]}: ${message}`);
    if (message && users[socket.id]) {
      socket.broadcast.emit('receive', { message, name: users[socket.id] });
    }
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      console.log(`User disconnected: ${users[socket.id]}, Socket ID: ${socket.id}`);
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
    }
  });
});

// Set the port to listen on
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
