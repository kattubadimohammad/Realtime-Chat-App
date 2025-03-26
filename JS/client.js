const socket = io();

// Prompt for username until a valid name is entered
let name;
while (!name || name.trim() === "") {
  name = prompt("Enter your name:");
}
name = name.trim();
socket.emit('new-user-joined', name);

// Display a message in the chat
const displayMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  document.getElementById('messages').appendChild(messageElement);
};

// Notify when a user joins
socket.on('user-joined', (userName) => {
  if (userName) {
    displayMessage(`${userName} joined the chat`);
  }
});

// Display received messages
socket.on('receive', (data) => {
  displayMessage(`${data.name}: ${data.message}`);
});

// Notify when a user leaves
socket.on('left', (userName) => {
  if (userName) {
    displayMessage(`${userName} left the chat`);
  }
});

// Sending messages
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    displayMessage(`You: ${message}`);
    socket.emit('send', message);
    input.value = '';
  }
});
