import { json } from "express";
import User from "../models/user.Model.js";

async function addUser(req, res) {
  let body = req.body;
  let result = User.create({
    userName: body.name,
    photoUrl: body.photoURL,
    email: body.email,
  });
  (await result).save();
}

async function getUserDetail(req, res) {
  let body = req.body;
  if (body.length) {
    let doc = await User.findOne({ email: body[0] });
    console.log(doc);
    console.log(body.length);
    res.json(doc);
  }
}
export { addUser, getUserDetail };
