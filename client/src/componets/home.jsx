import { useEffect, useState } from "react";
import Room from "./roomController";
import Message from "./messageDisplay";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";
import { useUserContex } from "../contex/userContex";

export default function Home() {
  const user = useUserContex();
  const socket = useSocketContex();
  const [room, setroom] = useRoomContex();
  useEffect(() => {
    socket.emit("setOnline", user.email);
    socket.emit("create", "public");
    setroom((prevs) => ({ ...prevs, room: "public" }));

    return () => {
      socket.off("setOnline");
    };
  }, []);
  return (
    <div className="flex flex-row">
      <Room />
      <Message room={room} socket={socket} />
    </div>
  );
}
