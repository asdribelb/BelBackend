const socket = io();
socket.emit("mensaje", "¡Hola, me estoy comunicando desde un websocket!")