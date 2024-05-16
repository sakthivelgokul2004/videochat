import User from "../models/user.Model.js";

async function addUser(req, res) {
  let body = req.body;
  let result = User.create({
    userName: body.displayName,
    photoUrl: body.photoURL,
    email: body.email,
  });
  (await result).save();
}
export { addUser };
