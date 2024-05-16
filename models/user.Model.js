import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  userName: String,
  photoUrl: String,
  email: String,
});
const User = mongoose.model("User", userschema);

export default User;
