import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "../models/message.Model.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  method: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  let user = socket.handshake.query;
  console.log(user);
  socket.on("create", function (room) {
    socket.join(room);
    console.log("conneted in " + room);
  });

  socket.on("message", (res) => {
    console.log(res);
    Message.create({
      senderName: res.displayName,
      senderemail: res.email,
      photoUrl: res.photoURL,
      text: res.text,
      receiverId: res.receiver,
    }).then((val) => {
      let message = {
        senderName: val.senderName,
        senderemail: val.senderemail,
        photoUrl: val.photoUrl,
        text: val.text,
        receiverId: val.receiverId,
        _id: val._id,
        createdAt: val.createdAt,
      };
      console.log(val.photoUrl);
      console.log(message);
      io.emit("newMesage", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

export { io, server, app };
