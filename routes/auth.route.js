import Express from "express";
import User from "../models/user.Model.js";
import { addUser, getUserDetail } from "../controller/authController.js";

let router = Express.Router();

router.post("/addUser", addUser);
router.post("/getUserDetail", getUserDetail);

router.get("/nnotu", (req, res) => {});
export default router;
