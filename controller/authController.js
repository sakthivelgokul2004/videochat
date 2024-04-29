import User from "../models/user.Model.js"

async function addUser(req, res) {
  let body = req.body;
  console.log(req.body);
  let result = User.create({
      userName: body.name,
      photoUrl: body.photoURL,
      email: body.email,
  });
  (await result).save()
}
export { addUser };