const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { user: "Anonymous", message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
