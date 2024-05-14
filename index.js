import { io, server, app } from "./socket/socket.js";
import cors from "cors";
import path from "path";
import express, { json } from "express";
import connectDb from "./db/index.js";
import router from "./routes/auth.route.js";
const __dirname = path.resolve();
import User from "./models/user.Model.js";
import { configDotenv } from "dotenv";
configDotenv();
app.use(express.static(path.join(__dirname, "/client/dist")));
const port = process.env.PORT || 3000;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use(express.json());
app.use(router);

app.use(
  cors({
    origin: "*",
    methods: ["GET,POST"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
const db = connectDb();
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
