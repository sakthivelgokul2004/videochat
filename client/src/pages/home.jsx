import { useEffect, useState } from "react";
import Room from "../componets/roomController";
import Message from "../componets/messageDisplay";
import { io } from "socket.io-client";

export default function Home() {
  const socket = io();
  const [room, setroom] = useState("public");
  console.log(room);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connet");
    });
    socket.emit("create", "public");
    setroom("public");
  }, []);

  return (
    <div className="flex flex-row">
      <Room room={room} setroom={setroom} />
      <Message room={room} />
    </div>
  );
}
