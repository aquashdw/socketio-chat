import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app)
const io = new Server(httpServer);

// collect room info
const countRoom = (roomName) => {
  const rooms = io.sockets.adapter.rooms;
  return rooms.get(roomName)?.size;
};

const getRoomList = () => {
  const roomInfoList = [];
  const {sids, rooms} = io.sockets.adapter;
  rooms.forEach((_, room) => {
    if (sids.get(room) === undefined) roomInfoList.push({
      room, users: countRoom(room),
    })
  });
  return roomInfoList;
}


io.on("connection", socket => {
  socket.emit("rooms", getRoomList());

  // client sets username
  socket.on("set_nickname", (nickname, done) => {
    socket.nickname = nickname;
    done();
  });
  // client enters room
  socket.on("enter_room", (room, done) => {
    if (socket.nickname === undefined) {
      socket.emit("error", "Set Nickname");
      return;
    }
    if (socket.room === room) return;
    if (socket.room !== undefined) {
      io.sockets.in(socket.room).emit("room_left", socket.nickname, socket.room);
      socket.leave(socket.room);
    }
    socket.room = room;
    socket.join(room);
    done();
    // maybe use in?
    // socket.to(room).emit("room_entered", socket.nickname, room);
    // socket.emit("room_entered", "You", room);
    io.sockets.in(room).emit("room_entered", socket.nickname, room);
    io.sockets.emit("rooms", getRoomList());
  });
  // client sends message
  socket.on("send_message", (message) => {
    if (socket.room === undefined) {
      socket.emit("error", "Select a room");
      return;
    }
    if (socket.nickname === undefined) {
      socket.emit("error", "Set Nickname");
      return;
    }
    socket.to(socket.room).emit("room_message", socket.nickname, message, false);
    socket.emit("room_message", "You", message, true);
  });
  // client pre-disconnect
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => {
      socket.to(room).emit("room_left", socket.nickname, room);
    });
    io.sockets.emit("rooms", getRoomList());
  });
  // client post-disconnect
  socket.on("disconnect", () => {
    io.sockets.emit("rooms", getRoomList());
  });
});

const handleListen = () => console.log("using port 3000");
httpServer.listen(3000, handleListen);
