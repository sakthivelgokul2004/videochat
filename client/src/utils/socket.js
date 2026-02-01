import { io } from "socket.io-client";


const socket = io("/media", { path: "/api/socket.io", transports: ["websocket"], });
export default socket;
