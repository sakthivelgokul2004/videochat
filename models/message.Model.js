import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    senderName: String,
    senderemail: String,
    photoUrl: String,
    text: String,
    receiverId: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", schema);

export default Message;
