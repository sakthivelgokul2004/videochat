
import { io } from "socket.io-client";


const socket = io("http://localhost:3000/rooms", { path: "/api/socket.io", transports: ["websocket"], });
export default socket;
