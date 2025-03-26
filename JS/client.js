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
