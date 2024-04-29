import { useEffect } from "react";
import Room from "../componets/roomController";
import { useSelector, useDispatch } from "react-redux";
import Message from "../componets/messageDisplay";

export default function Home() {
  const socket = useSelector((state) => state.Socket.socket);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connet");
    });
    socket.on("hi", () => {
      console.log("noy");
    });
  }, []);

  return (
    <div className="flex flex-row">
      <Room />
      <Message />

    </div>
  );
}
