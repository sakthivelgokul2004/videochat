import { useEffect, useState } from "react";
import app from "../../firebase.config";
import { useUserContex } from "../contex/userContex";
import { PublicMessage } from "./Messages/publicMessage";
import { MessageNavbar } from "./Messages/MessageNavbar";
import { HandleMessage } from "./Messages/handleMessage";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";
import { Messages } from "./Messages/Messages";

export default function Message(props) {
  const [publicMessages, setPublicMessage] = useState([]);
  const [privateMessages, setPrivateMessage] = useState([]);
  const socket = useSocketContex();
  let [roomobject, setRoom] = useRoomContex();
  let room = roomobject.room;
  let user = useUserContex();
  useEffect(() => {
    socket.on("newMesage", (val) => {
      if (val.receiverId == room) {
        setPublicMessage((prevs) => [...prevs, val]);
        console.log(val);
      }
      console.log(val);
      setPrivateMessage((prevs) => [...prevs, val]);
    });
    return () => {
      socket.off("newMesage");
    };
  }, []);

  return (
    <div className="flex flex-col justify-end w-screen relative overflow-hidden">
      <MessageNavbar
        room={room}
        socketId={roomobject.socketId}
        socket={socket}
      />
      <Messages
        publicMessages={publicMessages}
        Room={room}
        socketId={roomobject.socketId}
        privateMessages={privateMessages}
      />
      <HandleMessage room={room} socket={socket} />
    </div>
  );
}
