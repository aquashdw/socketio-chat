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
  socket.nickname = "Anonymous"
  // client sets username
  socket.on("set_nickname", () => {});
  // client enters room
  socket.on("enter_room", () => {});
  // client sends message
  socket.on("send_message", () => {});
  // client pre-disconnect
  socket.on("disconnecting", () => {});
  // client post-disconnect
});

const handleListen = () => console.log("using port 3000");
httpServer.listen(3000, handleListen);
