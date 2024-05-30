import { useEffect, useRef, useState } from "react";
import Room from "./roomController";
import Message from "./messageDisplay";
import { useRoomContex, useSocketContex } from "../contex/SocketContex";
import { useUserContex } from "../contex/userContex";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = useUserContex();
  const socket = useSocketContex();
  const [room, setroom] = useRoomContex();
  const [remoteRoom, setRemoteRoom] = useState();
  const navigate = useNavigate();

  const modelRef = useRef();
  useEffect(() => {
    socket.emit("setOnline", user.email);
    socket.emit("create", "public");
    setroom((prevs) => ({ ...prevs, room: "public" }));
    socket.on("CallOffer", async (res) => {
      console.log(res);

      modelRef.current.showModal();
      setRemoteRoom(res);
    });

    return () => {
      socket.off("CallOffer");
    };
  }, []);
  function handleCall() {
    navigate(`/VideoChat/${remoteRoom}/reciver`);
  }
  return (
    <div className="flex flex-row">
      <Room />
      <Message room={room} socket={socket} />
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_2" className="modal" ref={modelRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
          <button onClick={handleCall}>close</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
