import  Express  from "express"
import User from "../models/user.Model.js";
import { addUser } from "../controller/authController.js";

let router=Express.Router();



// export const addUser= async (req,res)=>{
//     let body =await req.body;    
//     console.log(req.body)
//     await User.create({
//       userName: body.name,
//       photoUrl: body.photoURL,
//       email: body.email,
//     });
//   res.statusCode=200;
// }
router.post("/addUser",addUser)

export default router