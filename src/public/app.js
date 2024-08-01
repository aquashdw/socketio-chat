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

const addMessageAndScroll = (element) => {
  chatMessageBody.appendChild(element);
  chatMessageBody.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
  messageDiv.style.maxWidth = "75%";
  nicknameHead.innerText = nickname;
  messageContent.classList.add("rounded", "p-2");
  messageContent.innerText = message;
  if (me) {
    messageDiv.classList.add("align-self-end", "text-end");
    messageContent.classList.add("bg-primary-subtle");
  }
  else {
    messageDiv.classList.add("align-self-start");
    messageContent.classList.add("bg-secondary-subtle");
  }
  messageDiv.appendChild(nicknameHead);
  messageDiv.appendChild(messageContent);

  addMessageAndScroll(messageDiv);
});
// somebody enters current room
socket.on("room_entered", (nickname) => {
  const noticePara = document.createElement("p");
  noticePara.classList.add("my-2", "p-2", "w-75", "rounded", "align-self-center", "text-center", "text-bg-info");
  noticePara.innerText = `${nickname} entered the room`;
  addMessageAndScroll(noticePara);
});
// somebody leaves current room
socket.on("room_left", (nickname) => {
  const noticePara = document.createElement("p");
  noticePara.classList.add("my-2", "p-2", "w-75", "rounded", "align-self-center", "text-center", "text-bg-warning");
  noticePara.innerText = `${nickname} left the room`;
  addMessageAndScroll(noticePara);
});
// server sends error
socket.on("error", (message) => {
  alert(message);
});
