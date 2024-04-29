import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  method: ["GET", "POST"],
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.emit("hi", () => {
    console.log("noy");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
  socket.on('create', function(room) {
    socket.join(room);
    console.log("conneted in " + room)
  });
  socket.on("message", (val) => {
    console.log(val);
    io.emit("newMesage", val);
  })
});

export { io, server, app };
