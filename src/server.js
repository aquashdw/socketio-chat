import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app)
const io = new Server(httpServer);

io.on("connection", socket => {
  // client sets username
  socket.on("set_nickname", (nickname) => {
    socket.nickname = nickname;
  });
  // client creates room
  socket.on("create_room", (room) => {
    if (socket.nickname === undefined) {
      socket.emit("error", "Set Nickname");
      return;
    }
    socket.room = room;
    socket.join(room);
    socket.to(room).emit("room_entered", socket.nickname);
  });
  // client enters room
  socket.on("enter_room", (room) => {
    if (socket.nickname === undefined) {
      socket.emit("error", "Set Nickname");
      return;
    }
    socket.room = room;
    socket.join(room);
    socket.to(room).emit("room_entered", socket.nickname);
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
      socket.to(room).emit("room_left", socket.nickname);
    });
  });
  // client post-disconnect
  socket.on("disconnect", () => {});
});

const handleListen = () => console.log("using port 3000");
httpServer.listen(3000, handleListen);
