const socket = new WebSocket('wss://echo.websocket.events');

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const geoButton = document.getElementById('geoButton');

function addMessage(msg, sender) {
    const msgDiv = document.createElement('div');
    if (sender === 'Вы') {
        msgDiv.classList.add('message-sender');
    } else {
        msgDiv.classList.add('message-server');
    }
    msgDiv.innerHTML = `${msg}`;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'Вы');
        socket.send(message);
        messageInput.value = '';
    }
});

socket.addEventListener('open', () => {
    console.log('Соединение установлено');
});

socket.addEventListener('message', (event) => {
    const message = event.data;

    if (message.startsWith('[GEO]')) {
        return;
    }

    addMessage(message, 'Сервер');
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

geoButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const geoLink = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
                const geoMessage = `<a href="${geoLink}" target="_blank">Гео-локация</a>`;

                socket.send(`[GEO]${geoLink}`);
                addMessage(geoMessage, 'Вы');
            },
            (error) => {
                console.error('Ошибка получения геолокации:', error);
                addMessage('Не удалось получить геолокацию.', 'Система');
            }
        );
    } else {
        addMessage('Гео-локация не поддерживается вашим браузером.', 'Система');
    }
});
