const socket = io();

const chatRoomNameHead = document.getElementById("chat-room-name-head");
const chatMessageBody = document.getElementById("chat-message-area");
const sendMessageForm = document.getElementById("send-message-form");
const roomLists = document.querySelectorAll(".room-list");
const nicknameHeads = document.querySelectorAll(".nickname-head");
const nicknameForms = document.querySelectorAll(".nickname-form");
const createRoomForms = document.querySelectorAll(".create-room-form")

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
