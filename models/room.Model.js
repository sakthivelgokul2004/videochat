import mongoose from "mongoose";
const schema = new mongoose.Schema({
    userName:String,
    photoUrl:String,
    roomName:String,
    photoUrl:String,
})

const Rom = mongoose.model("rom",schema);

export default Rom;