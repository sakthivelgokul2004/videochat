
import { io } from "socket.io-client";


const socket = io("/rooms", { path: "/api/socket.io", transports: ["websocket"], });
export default socket;
