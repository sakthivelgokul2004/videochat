import { useEffect, useRef, useState } from "react";
import Room from "./roomController";
import { useUserContex } from "../contex/userContex";
import socket from "../utils/messageSocket";
import { MessageNavbar } from "./Messages/MessageNavbar";
import Silder from "./silder";
import ResizableSlider from "./ResizableSlider";
import Pane from "./pane";
export default function Dashboard() {
  const [user, setUser] = useUserContex()
  const [room, setRoom] = useState({ roomName: "public", socketId: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isConsumer, setConsumer] = useState(false);
  useEffect(() => {
    socket.emit("setOnline", user.email);
    setRoom((prevs) => ({ ...prevs, roomName: "public" }));
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="relative flex w-screen h-screen ">
      <div className="w-1/4">
        <MessageNavbar
          room={room.roomName}
          socketId={room.socketId}
          socket={socket}
        />
        <Room socket={socket} room={room} setRoom={setRoom} />
      </div>
      <Pane room={room} socket={socket} setRoom={setRoom} setOpen={setIsOpen} isConsumer={setConsumer} isOpen={isOpen}/>
     
    </div>
  );
}
//<ResizableSlider isOpen={isOpen} onClose={() => setIsOpen(false)}>
//  <Silder isConsumer={isConsumer} />
//</ResizableSlider>
