import { useEffect, useState } from "react";
import Room from "./roomController";
import Message from "./messageDisplay";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";

export default function Home() {
  const socket = useSocketContex();
  const [room, setroom] = useRoomContex();
  useEffect(() => {
    socket.emit("create", "public");
    setroom("public");
  }, []);

  return (
    <div className="flex flex-row">
      <Room />
      <Message room={room} socket={socket} />
    </div>
  );
}
