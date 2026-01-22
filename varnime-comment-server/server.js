const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const users = {};

io.on("connection", socket => {

  socket.on("login", username => {
    users[socket.id] = { username, count: 0 };
  });

  socket.on("comment", text => {
    const user = users[socket.id];
    if (!user) return;

    user.count++;
    io.emit("comment", {
      user: user.username,
      text
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("Komentar server jalan di :3000");
});
