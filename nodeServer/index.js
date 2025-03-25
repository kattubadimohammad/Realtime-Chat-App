const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

// Serve static files from the root (for index.html, CSS, JS)
app.use(express.static(__dirname + '/../'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../index.html');
});

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    console.log("New user:", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
