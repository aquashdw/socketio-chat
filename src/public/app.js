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
  if (value === "") return;
  socket.emit("send_message", value)
});

nicknameForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  if (value === "") return;
  socket.emit("set_nickname", value);
}));

createRoomForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  if (value === "") return;
  socket.emit("create_room", value);
}));

// update room info
socket.on("rooms", () => {});
// message from current room
socket.on("room_message", (nickname, message, me) => {
  const messageDiv = document.createElement("div");
  const nicknameHead = document.createElement("h5");
  const messageContent = document.createElement("p");
  messageDiv.classList.add("my-2");
  messageDiv.style.maxWidth = "75%";
  nicknameHead.innerText = nickname;
  messageContent.classList.add("rounded", "p-2");
  messageContent.innerText = message;
  if (me) {
    messageDiv.classList.add("align-self-end", "text-end");
    messageContent.classList.add("bg-primary-subtle");
  }
  else {
    messageContent.classList.add("bg-secondary-subtle");
  }
  messageDiv.appendChild(nicknameHead);
  messageDiv.appendChild(messageContent);

  chatMessageBody.appendChild(messageDiv);
  chatMessageBody.scrollIntoView({ behavior: 'smooth', block: 'end' });
});
// somebody enters current room
socket.on("room_entered", () => {});
// somebody leaves current room
socket.on("room_left", () => {});
// server sends error
socket.on("error", (message) => {
  alert(message);
});
