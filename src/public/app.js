const socket = io();

const drawerControl = document.getElementById("drawer-control");
const offcanvas = new bootstrap.Offcanvas("#drawer-control");
const chatRoomNameHead = document.getElementById("chat-room-name-head");
const chatMessageBody = document.getElementById("chat-message-area");
const sendMessageForm = document.getElementById("send-message-form");
const roomLists = document.querySelectorAll(".room-list");
const nicknameHeads = document.querySelectorAll(".nickname-head");
const nicknameForms = document.querySelectorAll(".nickname-form");
const createRoomForms = document.querySelectorAll(".create-room-form")

// utility functions
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

// drawer control (offcanvas)
drawerControl.addEventListener("shown.bs.offcanvas", (_) => {
  document.getElementById("nick-input-drawer").focus();
});

drawerControl.addEventListener("hidden.bs.offcanvas", (_) => {
  setTimeout(() => sendMessageForm.querySelector("input").focus(), 100);
});

// set nickname
nicknameForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  if (value === "") return;
  socket.emit("set_nickname", value, () => {
    nicknameHeads.forEach(head => head.innerText = `Nickname: ${value}`);
    event.target.parentElement
        .querySelector(".create-room-form")
        .querySelector("input")
        .focus();
  });
}));

// create rooms
createRoomForms.forEach(form => form.addEventListener("submit", (event) => {
  const value = extractValue(event, form);
  if (value === "") return;
  socket.emit("enter_room", value, () => {
    chatRoomNameHead.innerText = `Room: ${value}`;
    if (drawerControl.contains(event.target)) {
      offcanvas.hide();
    }
    else sendMessageForm.querySelector("input").focus();
  });
}));

// send message
sendMessageForm.addEventListener("submit", (event) => {
  const value = extractValue(event, event.target);
  if (value === "") return;
  socket.emit("send_message", value);
});

// update room info
const noRoomLi = document.createElement("li");
noRoomLi.innerText = "No Rooms Yet";
noRoomLi.classList.add("list-group-item", "disabled");
socket.on("rooms", (roomInfoList) => {
  console.log(roomInfoList.length !== 0);
  roomLists.forEach(list => list.innerHTML = ``);
  if(roomInfoList.length !== 0) roomInfoList.forEach(roomInfo => {
    const roomButtonBase = document.createElement("button");
    roomButtonBase.innerText = `${roomInfo.room} (Users: ${roomInfo.users})`;
    roomButtonBase.classList.add("list-group-item", "list-group-item-action", "px-3");
    roomLists.forEach(list => {
      const roomButton = roomButtonBase.cloneNode(true);
      roomButton.addEventListener("click", (event) => {
        socket.emit("enter_room", roomInfo.room, () => {
          chatRoomNameHead.innerText = `Room: ${roomInfo.room}`;
          if (drawerControl.contains(event.target)) {
            offcanvas.hide();
          }
          else sendMessageForm.querySelector("input").focus();
        });
      });
      list.appendChild(roomButton);
    });
  });
  else roomLists.forEach(list => list.appendChild(noRoomLi.cloneNode(true)));
});

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
socket.on("room_entered", (nickname, room) => {
  const noticePara = document.createElement("p");
  noticePara.classList.add("my-2", "p-2", "w-75", "rounded", "align-self-center", "text-center", "text-bg-info");
  noticePara.innerText = `${nickname} entered ${room}`;
  addMessageAndScroll(noticePara);
});

// somebody leaves current room
socket.on("room_left", (nickname, room) => {
  const noticePara = document.createElement("p");
  noticePara.classList.add("my-2", "p-2", "w-75", "rounded", "align-self-center", "text-center", "text-bg-warning");
  noticePara.innerText = `${nickname} left ${room}`;
  addMessageAndScroll(noticePara);
});

// server sends error
socket.on("error", (message) => {
  alert(message);
});
