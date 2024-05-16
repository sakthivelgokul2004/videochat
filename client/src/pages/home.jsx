import { useEffect, useState } from "react";
import Room from "../componets/roomController";
import Message from "../componets/messageDisplay";
import { io } from "socket.io-client";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";

export default function Home() {
  const [socket, setSocket] = useSocketContex();
  const [room, setroom] = useRoomContex();
  console.log(room);
  useEffect(() => {
    console.log(socket);
    socket.emit("create", "public");
    setroom("public");
  }, []);

  return (
    <div className="flex flex-row">
      <Room room={room} setroom={setroom} socket={socket} />
      <Message room={room} socket={socket} />
    </div>
  );
}
