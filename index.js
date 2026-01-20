import cors from "cors";
import path from "path";
import express, { json } from "express";
import connectDb from "./db/index.js";
import router from "./routes/auth.route.js";
import { createServer } from "http";
import { Server } from "socket.io";
const __dirname = path.resolve();
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser"
import handleSocket from "./socket/roomSocket.js";
import {
  createWorker,
} from "mediasoup";
import MediaSocket from "./socket/mediaSocket.js";
//@-ts-ignore
let worker = createWorker();
(async () => {
  try {

    worker = await createWorker();
  } catch (error) {

    console.log(error)
  }
  //@ts-ignore
  worker.on('died', () => {
    console.error('MediaSoup worker has died');
    process.exit(1);
  });

  //@ts-ignore
  MediaSocket(io, worker);
})();

configDotenv();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  //@ts-ignore
  methods: ["GET", "POST"],
  path: "/api/socket.io",
  transports: ["websocket",],
});
const db = connectDb();
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

handleSocket(io);
const port = process.env.PORT || 3000;
app.use('/api/auth', router);

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
