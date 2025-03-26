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
