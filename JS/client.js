const socket = io('https://realtime-chat-app-dkxc.onrender.com');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const audio = new Audio('ting.mp3');

// Function to append messages
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (position === 'left') {
        console.log('Sound is playing');
        audio.play().catch(error => console.error('Audio play failed:', error));
    }
};

// Event listener for message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Get username with validation
let name;
while (!name) {
    name = prompt("Enter your name to join LetsChat").trim();
    if (!name) alert("Name cannot be empty. Please enter a valid name.");
}
socket.emit('new-user-joined', name);

// Event listeners for socket events
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (name) => {
    append(`${name} left the chat`, 'left');
});

// Confirm connection
socket.on('connect', () => {
    console.log('Connected to the server');
});

// Handle disconnection
socket.on('disconnect', () => {
    append("You have been disconnected from the server.", 'left');
});
