const socket = io();

// update room info
socket.on("rooms", () => {});
// message from current room
socket.on("room_message", () => {});
// somebody enters current room
socket.on("room_entered", () => {});
// somebody leaves current room
socket.on("room_left", () => {});
// server sends error
socket.on("error", () => {});
