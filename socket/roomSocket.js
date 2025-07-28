import Message from "../models/message.Model.js";
import User from "../models/user.Model.js";
import signal from "../utils/SocketSignal.js";
/** @typedef {import("socket.io").Server} SocketIOServer */
/**
 * @param {SocketIOServer} io
 */
function handleSocket(io) {

  let liveUserStore = signal();;
  const Room = io.of("/rooms");
  async function BroadCasstLiveUser() {
    const user = liveUserStore.getalluser();
    if (user.length > 0) {
      let userData = [];
      userData = user.map(async (user) => {
        console.log("user", user);
        let cur = await User.findOne({ email: user.userid }).select(
          " userName photoUrl email"
        );
        console.log(cur)
        return { user: cur, socketId: user.socketid };
      })
      userData = await Promise.all(userData);
      console.log("io")
      return userData;
    }
  }

  Room.on("connection", (socket) => {

    //socket.timeout(1000).emit("getUser", () => { return BroadCasstLiveUser() });
    socket.on("setOnline", async (userMail) => {
      liveUserStore.setuser(socket.id, userMail);
      console.log("user connected", socket.id, userMail);
      let userData = await BroadCasstLiveUser();
      Room.emit("getUser", userData);
    });

    socket.on("publicMessage", (res) => {
      console.log("publicMessage", res);
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
        Room.emit("newMesage", message);
      });
    });
    socket.on("privateMessage", (res) => {
      console.log("privateMessage", res.message);
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
        Room.to(res.socketId).emit("newMesage", { message, socketId: socket.id });
        Room.to(socket.id).emit("newMesage", { message, socketId: res.socketId });
      });
    });
    socket.on("disconnect", () => {
      liveUserStore.deleteuser(socket.id);
      BroadCasstLiveUser();
      console.log("user disconnected", socket.id);
    });
  });

}
export default handleSocket;
