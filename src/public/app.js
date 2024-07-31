const socket = io();

const chatRoomNameHead = document.getElementById("chat-room-name-head");
const chatMessageBody = document.getElementById("chat-message-area");
const sendMessageForm = document.getElementById("send-message-form");
const roomLists = document.querySelectorAll(".room-list");
const nicknameHeads = document.querySelectorAll(".nickname-head");
const nicknameForms = document.querySelectorAll(".nickname-form");
const createRoomForms = document.querySelectorAll(".create-room-form")

const extractValue = (event, form) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const value = input.value;
  input.value = "";
  return value;
};

sendMessageForm.addEventListener("submit", (event) => {
  const value = extractValue(event, event.target);
  socket.emit("send_message", value)
  console.log(value);
});

nicknameForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  socket.emit("set_nickname", value);
}));

createRoomForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  socket.emit("create_room", value);
}));

// update room info
socket.on("rooms", () => {});
// message from current room
socket.on("room_message", (nickname, message, me) => {
  console.log(nickname, message, me);
});
// somebody enters current room
socket.on("room_entered", () => {});
// somebody leaves current room
socket.on("room_left", () => {});
// server sends error
socket.on("error", (message) => {
  alert(message);
});
