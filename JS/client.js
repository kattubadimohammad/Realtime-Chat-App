// client.js
const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const chatContainer = document.getElementById('chat-container');

// Display messages
function appendMessage(message, className = 'message') {
  const messageElement = document.createElement('p');
  messageElement.classList.add(className);
  messageElement.innerText = message;
  chatContainer.appendChild(messageElement);
}

// Capture and emit messages
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim()) {
    appendMessage(`You: ${message}`, 'user-message');
    socket.emit('send', message);
    messageInput.value = '';
  }
});

// Receive messages from server
socket.on('receive', (data) => {
  appendMessage(`${data.user}: ${data.message}`, 'server-message');
});

// Notify when a user joins
socket.on('user-joined', (name) => {
  appendMessage(`${name} joined the chat`, 'system-message');
});

// Notify when a user leaves
socket.on('user-left', (name) => {
  appendMessage(`${name} left the chat`, 'system-message');
});


// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message, user: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});


// package.json
{
  "name": "chat-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2"
  }
}
