import { useEffect, useState } from "react";
import Room from "../componets/roomController";
import { useSelector, useDispatch } from "react-redux";
import Message from "../componets/messageDisplay";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const socket = useSelector((state) => state.Socket.socket);
  const dispach = useDispatch();
  const [room, setroom] = useState();
  console.log(room);
  const auth = getAuth();
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
      <Room room={room} setroom={setroom} />
      <Message room={room} />
    </div>
  );
}
