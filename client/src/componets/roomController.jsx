import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Room() {
  const socket = useSelector((state) => state.Socket.socket);
  useEffect(() => {}, []);
  function createRoom() {
    socket.emit("create", "public");
  }
  return (
    <div className="w-1/4 h-screen flex flex-col items-end ">
      <div className="flex-grow w-full">
        <button onClick={createRoom}> new meeting</button>
        <p>rooms</p>
      </div>
    </div>
  );
}
