import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "../models/message.Model.js";
import User from "../models/user.Model.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  method: ["GET", "POST"],
});
let liveUsers = [];
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("create", function (room) {
    socket.join(room);
    console.log("conneted in " + room);
  });

  socket.on("setOnline", async (userMail) => {
    liveUsers.push({ socketId: socket.id, email: userMail });
    if (liveUsers.length > 0) {
      let userData = [];
      for (const { email } of liveUsers) {
        const user = await User.findOne({ email: email }).select(
          " userName photoUrl email"
        );
        userData.push({ user, socketId: socket.id });
      }
      io.emit("getUser", userData);
      userData = [];
    }
  });

  socket.on("publicMessage", (res) => {
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
      console.log(message);
      io.emit("newMesage", message);
    });
  });
  socket.on("privateMessage", (res) => {
    console.log(res);
    let requestBody = res.message;
    Message.create({
      senderName: requestBody.displayName,
      senderemail: requestBody.email,
      photoUrl: requestBody.photoURL,
      text: requestBody.text,
      receiverId: requestBody.receiver,
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
      console.log(message);

      io.to(res.socketId).emit("newMesage", message);
      io.to(socket.id).emit("newMesage", message);
    });
  });
  socket.on("disconnect", () => {
    liveUsers;
    console.log("user disconnected", socket.id);
  });
});

export { io, server, app };
