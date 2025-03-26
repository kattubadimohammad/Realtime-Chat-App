const socket = io();

const name = prompt("Enter your name");
socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
  if (name) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${name} joined the chat`;
    document.getElementById('messages').appendChild(messageElement);
  }
});

socket.on('receive', (data) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = `${data.name}: ${data.message}`;
  document.getElementById('messages').appendChild(messageElement);
});

socket.on('left', (name) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = `${name} left the chat`;
  document.getElementById('messages').appendChild(messageElement);
});
