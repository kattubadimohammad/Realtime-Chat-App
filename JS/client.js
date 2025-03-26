const socket = io('https://realtime-chat-app-dkxc.onrender.com');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('/ting.mp3');

// Append messages with timestamp
const append = (message, position) => {
    const messageElement = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `<b>${timestamp}</b> - ${message}`;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position === 'left') {
        audio.play().catch(error => console.error('Audio play failed:', error));
    }
};

// Send messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Get username
let name;
while (!name || !/^[a-zA-Z0-9_ ]+$/.test(name)) {
    name = prompt("Enter your name to join LetsChat (Alphanumeric only)").trim();
    if (!name) alert("Name cannot be empty. Please enter a valid name.");
}
socket.emit('new-user-joined', name);

// Handle events
socket.on('user-joined', (userName) => {
    append(`${userName} joined the chat`, 'left');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (userName) => {
    append(`${userName} left the chat`, 'left');
});

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('disconnect', () => {
    append("You have been disconnected from the server. Attempting to reconnect...", 'left');
});

socket.on('reconnect_attempt', () => {
    console.log('Reconnecting to server...');
});
